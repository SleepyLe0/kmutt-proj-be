import UserModel from "@/models/user.model";

export interface IModels {
  user: typeof UserModel;
}

export default class MainService {
  public model: IModels;

  constructor() {
    this.model = {
      user: UserModel,
    }
  }
}