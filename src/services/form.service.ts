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
    search,
    search_option,
    status,
    admission_id,
    faculty_id,
    department_id,
    program_id,
    submitter_name,
    submitter_email,
    date_start,
    date_end,
    sort,
    sort_option,
  }: paginationDto): Promise<{ info: any; data: Form[] }> {
    try {
      const skip = (page - 1) * limit;
      
      // Build filter query
      const filterQuery: any = {};

      // Status filter
      if (status) {
        filterQuery.status = status;
      }

      // ID-based filters
      if (admission_id) {
        filterQuery.admission_id = admission_id;
      }
      if (faculty_id) {
        filterQuery.faculty_id = faculty_id;
      }
      if (department_id) {
        filterQuery.department_id = department_id;
      }

      // Program filter (search within intake_programs array)
      if (program_id) {
        filterQuery['intake_programs.program_id'] = program_id;
      }

      // Submitter filters
      if (submitter_name) {
        filterQuery['submitter.name'] = { $regex: submitter_name, $options: 'i' };
      }
      if (submitter_email) {
        filterQuery['submitter.email'] = { $regex: submitter_email, $options: 'i' };
      }

      // Date range filters
      if (date_start || date_end) {
        filterQuery.created_at = {};
        if (date_start) {
          filterQuery.created_at.$gte = new Date(date_start);
        }
        if (date_end) {
          filterQuery.created_at.$lte = new Date(date_end);
        }
      }

      // Search functionality
      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        
        if (search_option) {
          // Search in specific field
          switch (search_option) {
            case 'submitter_name':
              filterQuery['submitter.name'] = searchRegex;
              break;
            case 'submitter_email':
              filterQuery['submitter.email'] = searchRegex;
              break;
            case 'submitter_phone':
              filterQuery['submitter.phone'] = searchRegex;
              break;
            default:
              // Default search across multiple fields
              filterQuery.$or = [
                { 'submitter.name': searchRegex },
                { 'submitter.email': searchRegex },
                { 'submitter.phone': searchRegex },
              ];
          }
        } else {
          // Global search across multiple fields
          filterQuery.$or = [
            { 'submitter.name': searchRegex },
            { 'submitter.email': searchRegex },
            { 'submitter.phone': searchRegex },
          ];
        }
      }

      // Get total count for pagination metadata
      const total = await this.model.form.countDocuments(filterQuery);

      // Build sort options
      let sortOptions: any = { created_at: -1 }; // Default sort
      if (sort && sort_option) {
        const sortDirection = sort === 1 ? 1 : -1;
        sortOptions = { [sort_option]: sortDirection };
      }

      // Use database-level pagination with population
      const forms = await this.model.form
        .find(filterQuery)
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'name email')
        .populate('intake_programs.program_id', 'title')
        .sort(sortOptions)
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

  public async findAllByUser(userId: string, {
    limit = 20,
    page = 1,
    search,
    search_option,
    status,
    admission_id,
    faculty_id,
    department_id,
    program_id,
    submitter_name,
    submitter_email,
    date_start,
    date_end,
    sort,
    sort_option,
  }: paginationDto): Promise<{ info: any; data: Form[] }> {
    try {
      const findUser = await this.model.user.findById(userId);
      if (!findUser) throw new HttpException(404, "User not found");

      const skip = (page - 1) * limit;
      
      // Build filter query
      const filterQuery: any = { userId: userId };

      // Status filter
      if (status) {
        filterQuery.status = status;
      }

      // ID-based filters
      if (admission_id) {
        filterQuery.admission_id = admission_id;
      }
      if (faculty_id) {
        filterQuery.faculty_id = faculty_id;
      }
      if (department_id) {
        filterQuery.department_id = department_id;
      }

      // Program filter (search within intake_programs array)
      if (program_id) {
        filterQuery['intake_programs.program_id'] = program_id;
      }

      // Submitter filters
      if (submitter_name) {
        filterQuery['submitter.name'] = { $regex: submitter_name, $options: 'i' };
      }
      if (submitter_email) {
        filterQuery['submitter.email'] = { $regex: submitter_email, $options: 'i' };
      }

      // Date range filters
      if (date_start || date_end) {
        filterQuery.created_at = {};
        if (date_start) {
          filterQuery.created_at.$gte = new Date(date_start);
        }
        if (date_end) {
          filterQuery.created_at.$lte = new Date(date_end);
        }
      }

      // Search functionality
      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        
        if (search_option) {
          // Search in specific field
          switch (search_option) {
            case 'submitter_name':
              filterQuery['submitter.name'] = searchRegex;
              break;
            case 'submitter_email':
              filterQuery['submitter.email'] = searchRegex;
              break;
            case 'submitter_phone':
              filterQuery['submitter.phone'] = searchRegex;
              break;
            default:
              // Default search across multiple fields
              filterQuery.$or = [
                { 'submitter.name': searchRegex },
                { 'submitter.email': searchRegex },
                { 'submitter.phone': searchRegex },
              ];
          }
        } else {
          // Global search across multiple fields
          filterQuery.$or = [
            { 'submitter.name': searchRegex },
            { 'submitter.email': searchRegex },
            { 'submitter.phone': searchRegex },
          ];
        }
      }

      // Get total count for pagination metadata
      const total = await this.model.form.countDocuments(filterQuery);

      // Build sort options
      let sortOptions: any = { created_at: -1 }; // Default sort
      if (sort && sort_option) {
        const sortDirection = sort === 1 ? 1 : -1;
        sortOptions = { [sort_option]: sortDirection };
      }

      // Use database-level pagination with population
      const forms = await this.model.form
        .find(filterQuery)
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'name email')
        .populate('intake_programs.program_id', 'title')
        .sort(sortOptions)
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
        .populate('user_id', 'name email')
        .populate('intake_programs.program_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(userId: string, createFormDto: CreateFormDto): Promise<Form> {
    try {
      // Check if user exists
      const userExists = await this.model.user.findById(userId);
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

  public async update(id: string, userId: string, updateFormDto: UpdateFormDto): Promise<Form> {
    try {
      // Check if form exists
      const existingForm = await this.model.form.findById(id);
      if (!existingForm) {
        throw new HttpException(404, 'Form not found');
      }

      // Check update permission
      const user = await this.model.user.findById(userId);
      if (user.role !== 'admin' && user._id !== existingForm.user_id) {
        throw new HttpException(403, 'You do not have permission to update this form')
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
}

export default FormService;