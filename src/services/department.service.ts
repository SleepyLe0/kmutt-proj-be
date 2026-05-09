import mongoose from 'mongoose';
import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { Department } from '@/interfaces/department.interface';
import { buildData } from '@/utils/pagination';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '@/dtos/department.dto';
import { HttpException } from '@/exceptions/HttpException';

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
      const pipeline: any[] = [
        {
          $addFields: {
            sortOrder: {
              $cond: { if: { $eq: ['$order', 0] }, then: 999999, else: '$order' },
            },
          },
        },
        { $sort: { sortOrder: 1, created_at: -1 } },
        { $skip: skip },
      ];

      if (limit > 0) {
        pipeline.push({ $limit: limit });
      }

      pipeline.push(
        {
          $lookup: {
            from: 'faculties',
            localField: 'faculty_id',
            foreignField: '_id',
            as: 'faculty_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } }
      );

      const departments = await this.model.department.aggregate(pipeline);

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

  public async findAllActive({
    limit = 20,
    page = 1,
  }: paginationDto): Promise<{ info: any; data: Department[] }> {
    try {
      const skip = (page - 1) * limit;
      const filter = { active: true };
      const total = await this.model.department.countDocuments(filter);

      const pipeline: any[] = [
        { $match: filter },
        {
          $addFields: {
            sortOrder: {
              $cond: { if: { $eq: ['$order', 0] }, then: 999999, else: '$order' },
            },
          },
        },
        { $sort: { sortOrder: 1, created_at: -1 } },
        { $skip: skip },
      ];

      if (limit > 0) {
        pipeline.push({ $limit: limit });
      }

      pipeline.push(
        {
          $lookup: {
            from: 'faculties',
            localField: 'faculty_id',
            foreignField: '_id',
            as: 'faculty_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } }
      );

      const departments = await this.model.department.aggregate(pipeline);

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
      const department = await this.model.department
        .findById(id)
        .populate('faculty_id', 'title');
      if (!department) throw new HttpException(404, 'Department not found');
      return department;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByFacultyId(facultyId: string): Promise<Department[]> {
    try {
      return await this.model.department.aggregate([
        { $match: { faculty_id: new mongoose.Types.ObjectId(facultyId) } },
        {
          $addFields: {
            sortOrder: {
              $cond: { if: { $eq: ['$order', 0] }, then: 999999, else: '$order' },
            },
          },
        },
        { $sort: { sortOrder: 1, created_at: -1 } },
        {
          $lookup: {
            from: 'faculties',
            localField: 'faculty_id',
            foreignField: '_id',
            as: 'faculty_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByFacultyIdActive(facultyId: string): Promise<Department[]> {
    try {
      return await this.model.department.aggregate([
        {
          $match: {
            faculty_id: new mongoose.Types.ObjectId(facultyId),
            active: true,
          },
        },
        {
          $addFields: {
            sortOrder: {
              $cond: { if: { $eq: ['$order', 0] }, then: 999999, else: '$order' },
            },
          },
        },
        { $sort: { sortOrder: 1, created_at: -1 } },
        {
          $lookup: {
            from: 'faculties',
            localField: 'faculty_id',
            foreignField: '_id',
            as: 'faculty_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByTitle(title: string): Promise<Department> {
    try {
      const department = await this.model.department
        .findOne({ title })
        .populate('faculty_id', 'title');
      if (!department) throw new HttpException(404, 'Department not found');
      return department;
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
        throw new HttpException(404, 'Faculty not found');
      }

      const checkExistDepartment = await this.model.department.findOne({
        title: createDepartmentDto.title,
        faculty_id: createDepartmentDto.faculty_id,
      });

      if (checkExistDepartment) {
        throw new HttpException(
          409,
          'Department with this title already exists in this faculty'
        );
      }

      const createDepartment = await this.model.department.create({
        ...createDepartmentDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return createDepartment;
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
          throw new HttpException(404, 'Faculty not found');
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
      if (!updatedDepartment) throw new HttpException(404, 'Department not found');
      return updatedDepartment;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async toggleActive(id: string): Promise<Department> {
    try {
      const department = await this.model.department.findById(id);
      if (!department) throw new HttpException(404, 'Department not found');

      const updatedDepartment = await this.model.department.findByIdAndUpdate(
        id,
        {
          active: !department.active,
          updated_at: new Date(),
        },
        { new: true }
      );

      return updatedDepartment;
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
