import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { Form } from '@/interfaces/form.interface';
import { buildData } from '@/utils/pagination';
import {
  CreateFormDto,
  UpdateFormDto,
} from '@/dtos/form.dto';
import { HttpException } from '@/exceptions/HttpException';

class FormService extends MainService {
  public async findAll({
    limit = 20,
    page = 1,
  }: paginationDto): Promise<{ info: any; data: Form[] }> {
    try {
      const skip = (page - 1) * limit;
      // Get total count for pagination metadata
      const total = await this.model.form.countDocuments({});

      // Use database-level pagination with population
      const forms = await this.model.form
        .find({})
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'firstname lastname email')
        .populate('intake_programs.program_id', 'title')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);

      return buildData({
        results: forms,
        skip: page,
        limit,
        currentLength: forms.length,
        total,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Form> {
    try {
      return await this.model.form
        .findById(id)
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'firstname lastname email')
        .populate('intake_programs.program_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByAdmissionId(admissionId: string): Promise<Form[]> {
    try {
      return await this.model.form
        .find({ admission_id: admissionId })
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'firstname lastname email')
        .populate('intake_programs.program_id', 'title')
        .sort({ created_at: -1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByProgramId(programId: string): Promise<Form[]> {
    try {
      return await this.model.form
        .find({ 'intake_programs.program_id': programId })
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'firstname lastname email')
        .populate('intake_programs.program_id', 'title')
        .sort({ created_at: -1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByStatus(status: 'received' | 'verified'): Promise<Form[]> {
    try {
      return await this.model.form
        .find({ status })
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'firstname lastname email')
        .populate('intake_programs.program_id', 'title')
        .sort({ created_at: -1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(createFormDto: CreateFormDto): Promise<Form> {
    try {
      // Check if user exists
      const userExists = await this.model.user.findById(
        createFormDto.user_id
      );
      if (!userExists) {
        throw new HttpException(404, 'User not found');
      }

      // Check if admission exists
      const admissionExists = await this.model.admission.findById(
        createFormDto.admission_id
      );
      if (!admissionExists) {
        throw new HttpException(404, 'Admission not found');
      }

      // Check if faculty exists
      const facultyExists = await this.model.faculty.findById(
        createFormDto.faculty_id
      );
      if (!facultyExists) {
        throw new HttpException(404, 'Faculty not found');
      }

      // Check if department exists
      const departmentExists = await this.model.department.findById(
        createFormDto.department_id
      );
      if (!departmentExists) {
        throw new HttpException(404, 'Department not found');
      }

      // Validate all program ids and check duplicates within same admission/user
      const programIds = createFormDto.intake_programs.map(p => p.program_id);
      const programs = await this.model.program.find({ _id: { $in: programIds } });
      if (programs.length !== programIds.length) {
        throw new HttpException(404, 'One or more programs not found');
      }

      const existingForm = await this.model.form.findOne({
        admission_id: createFormDto.admission_id,
        user_id: createFormDto.user_id,
      });

      if (existingForm) {
        throw new HttpException(409, 'Form already exists for this user and admission');
      }

      const createForm = await this.model.form.create({
        ...createFormDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.findById(createForm._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(id: string, updateFormDto: UpdateFormDto): Promise<Form> {
    try {
      // Check if form exists
      const existingForm = await this.model.form.findById(id);
      if (!existingForm) {
        throw new HttpException(404, 'Form not found');
      }

      // Check if admission exists if admission_id is being updated
      if (updateFormDto.admission_id) {
        const admissionExists = await this.model.admission.findById(
          updateFormDto.admission_id
        );
        if (!admissionExists) {
          throw new HttpException(404, 'Admission not found');
        }
      }

      // Check if faculty exists if faculty_id is being updated
      if (updateFormDto.faculty_id) {
        const facultyExists = await this.model.faculty.findById(
          updateFormDto.faculty_id
        );
        if (!facultyExists) {
          throw new HttpException(404, 'Faculty not found');
        }
      }

      // Check if department exists if department_id is being updated
      if (updateFormDto.department_id) {
        const departmentExists = await this.model.department.findById(
          updateFormDto.department_id
        );
        if (!departmentExists) {
          throw new HttpException(404, 'Department not found');
        }
      }

      // Validate programs if intake_programs is being updated
      if (updateFormDto.intake_programs) {
        const programIds = updateFormDto.intake_programs.map(p => p.program_id);
        const programs = await this.model.program.find({ _id: { $in: programIds } });
        if (programs.length !== programIds.length) {
          throw new HttpException(404, 'One or more programs not found');
        }
      }

      // Check for duplicate if admission_id or user_id is being updated
      if (updateFormDto.admission_id || updateFormDto.user_id) {
        const duplicateForm = await this.model.form.findOne({
          _id: { $ne: id },
          admission_id: updateFormDto.admission_id || existingForm.admission_id,
          user_id: updateFormDto.user_id || existingForm.user_id,
        });

        if (duplicateForm) {
          throw new HttpException(409, 'Another form already exists for this user and admission');
        }
      }

      const updatedForm = await this.model.form.findByIdAndUpdate(
        id,
        {
          ...updateFormDto,
          updated_at: new Date(),
        },
        { new: true }
      );

      return await this.findById(updatedForm._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.form.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateStatus(id: string, status: 'received' | 'verified'): Promise<Form> {
    try {
      const form = await this.model.form.findById(id);
      if (!form) {
        throw new HttpException(404, 'Form not found');
      }

      const updatedForm = await this.model.form.findByIdAndUpdate(
        id,
        {
          status,
          updated_at: new Date(),
        },
        { new: true }
      );

      return await this.findById(updatedForm._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default FormService;
