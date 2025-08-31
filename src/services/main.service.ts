import UserModel from '@/models/user.model';
import FacultyModel from '@/models/faculty.model';
import DepartmentModel from '@/models/department.model';
import ProgramModel from '@/models/program.model';

export interface IModels {
  user: typeof UserModel;
  faculty: typeof FacultyModel;
  department: typeof DepartmentModel;
  program: typeof ProgramModel;
}

export default class MainService {
  public model: IModels;

  constructor() {
    this.model = {
      user: UserModel,
      faculty: FacultyModel,
      department: DepartmentModel,
      program: ProgramModel,
    };
  }
}
