import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { Faculty } from '@/interfaces/faculty.interface';
import { buildData } from '@/utils/pagination';
import { CreateFacultyDto, UpdateFacultyDto } from '@/dtos/faculty.dto';
import { HttpException } from '@/exceptions/HttpException';

class FacultyService extends MainService {
  public async findAll({
    limit = 20,
    page = 1,
  }: paginationDto): Promise<{ info: any; data: Faculty[] }> {
    try {
      const skip = (page - 1) * limit;
      // Get total count for pagination metadata
      const total = await this.model.faculty.countDocuments({});

      // Use database-level pagination with custom sorting (0 at the bottom)
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

      const faculties = await this.model.faculty.aggregate(pipeline);

      return buildData({
        results: faculties,
        skip: page,
        limit,
        currentLength: faculties.length,
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
  }: paginationDto): Promise<{ info: any; data: Faculty[] }> {
    try {
      const skip = (page - 1) * limit;
      const filter = { active: true };
      const total = await this.model.faculty.countDocuments(filter);

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

      const faculties = await this.model.faculty.aggregate(pipeline);

      return buildData({
        results: faculties,
        skip: page,
        limit,
        currentLength: faculties.length,
        total,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Faculty> {
    try {
      return await this.model.faculty.findById(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByTitle(title: string): Promise<Faculty> {
    try {
      return await this.model.faculty.findOne({ title });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    try {
      const checkExistFaculty = await this.model.faculty.findOne({
        title: createFacultyDto.title,
      });

      if (checkExistFaculty) {
        throw new HttpException(409, 'Faculty with this title already exists');
      }

      const createFaculty = await this.model.faculty.create({
        ...createFacultyDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return createFaculty;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(
    id: string,
    updateFacultyDto: UpdateFacultyDto
  ): Promise<Faculty> {
    try {
      const updatedFaculty = await this.model.faculty.findByIdAndUpdate(
        id,
        {
          ...updateFacultyDto,
          updated_at: new Date(),
        },
        { new: true }
      );
      return updatedFaculty;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async toggleActive(id: string): Promise<Faculty> {
    try {
      const faculty = await this.model.faculty.findById(id);
      if (!faculty) throw new HttpException(404, 'Faculty not found');

      const updatedFaculty = await this.model.faculty.findByIdAndUpdate(
        id,
        {
          active: !faculty.active,
          updated_at: new Date(),
        },
        { new: true }
      );

      return updatedFaculty;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.faculty.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default FacultyService;
