import mongoose from 'mongoose';
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
      const total = await this.model.program.countDocuments({});

      const programs = await this.model.program.aggregate([
        {
          $addFields: {
            sortOrder: {
              $cond: { if: { $eq: ['$order', 0] }, then: 999999, else: '$order' },
            },
          },
        },
        { $sort: { sortOrder: 1, created_at: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'faculties',
            localField: 'faculty_id',
            foreignField: '_id',
            as: 'faculty_id',
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: 'department_id',
            foreignField: '_id',
            as: 'department_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$department_id', preserveNullAndEmptyArrays: true } },
      ]);

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
      const program = await this.model.program
        .findById(id)
        .populate('faculty_id', 'title')
        .populate('department_id', 'title');
      if (!program) throw new HttpException(404, 'Program not found');
      return program;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByFacultyId(facultyId: string): Promise<Program[]> {
    try {
      return await this.model.program.aggregate([
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
        {
          $lookup: {
            from: 'departments',
            localField: 'department_id',
            foreignField: '_id',
            as: 'department_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$department_id', preserveNullAndEmptyArrays: true } },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByDepartmentId(departmentId: string): Promise<Program[]> {
    try {
      return await this.model.program.aggregate([
        {
          $match: {
            department_id: new mongoose.Types.ObjectId(departmentId),
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
        {
          $lookup: {
            from: 'departments',
            localField: 'department_id',
            foreignField: '_id',
            as: 'department_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$department_id', preserveNullAndEmptyArrays: true } },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByDepartmentIdAdmin(
    departmentId: string
  ): Promise<Program[]> {
    try {
      return await this.model.program.aggregate([
        { $match: { department_id: new mongoose.Types.ObjectId(departmentId) } },
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
        {
          $lookup: {
            from: 'departments',
            localField: 'department_id',
            foreignField: '_id',
            as: 'department_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$department_id', preserveNullAndEmptyArrays: true } },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByDegreeLevel(
    degreeLevel: 'master' | 'doctoral'
  ): Promise<Program[]> {
    try {
      return await this.model.program.aggregate([
        { $match: { degree_level: degreeLevel } },
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
        {
          $lookup: {
            from: 'departments',
            localField: 'department_id',
            foreignField: '_id',
            as: 'department_id',
          },
        },
        { $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$department_id', preserveNullAndEmptyArrays: true } },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByTitle(title: string): Promise<Program> {
    try {
      const program = await this.model.program
        .findOne({ title })
        .populate('faculty_id', 'title')
        .populate('department_id', 'title');
      if (!program) throw new HttpException(404, 'Program not found');
      return program;
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
        department_id: createProgramDto.department_id,
        faculty_id: createProgramDto.faculty_id,
      });

      if (checkExistProgram)
        throw new HttpException(
          409,
          'Program with this title already exists in this department and faculty'
        );

      if (
        createProgramDto.degree_level === 'doctoral' &&
        !createProgramDto.degree_req
      ) {
        throw new HttpException(
          400,
          'Degree requirement is required for doctoral degree'
        );
      }

      const createProgram = await this.model.program.create({
        ...createProgramDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return createProgram;
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

      if (
        updateProgramDto.degree_level &&
        updateProgramDto.degree_level === 'doctoral' &&
        !updateProgramDto.degree_req
      ) {
        throw new HttpException(
          400,
          'Degree requirement is required for doctoral degree'
        );
      }

      if (
        updateProgramDto.title ||
        updateProgramDto.department_id ||
        updateProgramDto.faculty_id
      ) {
        const checkExistProgram = await this.model.program.findOne({
          _id: { $ne: id },
          title: updateProgramDto.title || { $exists: true },
          department_id: updateProgramDto.department_id || { $exists: true },
          faculty_id: updateProgramDto.faculty_id || { $exists: true },
        });

        if (checkExistProgram)
          throw new HttpException(
            409,
            'Program with this title already exists in this department and faculty'
          );
      }

      const updatedProgram = await this.model.program.findByIdAndUpdate(
        id,
        {
          ...updateProgramDto,
          updated_at: new Date(),
        },
        { new: true }
      );
      if (!updatedProgram) throw new HttpException(404, 'Program not found');
      return updatedProgram;
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

  // Toggle active status of a program
  public async toggleActive(id: string): Promise<Program> {
    const program = await this.model.program.findById(id);
    if (!program) {
      throw new Error('Program not found');
    }

    program.active = !program.active;
    await program.save();

    return program;
  }

  public async findAllActiveForExport(opts?: {
    faculty_id?: string;
    department_id?: string;
    degree_level?: 'master' | 'doctoral';
  }): Promise<Program[]> {
    try {
      const filter: any = { active: true };

      if (opts?.faculty_id) filter.faculty_id = new mongoose.Types.ObjectId(opts.faculty_id);
      if (opts?.department_id) filter.department_id = new mongoose.Types.ObjectId(opts.department_id);
      if (opts?.degree_level) filter.degree_level = opts.degree_level;

      const pipeline: any[] = [{ $match: filter }];

      // Add custom sorting: 0 at the bottom, others ascending
      pipeline.push({
        $addFields: {
          sortOrder: {
            $cond: { if: { $eq: ['$order', 0] }, then: 999999, else: '$order' },
          },
        },
      });
      pipeline.push({ $sort: { sortOrder: 1, created_at: -1 } });

      pipeline.push({
        $lookup: {
          from: 'faculties',
          localField: 'faculty_id',
          foreignField: '_id',
          as: 'faculty_id',
        },
      });
      pipeline.push({
        $lookup: {
          from: 'departments',
          localField: 'department_id',
          foreignField: '_id',
          as: 'department_id',
        },
      });
      pipeline.push({ $unwind: { path: '$faculty_id', preserveNullAndEmptyArrays: true } });
      pipeline.push({ $unwind: { path: '$department_id', preserveNullAndEmptyArrays: true } });

      // Project as per the original find().select()
      pipeline.push({
        $project: {
          title: 1,
          degree_abbr: 1,
          degree_level: 1,
          time: 1,
          active: 1,
          faculty_id: 1,
          department_id: 1,
        },
      });

      return await this.model.program.aggregate(pipeline);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ProgramService;
