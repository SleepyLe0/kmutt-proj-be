import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { User } from '@/interfaces/user.interface';
import { buildData } from '@/utils/pagination';
import { CreateUserDto } from '@/dtos/user.dto';

class UserService extends MainService {
  public async findAll({
    limit = 20,
    page = 1,
  }: paginationDto): Promise<{ info: any; data: User[] }> {
    try {
      const skip = (page - 1) * limit;
      // Get total count for pagination metadata
      const total = await this.model.user.countDocuments({});

      // Use database-level pagination
      const users = await this.model.user.find({}).skip(skip).limit(limit);

      return buildData({
        results: users,
        skip: page,
        limit,
        currentLength: users.length,
        total,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<User> {
    try {
      return await this.model.user.findById(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<User> {
    try {
      return await this.model.user.findOne({ email });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const checkExistUser = await this.model.user.findOne({
        email: createUserDto.email,
      });
      if (!checkExistUser) {
        const createUser = await this.model.user.create({
          ...createUserDto,
          created_at: new Date(),
          updated_at: new Date(),
        });
        return createUser;
      }
      throw new Error('User with this email already exists');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(id: string, updateUserDto: any): Promise<User> {
    try {
      const updatedUser = await this.model.user.findByIdAndUpdate(
        id,
        {
          ...updateUserDto,
          updated_at: new Date(),
        },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.user.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default UserService;
