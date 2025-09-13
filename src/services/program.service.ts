import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { Program } from '@/interfaces/program.interface';
import { buildData } from '@/utils/pagination';
import { CreateProgramDto, UpdateProgramDto } from '@/dtos/program.dto';
import { HttpException } from '@/exceptions/HttpException';

class ProgramService extends MainService {
  public async findAll({
    limit = 20,
    page = 1,
  }: paginationDto): Promise<{ info: any; data: Program[] }> {
    try {
      const skip = (page - 1) * limit;
      // Get total count for pagination metadata
      const total = await this.model.program.countDocuments({});

      // Use database-level pagination with faculty and department population
      const programs = await this.model.program
        .find({})
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .skip(skip)
        .limit(limit);

      return buildData({
        results: programs,
        skip: page,
        limit,
        currentLength: programs.length,
        total,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Program> {
    try {
      return await this.model.program
        .findById(id)
        .populate('faculty_id', 'title')
        .populate('department_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByFacultyId(facultyId: string): Promise<Program[]> {
    try {
      return await this.model.program
        .find({ faculty_id: facultyId })
        .populate('faculty_id', 'title')
        .populate('department_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByDepartmentId(departmentId: string): Promise<Program[]> {
    try {
      return await this.model.program
        .find({ department_id: departmentId })
        .populate('faculty_id', 'title')
        .populate('department_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByDegreeLevel(
    degreeLevel: 'master' | 'doctoral'
  ): Promise<Program[]> {
    try {
      return await this.model.program
        .find({ degree_level: degreeLevel })
        .populate('faculty_id', 'title')
        .populate('department_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByTitle(title: string): Promise<Program> {
    try {
      return await this.model.program
        .findOne({ title })
        .populate('faculty_id', 'title')
        .populate('department_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(createProgramDto: CreateProgramDto): Promise<Program> {
    try {
      // Check if faculty exists
      const facultyExists = await this.model.faculty.findById(
        createProgramDto.faculty_id
      );
      if (!facultyExists) {
        throw new HttpException(404, 'Faculty not found');
      }

      // Check if department exists if provided
      if (createProgramDto.department_id) {
        const departmentExists = await this.model.department.findById(
          createProgramDto.department_id
        );
        if (!departmentExists) {
          throw new HttpException(404, 'Department not found');
        }
      }

      const checkExistProgram = await this.model.program.findOne({
        title: createProgramDto.title,
        faculty_id: createProgramDto.faculty_id,
      });

      if (checkExistProgram) {
        throw new HttpException(409, 'Program with this title already exists in this faculty');
      }
      
      const createProgram = await this.model.program.create({
        ...createProgramDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.findById(createProgram._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(
    id: string,
    updateProgramDto: UpdateProgramDto
  ): Promise<Program> {
    try {
      // Check if faculty exists if faculty_id is being updated
      if (updateProgramDto.faculty_id) {
        const facultyExists = await this.model.faculty.findById(
          updateProgramDto.faculty_id
        );
        if (!facultyExists) {
          throw new HttpException(404, 'Faculty not found');
        }
      }

      // Check if department exists if department_id is being updated
      if (updateProgramDto.department_id) {
        const departmentExists = await this.model.department.findById(
          updateProgramDto.department_id
        );
        if (!departmentExists) {
          throw new HttpException(404, 'Department not found');
        }
      }

      const updatedProgram = await this.model.program.findByIdAndUpdate(
        id,
        {
          ...updateProgramDto,
          updated_at: new Date(),
        },
        { new: true }
      );
      return await this.findById(updatedProgram._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.program.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ProgramService;
