import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { User } from '@/interfaces/user.interface';
import { buildData } from '@/utils/pagination';
import { HttpException } from '@/exceptions/HttpException';
import { UpdateUserRoleDto } from '@/dtos/user.dto';

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

  public async updateRole(id: string, userId: string, updateUserRole: UpdateUserRoleDto): Promise<User> {
    try {
      const user = await this.model.user.findById(userId);
      if (!user) throw new HttpException(404, 'User not found');
      if (user.role !== 'admin') throw new HttpException(403, 'You do not have permission to change role');
      return await this.model.user.findByIdAndUpdate(
        id, 
        {
          role: updateUserRole.role,
          updated_at: new Date(),
        },
        { new: true }
      )
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default UserService;
