import { paginationDto } from '@/dtos/pagination.dto';
import MainService from './main.service';
import { Form } from '@/interfaces/form.interface';
import { buildData } from '@/utils/pagination';
import {
  CreateFormDto,
  UpdateFormDto,
} from '@/dtos/form.dto';
import { HttpException } from '@/exceptions/HttpException';

class FormService extends MainService {
  public async findAll({
    limit = 20,
    page = 1,
    search,
    search_option,
    status,
    admission_id,
    faculty,
    department,
    program,
    submitter_name,
    submitter_email,
    date_start,
    date_end,
    sort,
    sort_option,
  }: paginationDto): Promise<{ info: any; data: Form[] }> {
    try {
      const skip = (page - 1) * limit;
  
      // Build match stage for filtering
      const matchStage: any = {};
  
      // Status filter
      if (status) {
        matchStage.status = status;
      }
  
      // Admission ID filter
      if (admission_id) {
        matchStage.admission_id = admission_id;
      }
  
      // Submitter filters
      if (submitter_name) {
        matchStage['submitter.name'] = { $regex: submitter_name, $options: 'i' };
      }
      if (submitter_email) {
        matchStage['submitter.email'] = { $regex: submitter_email, $options: 'i' };
      }
  
      // Date range filters
      if (date_start || date_end) {
        matchStage.created_at = {};
        if (date_start) {
          matchStage.created_at.$gte = new Date(date_start);
        }
        if (date_end) {
          matchStage.created_at.$lte = new Date(date_end);
        }
      }
  
      // Search functionality
      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        if (search_option) {
          switch (search_option) {
            case 'submitter_name':
              matchStage['submitter.name'] = searchRegex;
              break;
            case 'submitter_email':
              matchStage['submitter.email'] = searchRegex;
              break;
            case 'submitter_phone':
              matchStage['submitter.phone'] = searchRegex;
              break;
            default:
              matchStage.$or = [
                { 'submitter.name': searchRegex },
                { 'submitter.email': searchRegex },
                { 'submitter.phone': searchRegex },
              ];
          }
        } else {
          matchStage.$or = [
            { 'submitter.name': searchRegex },
            { 'submitter.email': searchRegex },
            { 'submitter.phone': searchRegex },
          ];
        }
      }
  
      // Build aggregation pipeline
      const pipeline: any[] = [
        // Initial match stage (before lookups for better performance)
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
  
        // Lookup admission
        {
          $lookup: {
            from: 'admissions', // Adjust collection name if needed
            localField: 'admission_id',
            foreignField: '_id',
            as: 'admission',
          },
        },
        { $unwind: { path: '$admission', preserveNullAndEmptyArrays: true } },
  
        // Lookup faculty
        {
          $lookup: {
            from: 'faculties', // Adjust collection name if needed
            localField: 'faculty_id',
            foreignField: '_id',
            as: 'faculty',
          },
        },
        { $unwind: { path: '$faculty', preserveNullAndEmptyArrays: true } },
  
        // Lookup department
        {
          $lookup: {
            from: 'departments', // Adjust collection name if needed
            localField: 'department_id',
            foreignField: '_id',
            as: 'department',
          },
        },
        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
  
        // Lookup user
        {
          $lookup: {
            from: 'users', // Adjust collection name if needed
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  
        // Lookup programs within intake_programs array
        {
          $lookup: {
            from: 'programs', // Adjust collection name if needed
            localField: 'intake_programs.program_id',
            foreignField: '_id',
            as: 'program_details',
          },
        },
  
        // Add populated programs back to intake_programs
        {
          $addFields: {
            intake_programs: {
              $map: {
                input: '$intake_programs',
                as: 'intake',
                in: {
                  $mergeObjects: [
                    '$$intake',
                    {
                      program_id: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$program_details',
                              as: 'prog',
                              cond: { $eq: ['$$prog._id', '$$intake.program_id'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        { $project: { program_details: 0 } },
      ];
  
      // Post-lookup filters (filtering by populated field titles)
      const postMatchStage: any = {};
  
      if (faculty) {
        postMatchStage['faculty.title'] = { $regex: faculty, $options: 'i' };
      }
      if (department) {
        postMatchStage['department.title'] = { $regex: department, $options: 'i' };
      }
      if (program) {
        postMatchStage['intake_programs.program_id.title'] = { $regex: program, $options: 'i' };
      }
  
      if (Object.keys(postMatchStage).length > 0) {
        pipeline.push({ $match: postMatchStage });
      }
  
      // Count total documents (before pagination)
      const countPipeline = [...pipeline, { $count: 'total' }];
      const countResult = await this.model.form.aggregate(countPipeline);
      const total = countResult[0]?.total || 0;
  
      // Build sort options
      let sortStage: any = { created_at: -1 };
      if (sort && sort_option) {
        const sortDirection = sort === 1 ? 1 : -1;
        sortStage = { [sort_option]: sortDirection };
      }
  
      // Add sort, skip, and limit to pipeline
      pipeline.push(
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limit }
      );
  
      // Project to match the original populate structure
      pipeline.push({
        $project: {
          _id: 1,
          status: 1,
          submitter: 1,
          created_at: 1,
          updated_at: 1,
          // Add other fields you need
          admission_id: { _id: '$admission._id', term: '$admission.term' },
          faculty_id: { _id: '$faculty._id', title: '$faculty.title' },
          department_id: { _id: '$department._id', title: '$department.title' },
          user_id: { _id: '$user._id', name: '$user.name', email: '$user.email' },
          intake_programs: 1,
        },
      });
  
      // Execute aggregation
      const forms = await this.model.form.aggregate(pipeline);
  
      return buildData({
        results: forms,
        skip: page,
        limit,
        currentLength: forms.length,
        total,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findAllByUser(userId: string, {
    limit = 20,
    page = 1,
    search,
    search_option,
    status,
    admission_id,
    faculty,
    department,
    program,
    submitter_name,
    submitter_email,
    date_start,
    date_end,
    sort,
    sort_option,
  }: paginationDto): Promise<{ info: any; data: Form[] }> {
    try {
      const findUser = await this.model.user.findById(userId);
      if (!findUser) throw new HttpException(404, "User not found");

      const skip = (page - 1) * limit;
      
      // Build filter query
      const filterQuery: any = { user_id: userId };

      // Status filter
      if (status) {
        filterQuery.status = status;
      }

      // ID-based filters
      if (admission_id) {
        filterQuery.admission_id = admission_id;
      }
      
      if (faculty) {
        filterQuery.faculty_id = { $regex: faculty, $options: 'i' };
      }
      if (department) {
        filterQuery.department_id = { $regex: department, $options: 'i' };
      }
      
      // Program filter (search within intake_programs array)
      if (program) {
        filterQuery['intake_programs.program_id'] = { $regex: program, $options: 'i' };
      }

      // Submitter filters
      if (submitter_name) {
        filterQuery['submitter.name'] = { $regex: submitter_name, $options: 'i' };
      }
      if (submitter_email) {
        filterQuery['submitter.email'] = { $regex: submitter_email, $options: 'i' };
      }

      // Date range filters
      if (date_start || date_end) {
        filterQuery.created_at = {};
        if (date_start) {
          filterQuery.created_at.$gte = new Date(date_start);
        }
        if (date_end) {
          filterQuery.created_at.$lte = new Date(date_end);
        }
      }

      // Search functionality
      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        
        if (search_option) {
          // Search in specific field
          switch (search_option) {
            case 'submitter_name':
              filterQuery['submitter.name'] = searchRegex;
              break;
            case 'submitter_email':
              filterQuery['submitter.email'] = searchRegex;
              break;
            case 'submitter_phone':
              filterQuery['submitter.phone'] = searchRegex;
              break;
            default:
              // Default search across multiple fields
              filterQuery.$or = [
                { 'submitter.name': searchRegex },
                { 'submitter.email': searchRegex },
                { 'submitter.phone': searchRegex },
              ];
          }
        } else {
          // Global search across multiple fields
          filterQuery.$or = [
            { 'submitter.name': searchRegex },
            { 'submitter.email': searchRegex },
            { 'submitter.phone': searchRegex },
          ];
        }
      }

      // Get total count for pagination metadata
      const total = await this.model.form.countDocuments(filterQuery);

      // Build sort options
      let sortOptions: any = { created_at: -1 }; // Default sort
      if (sort && sort_option) {
        const sortDirection = sort === 1 ? 1 : -1;
        sortOptions = { [sort_option]: sortDirection };
      }

      // Use database-level pagination with population
      const forms = await this.model.form
        .find(filterQuery)
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'name email')
        .populate('intake_programs.program_id', 'title')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      return buildData({
        results: forms,
        skip: page,
        limit,
        currentLength: forms.length,
        total,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Form> {
    try {
      return await this.model.form
        .findById(id)
        .populate('admission_id', 'term')
        .populate('faculty_id', 'title')
        .populate('department_id', 'title')
        .populate('user_id', 'name email')
        .populate('intake_programs.program_id', 'title');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(userId: string, createFormDto: CreateFormDto): Promise<Form> {
    try {
      // Check if user exists
      const userExists = await this.model.user.findById(userId);
      if (!userExists) {
        throw new HttpException(404, 'User not found');
      }

      // Check if admission exists
      const admissionExists = await this.model.admission.findById(
        createFormDto.admission_id
      );
      if (!admissionExists) {
        throw new HttpException(404, 'Admission not found');
      }

      // Check if faculty exists
      const facultyExists = await this.model.faculty.findById(
        createFormDto.faculty_id
      );
      if (!facultyExists) {
        throw new HttpException(404, 'Faculty not found');
      }

      // Check if department exists
      const departmentExists = await this.model.department.findById(
        createFormDto.department_id
      );
      if (!departmentExists) {
        throw new HttpException(404, 'Department not found');
      }

      // Validate all program ids and check duplicates within same admission/user
      const programIds = createFormDto.intake_programs.map(p => p.program_id);
      const programs = await this.model.program.find({ _id: { $in: programIds } });
      if (programs.length !== programIds.length) {
        throw new HttpException(404, 'One or more programs not found');
      }

      const createForm = await this.model.form.create({
        user_id: userExists._id,
        ...createFormDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.findById(createForm._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(id: string, userId: string, updateFormDto: UpdateFormDto): Promise<Form> {
    try {
      // Check if form exists
      const existingForm = await this.model.form.findById(id);
      if (!existingForm) {
        throw new HttpException(404, 'Form not found');
      }

      // Check update permission
      const user = await this.model.user.findById(userId);
      if (user.role !== 'admin' && user._id !== existingForm.user_id) {
        throw new HttpException(403, 'You do not have permission to update this form')
      }

      // Check if faculty exists if faculty_id is being updated
      if (updateFormDto.faculty_id) {
        const facultyExists = await this.model.faculty.findById(
          updateFormDto.faculty_id
        );
        if (!facultyExists) {
          throw new HttpException(404, 'Faculty not found');
        }
      }

      // Check if department exists if department_id is being updated
      if (updateFormDto.department_id) {
        const departmentExists = await this.model.department.findById(
          updateFormDto.department_id
        );
        if (!departmentExists) {
          throw new HttpException(404, 'Department not found');
        }
      }

      // Validate programs if intake_programs is being updated
      if (updateFormDto.intake_programs) {
        const programIds = updateFormDto.intake_programs.map(p => p.program_id);
        const programs = await this.model.program.find({ _id: { $in: programIds } });
        if (programs.length !== programIds.length) {
          throw new HttpException(404, 'One or more programs not found');
        }
      }

      const updatedForm = await this.model.form.findByIdAndUpdate(
        id,
        {
          ...updateFormDto,
          updated_at: new Date(),
        },
        { new: true }
      );

      return await this.findById(updatedForm._id.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    try {
      // Check if form exists
      const existingForm = await this.model.form.findById(id);
      if (!existingForm) {
        throw new HttpException(404, 'Form not found');
      }

      // Check update permission
      const user = await this.model.user.findById(userId);
      if (user.role !== 'admin' && user._id !== existingForm.user_id) {
        throw new HttpException(403, 'You do not have permission to update this form')
      }

      const result = await this.model.form.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default FormService;