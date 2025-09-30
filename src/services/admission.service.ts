import MainService from './main.service';
import { Admission } from '@/interfaces/admission.interface';
import {
  CreateAdmissionDto,
  UpdateAdmissionDto,
} from '@/dtos/admission.dto';
import { HttpException } from '@/exceptions/HttpException';

class AdmissionService extends MainService {
  public async findAll(): Promise<{ _id: string, label: string }[]> {
    try {
      const admissions = await this.model.admission.find();
      return admissions.map((admission: Admission) => {
        return { _id: admission._id.toString(), label: admission.term.label };
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Admission> {
    try {
      return await this.model.admission.findById(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findCurrentActive() {
    try {
      return await this.model.admission
        .find({ active: true })
        .sort({ "term.sort_key": -1 })
        .limit(1);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(createAdmissionDto: CreateAdmissionDto): Promise<Admission> {
    try {
      // Check if admission for this term already exists
      const existingAdmission = await this.model.admission.findOne({
        'term.semester': createAdmissionDto.term.semester,
        'term.academic_year_th': createAdmissionDto.term.academic_year_th,
      });

      if (existingAdmission) {
        throw new HttpException(409,
          'Admission for this semester and academic year already exists'
        );
      }

      const { term, application_window, rounds, monthly } = createAdmissionDto;

      const createAdmission = await this.model.admission.create({
        term: {
          semester: term.semester,
          academic_year_th: term.academic_year_th,
          label: term.label ?? `${term.semester}/${term.academic_year_th}`,
          sort_key: term.sort_key ?? Number(`${term.academic_year_th}.${term.semester}`)
        },
        active: new Date(application_window.open_at) < new Date() ? true : false,
        application_window: {
          open_at: new Date(application_window.open_at),
          close_at: new Date(application_window.close_at),
          notice: application_window.notice ?? 
            `การรับสมัครระดับบัณฑิตศึกษา ภาคการศึกษาที่ ${term.semester}/${term.academic_year_th}`,
          calendar_url: application_window.calendar_url,
        },
        rounds,
        monthly,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return createAdmission;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(id: string, updateAdmissionDto: UpdateAdmissionDto): Promise<Admission> {
    try {
      const { application_window, rounds, monthly } = updateAdmissionDto;
      const updatedAdmission = await this.model.admission.findByIdAndUpdate(
        id,
        {
          ...(application_window && 
            {
              application_window: {
                open_at: new Date(application_window.open_at),
                close_at: new Date(application_window.close_at),
                notice: application_window.notice,
                calendar_url: application_window.calendar_url, 
              }
            }
          ),
          ...(monthly && { monthly } ),
          ...(rounds && { rounds } ),
          ...((application_window || monthly || rounds) && { updated_at: new Date() }),
        },
        { new: true }
      );
      return updatedAdmission;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.admission.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async toggleActive(id: string): Promise<Admission> {
    try {
      const admission = await this.model.admission.findById(id);
      if (!admission) {
        throw new HttpException(404, 'Admission not found');
      }

      const updatedAdmission = await this.model.admission.findByIdAndUpdate(
        id,
        {
          active: !admission.active,
          updated_at: new Date(),
        },
        { new: true }
      );
      return updatedAdmission;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async checkWindowApplicationCloseTime() {
    try {
      await this.model.admission.updateMany(
        {
          active: true,
          "application_window.close_at": { $lte: new Date() }
        },
        { $set: { active: false, updated_at: new Date() } }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default AdmissionService;
