import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { Department } from '@/interfaces/department.interface';
import { buildData } from '@/utils/pagination';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '@/dtos/department.dto';

class DepartmentService extends MainService {
  public async findAll({
    limit = 20,
    page = 1,
  }: paginationDto): Promise<{ info: any; data: Department[] }> {
    try {
      const skip = (page - 1) * limit;
      // Get total count for pagination metadata
      const total = await this.model.department.countDocuments({});

      // Use database-level pagination with faculty population
      const departments = await this.model.department
        .find({})
        .populate('faculty_id', 'title')
        .skip(skip)
        .limit(limit);

      return buildData({
        results: departments,
        skip: page,
        limit,
        currentLength: departments.length,
        total,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Department> {
    try {
      return await this.model.department
        .findById(id)
        .populate('faculty_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByFacultyId(facultyId: string): Promise<Department[]> {
    try {
      return await this.model.department
        .find({ faculty_id: facultyId })
        .populate('faculty_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByTitle(title: string): Promise<Department> {
    try {
      return await this.model.department
        .findOne({ title })
        .populate('faculty_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(
    createDepartmentDto: CreateDepartmentDto
  ): Promise<Department> {
    try {
      // Check if faculty exists
      const facultyExists = await this.model.faculty.findById(
        createDepartmentDto.faculty_id
      );
      if (!facultyExists) {
        throw new Error('Faculty not found');
      }

      const checkExistDepartment = await this.model.department.findOne({
        title: createDepartmentDto.title,
        faculty_id: createDepartmentDto.faculty_id,
      });

      if (!checkExistDepartment) {
        const createDepartment = await this.model.department.create({
          ...createDepartmentDto,
          created_at: new Date(),
          updated_at: new Date(),
        });
        return await this.findById(createDepartment._id.toString());
      }
      throw new Error(
        'Department with this title already exists in this faculty'
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto
  ): Promise<Department> {
    try {
      // Check if faculty exists if faculty_id is being updated
      if (updateDepartmentDto.faculty_id) {
        const facultyExists = await this.model.faculty.findById(
          updateDepartmentDto.faculty_id
        );
        if (!facultyExists) {
          throw new Error('Faculty not found');
        }
      }

      const updatedDepartment = await this.model.department.findByIdAndUpdate(
        id,
        {
          ...updateDepartmentDto,
          updated_at: new Date(),
        },
        { new: true }
      );
      return await this.findById(updatedDepartment._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.department.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default DepartmentService;
