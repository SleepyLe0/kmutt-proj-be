import MainService from './main.service';
import { Template } from '@/interfaces/template.interface';
import { CreateTemplateDto, UpdateTemplateDto } from '@/dtos/template.dto';
import { HttpException } from '@/exceptions/HttpException';

class TemplateService extends MainService {
  public async findAll(): Promise<Template[]> {
    try {
      return await this.model.template.find();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Template> {
    try {
      const template = await this.model.template.findById(id);
      if (!template) {
        throw new HttpException(404, 'Template not found');
      }
      return template;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    try {
      const checkExistTemplate = await this.model.template.findOne({
        title: createTemplateDto.title,
      });

      if (checkExistTemplate) {
        throw new HttpException(409, 'Template with this title already exists');
      }

      const createTemplate = await this.model.template.create({
        ...createTemplateDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return createTemplate;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto
  ): Promise<Template> {
    try {
      const template = await this.model.template.findById(id);
      if (!template) {
        throw new HttpException(404, 'Template not found');
      }

      if (updateTemplateDto.title) {
        const checkExistTemplate = await this.model.template.findOne({
          title: updateTemplateDto.title,
          _id: { $ne: id },
        });

        if (checkExistTemplate) {
          throw new HttpException(
            409,
            'Template with this title already exists'
          );
        }
      }

      const updatedTemplate = await this.model.template.findByIdAndUpdate(
        id,
        {
          ...updateTemplateDto,
          updated_at: new Date(),
        },
        { new: true }
      );
      return updatedTemplate;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.template.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async generateUniqueTitle(baseTitle: string): Promise<string> {
    const cleanBase = baseTitle.trim();

    const exists = await this.model.template.findOne({ title: cleanBase });
    if (!exists) return cleanBase;

    const copy1 = `${cleanBase} (Copy)`;
    const existsCopy1 = await this.model.template.findOne({ title: copy1 });
    if (!existsCopy1) return copy1;

    let i = 2;
    while (true) {
      const candidate = `${cleanBase} (Copy ${i})`;
      const existsCandidate = await this.model.template.findOne({
        title: candidate,
      });
      if (!existsCandidate) return candidate;
      i++;
    }
  }

  public async duplicate(
    id: string,
    overrideTitle?: string
  ): Promise<Template> {
    try {
      const template = await this.model.template.findById(id);
      if (!template) {
        throw new HttpException(404, 'Template not found');
      }

      const plain = template.toObject ? template.toObject() : template;

      const desiredTitle = (overrideTitle ?? `${plain.title}`).trim();
      const uniqueTitle = await this.generateUniqueTitle(desiredTitle);

      delete plain._id;
      delete plain.__v;
      delete plain.created_at;
      delete plain.updated_at;

      const duplicated = await this.model.template.create({
        ...plain,
        title: uniqueTitle,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return duplicated;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default TemplateService;
