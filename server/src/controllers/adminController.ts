import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import AdminModel from '../models/admin'; // Adjust the import path as needed
import { BadRequestException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { aboutSchema, blogSchema, categorySchema, jobSchema, loginSchema, projectSchema, servicesSchema, signupSchema, teamSchema, testimonialSchema, weAchievedSchema } from '../schema/admin';
import { UnprocessableEntity } from '../exceptions/validation';
import jwt from 'jsonwebtoken';
import AboutModel from '../models/about';
import TestimonialModel from '../models/testimonial';
import TeamModel from '../models/team';
import ServicesModel from '../models/services';
import ContactsModel from '../models/contact';
import ProjectCategoryModel from '../models/projectCategory';
import Projects from '../models/project';
import ProjectImage from '../models/projectImage';
import ProjectCategory from '../models/projectCategory';
import WeAchieved from '../models/weAchieved';
import Client from '../models/client';
import BestProject from '../models/bestProject';
import Story from '../models/story';
import Blog from '../models/blog';
import Job from '../models/job';
import ApplyList from '../models/applyList';
import cache from './cache'; // Import the centralized cache instance
import sendEmail from './emailController';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import MainServicesCategory from '../models/mainServicesCategory';
import MainServicesSubCategory from '../models/mainServicesSubCategory';
import MainServices from '../models/mainServices';
import '../models/associations';

const JWT_SECRET = process.env.JWT_SECRET_KEY || "12sawegg23grr434"; // Fallback to a hardcoded secret if not in env


export const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any | Response> => {
  const result = signupSchema.safeParse(req.body); // Zod validation

  if (!result.success) {
    // If validation fails, throw a custom error
    return next(new UnprocessableEntity(result.error.errors, 'Validation Error'));
  }
  const { name, email, password, phone, dob, gender, role } = req.body;
  if (!name || !email || !password || !phone || !dob || !gender || !role) {
    return next(new BadRequestException('All fields are required', ErrorCode.MISSING_FIELDS));
  }

  // Check if admin already exists
  const existingAdmin = await AdminModel.findOne({ where: { email } });
  if (existingAdmin) {
    return next(new BadRequestException('Admin already exists', ErrorCode.ADMIN_ALREADY_EXISTS));
  }
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new admin in the database
  const newAdmin = await AdminModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    dob,
    gender,
    role,
  });


  // Exclude the password from the response
  const { password: _, ...adminResponse } = newAdmin.toJSON();
  // Clear the cached admin list after creating a new admin
  cache.del("adminRecords");


  return res.status(201).json({ message: 'Admin created successfully', admin: adminResponse });

};


// Delete API
export const deleteAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await AdminModel.destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('Admin record not found', ErrorCode.ADMIN_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for this specific admin and all admin records
  cache.del(`admin_${id}`);
  cache.del('adminRecords');

  return res.status(200).json({ message: 'Admin deleted successfully' });
};
// View API (Fetch all Admin records)
export const viewAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if the data is already cached
  const cachedAdmins = cache.get("adminRecords");
  if (cachedAdmins) {
    // If cached data exists, return it
    return res.status(200).json({ message: 'Fetched admin records successfully (from cache)', data: cachedAdmins });
  }

  const adminRecords = await AdminModel.findAll();

  if (!adminRecords || adminRecords.length === 0) {
    return next(new BadRequestException('Admin record not found', ErrorCode.ADMIN_RECORD_NOT_FOUND));
  }
  // Cache the fetched data for future requests
  cache.set("adminRecords", adminRecords);

  return res.status(200).json({ message: 'Fetched adminRecords records successfully', data: adminRecords });
};
// View by ID API (Fetch a specific Admin record by ID)
export const viewAdminById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  // Check if the specific admin record is cached
  const cachedAdmin = cache.get(`admin_${id}`);

  if (cachedAdmin) {
    // If cached data exists, return it
    return res.status(200).json({ message: 'Fetched admin record successfully (from cache)', data: cachedAdmin });
  }
  const adminRecords = await AdminModel.findByPk(id); // Find the record by primary key

  if (!adminRecords) {
    return next(new BadRequestException(`About record with ID ${id} not found`, ErrorCode.ADMIN_RECORD_NOT_FOUND));

  }
  // Cache the fetched admin record for future requests
  cache.set(`admin_${id}`, adminRecords);

  return res.status(200).json({ message: 'Fetched About record successfully', data: adminRecords });
};





export const login = async (req: Request, res: Response, next: NextFunction): Promise<any | Response> => {
  // Zod validation for request body
  const validation = loginSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {

    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const { email, password } = req.body;

  // Check if the required fields are present
  if (!email || !password) {
    return next(new BadRequestException('All fields are required', ErrorCode.MISSING_FIELDS));
  }
  // Find the admin by email
  const admin = await AdminModel.findOne({ where: { email } });

  // If the admin doesn't exist, throw an error
  if (!admin) {
    return next(new BadRequestException('Admin not found', ErrorCode.ADMIN_NOT_FOUND));
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, admin.password);

  // If the password is incorrect, throw an error
  if (!isPasswordValid) {
    return next(new BadRequestException('Incorrect password', ErrorCode.INCORRECT_PASSWORD));
  }

  // Generate JWT token with the admin's id, email, and role
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET as string, // Make sure to define JWT_SECRET_KEY in your environment variables
    { expiresIn: '1h' } // Set token expiration time (e.g., 1 hour)
  );
  // Set the JWT token as a cookie
  res.cookie('token', token, {
    httpOnly: true, // Prevents access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production only
    sameSite: 'strict', // Corrected to lowercase "strict"
  });

  // Send the token in the response
  return res.status(200).json({ message: 'Login successful', token });
};
export const me = async (req: Request, res: Response) => {
  const reqWithAdmin = req as Request & { admin: AdminModel }; // Manually cast the request type
  const { name, email, phone, dob, gender } = reqWithAdmin.admin.dataValues; // Extract only required fields
  res.json({ name, email, phone, dob, gender }); // Return only desired fields
};

// adminController.ts
export const logout = async (req: Request, res: Response): Promise<any> => {
  // You can set the token expiration time to a past time, effectively invalidating it
  res.clearCookie('token');  // If the token is stored as a cookie

  return res.status(200).json({ message: 'Logged out successfully' });
};

export const aboutUs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const validation = aboutSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  // Destructure the data from the validated body
  const { homeTitle, homeDescription, homeVideo, title, description, video } = req.body;


  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Handle file uploads for images, using req.files (since you're uploading multiple fields)
  const homeImage = files['homeImage'] ? files['homeImage'][0].path : ''; // Check if 'homeImage' exists in req.files
  const image = files['image'] ? files['image'][0].path : ''; // Check if 'image' exists in req.files

  // Create a new "About" record in the database
  const newAbout = await AboutModel(req.app.get('sequelize')).create({
    homeTitle,
    homeDescription,
    homeImage,
    homeVideo,
    title,
    description,
    image,
    video,
  });

  return res.status(201).json({ message: 'About created successfully', admin: newAbout });
};



// Update API
export const updateAbout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  const validation = aboutSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const aboutRecord = await AboutModel(req.app.get('sequelize')).findByPk(id);

  // If record not found, return error
  if (!aboutRecord) {
    return next(new BadRequestException('About record not found', ErrorCode.ABOUT_RECORD_NOT_FOUND));
  }

  // Destructure the data from the validated body
  const { homeTitle, homeDescription, homeVideo, title, description, video } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Handle file uploads for images, using req.files (since you're uploading multiple fields)
  const homeImage = files['homeImage'] ? files['homeImage'][0].path : ''; // Check if 'homeImage' exists in req.files
  const image = files['image'] ? files['image'][0].path : ''; // Check if 'image' exists in req.files

  // Update the fields if new values are provided, otherwise keep the existing values
  aboutRecord.homeTitle = homeTitle || aboutRecord.homeTitle;
  aboutRecord.homeDescription = homeDescription || aboutRecord.homeDescription;
  aboutRecord.homeVideo = homeVideo || aboutRecord.homeVideo;
  aboutRecord.title = title || aboutRecord.title;
  aboutRecord.description = description || aboutRecord.description;
  aboutRecord.video = video || aboutRecord.video;
  aboutRecord.homeImage = homeImage || aboutRecord.homeImage;
  aboutRecord.image = image || aboutRecord.image;

  // Save the updated record
  const updatedAbout = await aboutRecord.save();

  return res.status(200).json({ message: 'About updated successfully', admin: updatedAbout });
};


// Delete API
export const deleteAbout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await AboutModel(req.app.get('sequelize')).destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('About record not found', ErrorCode.ABOUT_RECORD_NOT_FOUND));

  }

  return res.status(200).json({ message: 'About deleted successfully' });
};
// View API (Fetch all About records)
export const viewAbout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const aboutRecords = await AboutModel(req.app.get('sequelize')).findAll();

  if (!aboutRecords || aboutRecords.length === 0) {
    return next(new BadRequestException('About record not found', ErrorCode.ABOUT_RECORD_NOT_FOUND));
  }

  return res.status(200).json({ message: 'Fetched About records successfully', data: aboutRecords });
};
// View by ID API (Fetch a specific About record by ID)
export const viewAboutById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const aboutRecord = await AboutModel(req.app.get('sequelize')).findByPk(id); // Find the record by primary key

  if (!aboutRecord) {
    return next(new BadRequestException(`About record with ID ${id} not found`, ErrorCode.ABOUT_RECORD_NOT_FOUND));

  }

  return res.status(200).json({ message: 'Fetched About record successfully', data: aboutRecord });
};



export const testimonial
  = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = testimonialSchema.safeParse(req.body);

    // If validation fails, throw a custom error
    if (!validation.success) {
      return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
    }

    // Destructure the data from the validated body
    const { title, designation, description } = req.body;


    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files['image'] ? files['image'][0].path : ''; // Check if 'image' exists in req.files

    // Create a new "About" record in the database
    const newTestimonial = await TestimonialModel(req.app.get('sequelize')).create({
      title,
      designation,
      description,
      image,
    });
    // Invalidate the cache for all testimonials
    cache.del('testimonialRecords');

    return res.status(201).json({ message: 'Testimonial created successfully', admin: newTestimonial });
  };


// Update API
export const updateTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  const validation = testimonialSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const testimonialRecord = await TestimonialModel(req.app.get('sequelize')).findByPk(id);

  // If record not found, return error
  if (!testimonialRecord) {
    return next(new BadRequestException('testimonial record not found', ErrorCode.TESTIMONIAL_RECORD_NOT_FOUND));
  }

  // Destructure the data from the validated body
  const { title, description, designation } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const image = files['image'] ? files['image'][0].path : '';

  testimonialRecord.title = title || testimonialRecord.title;
  testimonialRecord.description = description || testimonialRecord.description;
  testimonialRecord.designation = designation || testimonialRecord.designation;
  testimonialRecord.image = image || testimonialRecord.image;

  // Save the updated record
  const updatedTestimonial = await testimonialRecord.save();
  // Invalidate the cache for the specific testimonial and all testimonials
  cache.del(`testimonial_${id}`);
  cache.del('testimonialRecords');

  return res.status(200).json({ message: 'Testimonial updated successfully', admin: updatedTestimonial });
};



// Delete API
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await TestimonialModel(req.app.get('sequelize')).destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('Testimonial record not found', ErrorCode.TESTIMONIAL_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for the specific testimonial and all testimonials
  cache.del(`testimonial_${id}`);
  cache.del('testimonialRecords');

  return res.status(200).json({ message: 'Testimonial deleted successfully' });
};


// View API (Fetch all About records)
export const viewTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  // Check if data is cached
  const cachedTestimonials = cache.get('testimonialRecords');
  if (cachedTestimonials) {
    return res.status(200).json({ message: 'Fetched Testimonial records successfully (from cache)', data: cachedTestimonials });
  }

  const testimonialRecords = await TestimonialModel(req.app.get('sequelize')).findAll();

  if (!testimonialRecords || testimonialRecords.length === 0) {
    return next(new BadRequestException('Testimonial record not found', ErrorCode.TESTIMONIAL_RECORD_NOT_FOUND));
  }
  // Cache the fetched data
  cache.set('testimonialRecords', testimonialRecords);
  return res.status(200).json({ message: 'Fetched Testimonial records successfully', data: testimonialRecords });
};


// View by ID API (Fetch a specific About record by ID)
export const viewTestimonialById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  // Check if the specific testimonial is cached
  const cachedTestimonial = cache.get(`testimonial_${id}`);
  if (cachedTestimonial) {
    return res.status(200).json({ message: 'Fetched Testimonial record successfully (from cache)', data: cachedTestimonial });
  }

  const testimonialRecords = await TestimonialModel(req.app.get('sequelize')).findByPk(id); // Find the record by primary key

  if (!testimonialRecords) {
    return next(new BadRequestException(`Testimonial record with ID ${id} not found`, ErrorCode.TESTIMONIAL_RECORD_NOT_FOUND));

  }
  // Cache the fetched testimonial
  cache.set(`testimonial_${id}`, testimonialRecords);

  return res.status(200).json({ message: 'Fetched Testimonial record successfully', data: testimonialRecords });
};






export const team
  = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = teamSchema.safeParse(req.body);

    // If validation fails, throw a custom error
    if (!validation.success) {
      return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
    }

    // Destructure the data from the validated body
    const { name, designation, email, phone, description } = req.body;


    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files['image'] ? files['image'][0].path : ''; // Check if 'image' exists in req.files

    // Create a new "About" record in the database
    const newTeam = await TeamModel(req.app.get('sequelize')).create({
      name,
      designation,
      email,
      phone,
      description,
      image,
    });
    // Invalidate cache for all teams
    cache.del('teamRecords');

    return res.status(201).json({ message: 'Team created successfully', admin: newTeam });
  };


// Update API
export const updateTeam = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  const validation = teamSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const teamRecord = await TeamModel(req.app.get('sequelize')).findByPk(id);

  // If record not found, return error
  if (!teamRecord) {
    return next(new BadRequestException('testimonial record not found', ErrorCode.TEAM_RECORD_NOT_FOUND));
  }

  // Destructure the data from the validated body
  const { name, description, designation, email, phone } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const image = files['image'] ? files['image'][0].path : '';

  teamRecord.name = name || teamRecord.name;
  teamRecord.description = description || teamRecord.description;
  teamRecord.designation = designation || teamRecord.designation;
  teamRecord.image = image || teamRecord.image;
  teamRecord.email = email || teamRecord.email;
  teamRecord.phone = phone || teamRecord.phone;

  // Save the updated record
  const updatedTeam = await teamRecord.save();
  // Invalidate cache for the specific team and all teams
  cache.del(`team_${id}`);
  cache.del('teamRecords');

  return res.status(200).json({ message: 'Testimonial updated successfully', admin: updatedTeam });
};



// Delete API
export const deleteTeam = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await TeamModel(req.app.get('sequelize')).destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('Team record not found', ErrorCode.TEAM_RECORD_NOT_FOUND));

  }
  // Invalidate cache for the specific team and all teams
  cache.del(`team_${id}`);
  cache.del('teamRecords');


  return res.status(200).json({ message: 'Team deleted successfully' });
};
// View API (Fetch all About records)
export const viewTeam = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  // Check if all team records are cached
  const cachedTeams = cache.get('teamRecords');
  if (cachedTeams) {
    return res.status(200).json({ message: 'Fetched Team records successfully (from cache)', data: cachedTeams });
  }




  const teamRecords = await TeamModel(req.app.get('sequelize')).findAll();

  if (!teamRecords || teamRecords.length === 0) {
    return next(new BadRequestException('Team record not found', ErrorCode.TEAM_RECORD_NOT_FOUND));
  }
  // Cache all team records
  cache.set('teamRecords', teamRecords);


  return res.status(200).json({ message: 'Fetched Team records successfully', data: teamRecords });
};
// View by ID API (Fetch a specific About record by ID)
export const viewTeamById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  // Check if the specific team record is cached
  const cachedTeam = cache.get(`team_${id}`);
  if (cachedTeam) {
    return res.status(200).json({ message: 'Fetched Team record successfully (from cache)', data: cachedTeam });
  }

  const teamRecords = await TeamModel(req.app.get('sequelize')).findByPk(id); // Find the record by primary key

  if (!teamRecords) {
    return next(new BadRequestException(`Team record with ID ${id} not found`, ErrorCode.TEAM_RECORD_NOT_FOUND));

  }
  // Cache the fetched team record
  cache.set(`team_${id}`, teamRecords);

  return res.status(200).json({ message: 'Fetched Team record successfully', data: teamRecords });
};





export const services
  = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = servicesSchema.safeParse(req.body);

    // If validation fails, throw a custom error
    if (!validation.success) {
      return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
    }

    // Destructure the data from the validated body
    const { title, subTitle, mainTitle, description } = req.body;


    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logo = files['logo'] ? files['logo'][0].path : ''; // Check if 'image' exists in req.files
    const image = files['image'] ? files['image'][0].path : '';
    // Create a new "About" record in the database
    const newServices = await ServicesModel(req.app.get('sequelize')).create({
      title,
      subTitle,
      mainTitle,
      logo,
      description,
      image,
    });
    // Invalidate all services cache
    cache.del('servicesRecords');

    return res.status(201).json({ message: 'Services created successfully', admin: newServices });
  };


// Update API
export const updateServices = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  const validation = servicesSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const servicesRecord = await ServicesModel(req.app.get('sequelize')).findByPk(id);

  // If record not found, return error
  if (!servicesRecord) {
    return next(new BadRequestException('testimonial record not found', ErrorCode.SERVICES_RECORD_NOT_FOUND));
  }

  // Destructure the data from the validated body
  const { title, subTitle, mainTitle, description } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const logo = files['logo'] ? files['logo'][0].path : ''; // Check if 'image' exists in req.files
  const image = files['image'] ? files['image'][0].path : '';

  servicesRecord.title = title || servicesRecord.title;
  servicesRecord.subTitle = subTitle || servicesRecord.subTitle;
  servicesRecord.mainTitle = mainTitle || servicesRecord.mainTitle;
  servicesRecord.image = image || servicesRecord.image;
  servicesRecord.logo = logo || servicesRecord.logo;
  servicesRecord.description = description || servicesRecord.description;

  // Save the updated record
  const updatedServices = await servicesRecord.save();
  // Invalidate cache for the specific service and all services
  cache.del(`service_${id}`);
  cache.del('servicesRecords');

  return res.status(200).json({ message: 'Services updated successfully', admin: updatedServices });
};



// Delete API
export const deleteServices = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await ServicesModel(req.app.get('sequelize')).destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('Services record not found', ErrorCode.SERVICES_RECORD_NOT_FOUND));

  }
  // Invalidate cache for the specific service and all services
  cache.del(`service_${id}`);
  cache.del('servicesRecords');


  return res.status(200).json({ message: 'Services deleted successfully' });
};
// View API (Fetch all About records)
export const viewServices = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if services are cached
  const cachedServices = cache.get('servicesRecords');
  if (cachedServices) {
    return res.status(200).json({ message: 'Fetched Services records successfully (from cache)', data: cachedServices });
  }

  const servicesRecords = await ServicesModel(req.app.get('sequelize')).findAll();
  // Cache the fetched services
  cache.set('servicesRecords', servicesRecords);
  return res.status(200).json({ message: 'Fetched Services records successfully', data: servicesRecords });
};
// View by ID API (Fetch a specific About record by ID)
export const viewServicesById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  // Check if the specific service is cached
  const cachedService = cache.get(`service_${id}`);
  if (cachedService) {
    return res.status(200).json({ message: 'Fetched Service record successfully (from cache)', data: cachedService });
  }

  const servicesRecords = await ServicesModel(req.app.get('sequelize')).findByPk(id); // Find the record by primary key

  if (!servicesRecords) {
    return next(new BadRequestException(`Services record with ID ${id} not found`, ErrorCode.SERVICES_RECORD_NOT_FOUND));

  }
  // Cache the fetched service
  cache.set(`service_${id}`, servicesRecords);

  return res.status(200).json({ message: 'Fetched Services record successfully', data: servicesRecords });
};

// View API (Fetch all contacts records)
export const viewContacts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const contactsRecords = await ContactsModel(req.app.get('sequelize')).findAll();

  if (!contactsRecords || contactsRecords.length === 0) {
    return next(new BadRequestException('Contacts record not found', ErrorCode.CONTACTS_RECORD_NOT_FOUND));
  }

  return res.status(200).json({ message: 'Fetched Contacts records successfully', data: contactsRecords });
};



export const category
  = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = categorySchema.safeParse(req.body);

    // If validation fails, throw a custom error
    if (!validation.success) {
      return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
    }

    // Destructure the data from the validated body
    const { name } = req.body;
    // Create a new "About" record in the database
    const newCategory = await ProjectCategoryModel.create({
      name
    });
    // Invalidate all categories cache
    cache.del('categories');

    return res.status(201).json({ message: 'Category created successfully', admin: newCategory });
  };

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await ProjectCategoryModel.destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('Category record not found', ErrorCode.CATEGORY_RECORD_NOT_FOUND));

  }
  // Invalidate cache for all categories and the specific category
  cache.del(`category_${id}`);
  cache.del('categories');

  return res.status(200).json({ message: 'Category deleted successfully' });
};

// View API (Fetch all About records)
export const viewCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if categories are cached
  const cachedCategories = cache.get('categories');
  if (cachedCategories) {
    return res.status(200).json({ message: 'Fetched categories successfully (from cache)', data: cachedCategories });
  }
  const categoryRecords = await ProjectCategoryModel.findAll();

  // if (!categoryRecords || categoryRecords.length === 0) {
  //   return next(new BadRequestException('Services record not found', ErrorCode.CATEGORY_RECORD_NOT_FOUND));
  // }
  // Cache the fetched categories
  cache.set('categories', categoryRecords);
  return res.status(200).json({ message: 'Fetched category records successfully', data: categoryRecords });
};


// View by ID API (Fetch a specific About record by ID)
export const viewCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  // Check if the specific category is cached
  const cachedCategory = cache.get(`category_${id}`);
  if (cachedCategory) {
    return res.status(200).json({ message: 'Fetched category successfully (from cache)', data: cachedCategory });
  }
  const categoryRecords = await ProjectCategoryModel.findByPk(id); // Find the record by primary key

  if (!categoryRecords) {
    return next(new BadRequestException(`category record with ID ${id} not found`, ErrorCode.CATEGORY_RECORD_NOT_FOUND));

  }
  // Cache the fetched category
  cache.set(`category_${id}`, categoryRecords);

  return res.status(200).json({ message: 'Fetched category record successfully', data: categoryRecords });
};





export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  // Validate the incoming request body
  const validation = projectSchema.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }



  const { name, categoryId } = req.body;

  // Ensure `req.files` is either an object or array, and handle accordingly
  const files = req.files;

  if (!files) {
    return next(new Error('No files uploaded'));
  }

  let themeImage = '';
  let additionalFiles: Express.Multer.File[] = [];

  // Check if `files` is an array (for multiple files in one field)
  if (Array.isArray(files)) {
    themeImage = files.length > 0 ? files[0].path : '';  // First image as theme image
    additionalFiles = files.slice(1);  // Rest as additional images
  } else {
    // Check if it's an object (for multiple fields with different file names)
    const themeImageFile = files['themeImage'] as Express.Multer.File[] | undefined;
    const additionalFilesField = files['images'] as Express.Multer.File[] | undefined;

    themeImage = themeImageFile && themeImageFile.length > 0 ? themeImageFile[0].path : '';  // Single theme image
    additionalFiles = additionalFilesField || [];  // Multiple additional images (if any)
  }

  // Create the new project
  const project = await Projects.create({
    name,
    themeImage,
    categoryId,
  });

  // If there are additional images, bulk insert them
  if (additionalFiles.length > 0) {
    const imageRecords = additionalFiles.map((file) => ({
      imageName: file.filename,  // Assuming multer provides the filename
      projectId: project.id,     // Associate images with the project
    }));

    await ProjectImage.bulkCreate(imageRecords);
  }
  // Invalidate the cache for all projects
  cache.del('projects');
  // Respond with the created project and a success message
  res.status(201).json({
    message: 'Project created successfully',
    project,
    images: additionalFiles.map((file) => file.filename),
  });
};

export const viewProjects = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if projects are cached
  const cachedProjects = cache.get('projects');
  if (cachedProjects) {
    return res.status(200).json({
      message: 'Projects retrieved successfully (from cache)',
      data: cachedProjects,
    });
  }

  // Fetch all projects with associated project images and categories
  const projects = await Projects.findAll({
    include: [
      {
        model: ProjectCategory,
        as: 'category', // Alias for the related category
        attributes: ['name'], // Only include the name from ProjectCategory
      },
      {
        model: ProjectImage,
        as: 'project', // Alias for the related category
        attributes: ['imageName'], // Only include the name from ProjectCategory
      },


    ],
  });

  // Cache the fetched projects
  cache.set('projects', projects);
  // Send the response
  res.status(200).json({
    message: 'Projects retrieved successfully',
    data: projects,  // Use 'data' key to encapsulate the projects data
  });

};


export const weAchieved
  = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validation = weAchievedSchema.safeParse(req.body);

    // If validation fails, throw a custom error
    if (!validation.success) {
      return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
    }

    // Destructure the data from the validated body
    const { title, subTitle, date } = req.body;


    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files['image'] ? files['image'][0].path : '';
    // Create a new "About" record in the database
    const newWeAchieved = await WeAchieved.create({
      title,
      subTitle,
      date,
      image,
    });
    // Invalidate the cache for all We Achieved records
    cache.del('weAchievedRecords');
    return res.status(201).json({ message: 'We Achieved created successfully', admin: newWeAchieved });
  };

export const viewWeAchieved = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if We Achieved records are cached
  const cachedWeAchievedRecords = cache.get('weAchievedRecords');
  if (cachedWeAchievedRecords) {
    return res.status(200).json({
      message: 'We Achieved records retrieved successfully (from cache)',
      data: cachedWeAchievedRecords,
    });
  }

  const WeAchievedRecords = await WeAchieved.findAll();
  // Cache the fetched records
  cache.set('weAchievedRecords', WeAchievedRecords);

  return res.status(200).json({ message: 'Fetched We Achieved records successfully', data: WeAchievedRecords });
};



// Update API
export const updateWeAchieved = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  const validation = weAchievedSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const WeAchievedRecord = await WeAchieved.findByPk(id);

  // If record not found, return error
  if (!WeAchievedRecord) {
    return next(new BadRequestException('testimonial record not found', ErrorCode.WEACHIEVED_RECORD_NOT_FOUND));
  }

  // Destructure the data from the validated body
  const { title, subTitle, date } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const image = files['image'] ? files['image'][0].path : '';

  WeAchievedRecord.title = title || WeAchievedRecord.title;
  WeAchievedRecord.subTitle = subTitle || WeAchievedRecord.subTitle;
  WeAchievedRecord.date = date || WeAchievedRecord.date;
  WeAchievedRecord.image = image || WeAchievedRecord.image;

  // Save the updated record
  const updatedWeAchievedRecord = await WeAchievedRecord.save();
  // Invalidate the cache for all We Achieved records
  cache.del('weAchievedRecords');

  return res.status(200).json({ message: 'We Achieved Record updated successfully', admin: updatedWeAchievedRecord });
};



// Delete API
export const deleteWeAchieved = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await WeAchieved.destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('We Achieved Record record not found', ErrorCode.WEACHIEVED_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for all We Achieved records
  cache.del('weAchievedRecords');
  return res.status(200).json({ message: 'We Achieved deleted successfully' });
};

// View by ID API (Fetch a specific About record by ID)
export const viewWeAchievedById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  // Check if the specific We Achieved record is cached
  const cachedWeAchieved = cache.get(`weAchievedRecord:${id}`);
  if (cachedWeAchieved) {
    return res.status(200).json({
      message: 'We Achieved record retrieved successfully (from cache)',
      data: cachedWeAchieved,
    });
  }
  const WeAchievedRecords = await WeAchieved.findByPk(id); // Find the record by primary key

  if (!WeAchievedRecords) {
    return next(new BadRequestException(`We Achieved Records record with ID ${id} not found`, ErrorCode.WEACHIEVED_RECORD_NOT_FOUND));

  }
  // Cache the fetched record
  cache.set(`weAchievedRecord:${id}`, WeAchievedRecords);


  return res.status(200).json({ message: 'Fetched We Achieved Records record successfully', data: WeAchievedRecords });
};




export const createClientHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const image = files['image'] ? files['image'][0].path : '';

  // Create a new client record in the database using the Client model
  const newClient = await Client.create({
    image,
  });
  // Invalidate the cache for all Client records
  cache.del('clientRecords');
  return res.status(201).json({ message: 'Client created successfully', client: newClient });

};

export const viewClient = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if Client records are cached
  const cachedClientRecords = cache.get('clientRecords');
  if (cachedClientRecords) {
    return res.status(200).json({
      message: 'Fetched Client records successfully (from cache)',
      data: cachedClientRecords,
    });
  }

  const viewClientRecords = await Client.findAll();
  // Cache the fetched records
  cache.set('clientRecords', viewClientRecords);

  return res.status(200).json({ message: 'Fetched  Client records successfully', data: viewClientRecords });
};
// Delete API
export const deleteClient = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await Client.destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('Client Record record not found', ErrorCode.CLIENT_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for all Client records
  cache.del('clientRecords');

  return res.status(200).json({ message: 'Client deleted successfully' });
};








export const createBestProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const image = files['image'] ? files['image'][0].path : '';

  // Create a new client record in the database using the Client model
  const newClient = await BestProject.create({
    image,
  });
  // Invalidate the cache for all BestProject records
  cache.del('bestProjects');
  return res.status(201).json({ message: 'Client created successfully', client: newClient });

};

export const viewBestProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if BestProject records are cached
  const cachedBestProjects = cache.get('bestProjects');
  if (cachedBestProjects) {
    return res.status(200).json({
      message: 'Best Project records retrieved successfully (from cache)',
      data: cachedBestProjects,
    });
  }

  const bestProjectRecords = await BestProject.findAll();
  // Cache the fetched records
  cache.set('bestProjects', bestProjectRecords);

  return res.status(200).json({ message: 'Fetched  Client records successfully', data: bestProjectRecords });
};


// Delete API
export const deleteBestProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await BestProject.destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('BestProject record not found', ErrorCode.CLIENT_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for all BestProject records
  cache.del('bestProjects');

  return res.status(200).json({ message: 'BestProject deleted successfully' });
};





export const createStory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  const { link } = req.body

  // Create a new client record in the database using the Client model
  const newLink = await Story.create({
    link,
  });
  // Invalidate the cache for all Story records
  cache.del('storyRecords');
  return res.status(201).json({ message: 'Link created successfully', client: newLink });

};

export const viewStory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if Story records are cached
  const cachedStoryRecords = cache.get('storyRecords');
  if (cachedStoryRecords) {
    return res.status(200).json({
      message: 'Story records retrieved successfully (from cache)',
      data: cachedStoryRecords,
    });
  }

  const storyRecords = await Story.findAll();
  // Cache the fetched records
  cache.set('storyRecords', storyRecords);

  return res.status(200).json({ message: 'Fetched  Story records successfully', data: storyRecords });
};
// Delete API
export const deleteStory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await Story.destroy({
    where: { id }, // Delete the record by ID
  });

  if (deletedCount === 0) {
    return next(new BadRequestException('Story record not found', ErrorCode.CLIENT_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for all Story records
  cache.del('storyRecords');

  return res.status(200).json({ message: 'Story deleted successfully' });
};







export const createBlog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const validation = blogSchema.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const { title, description } = req.body
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const image = files['image'] ? files['image'][0].path : '';

  // Create a new client record in the database using the Client model
  const newBlog = await Blog.create({
    image,
    title,
    description
  });
  // Invalidate the cache for all Blog records
  cache.del('blogRecords');
  return res.status(201).json({ message: 'Blog created successfully', client: newBlog });

};

export const viewBlog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if Blog records are cached
  const cachedBlogRecords = cache.get('blogRecords');
  if (cachedBlogRecords) {
    return res.status(200).json({
      message: 'Blog records retrieved successfully (from cache)',
      data: cachedBlogRecords,
    });
  }

  const blogRecords = await Blog.findAll();
  // Cache the fetched records
  cache.set('blogRecords', blogRecords);

  return res.status(200).json({ message: 'Fetched  Blog records successfully', data: blogRecords });
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await Blog.destroy({
    where: { id }, // Delete the record by ID
  });
  if (deletedCount === 0) {
    return next(new BadRequestException('Blog record not found', ErrorCode.CLIENT_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for all Blog records
  cache.del('blogRecords');
  return res.status(200).json({ message: 'Blog deleted successfully' });
};


export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const validation = jobSchema.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const { deadline, position, location, experience, salary, vacancies, keyResponsibilities, skillsExperience, description } = req.body


  // Create a new client record in the database using the Client model
  const newJob = await Job.create({
    deadline,
    position,
    location,
    experience,
    salary,
    vacancies,
    keyResponsibilities,
    skillsExperience,
    description,
  })

  // Invalidate the cache for all Job records
  cache.del('jobRecords');

  return res.status(201).json({ message: 'Job created successfully', client: newJob });

};


export const viewJob = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Check if Job records are cached
  const cachedJobRecords = cache.get('jobRecords');
  if (cachedJobRecords) {
    return res.status(200).json({
      message: 'Job records retrieved successfully (from cache)',
      data: cachedJobRecords,
    });
  }

  const jobRecords = await Job.findAll({
    order: [['createdAt', 'DESC']], // Assuming 'createdAt' is the field for creation date
  });
  // Cache the fetched records
  cache.set('jobRecords', jobRecords);

  return res.status(200).json({ message: 'Fetched  Job records successfully', data: jobRecords });
};
export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters

  const deletedCount = await Job.destroy({
    where: { id }, // Delete the record by ID
  });
  if (deletedCount === 0) {
    return next(new BadRequestException('Job record not found', ErrorCode.JOB_RECORD_NOT_FOUND));

  }
  // Invalidate the cache for all Job records
  cache.del('jobRecords');

  return res.status(200).json({ message: 'Job deleted successfully' });
};

export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<any> => {


  const { id } = req.params; // Get the ID of the record from the URL parameters
  const validation = jobSchema.safeParse(req.body);

  // If validation fails, throw a custom error
  if (!validation.success) {
    return next(new UnprocessableEntity(validation.error.errors, 'Validation Error'));
  }

  const JobRecord = await Job.findByPk(id);

  // If record not found, return error
  if (!JobRecord) {
    return next(new BadRequestException('Job record not found', ErrorCode.JOB_RECORD_NOT_FOUND));
  }

  // Destructure the data from the validated body
  const { deadline, position, location, experience, salary, vacancies, keyResponsibilities, skillsExperience, description } = req.body

  JobRecord.deadline = deadline || JobRecord.deadline;
  JobRecord.position = position || JobRecord.position;
  JobRecord.location = location || JobRecord.location;
  JobRecord.experience = experience || JobRecord.experience;
  JobRecord.salary = salary || JobRecord.salary;
  JobRecord.vacancies = vacancies || JobRecord.vacancies;
  JobRecord.keyResponsibilities = keyResponsibilities || JobRecord.keyResponsibilities;
  JobRecord.skillsExperience = skillsExperience || JobRecord.skillsExperience;
  JobRecord.description = description || JobRecord.description;

  // Save the updated record
  const updatedJobRecord = await JobRecord.save();
  // Invalidate the cache for all Job records
  cache.del('jobRecords');

  return res.status(200).json({ message: 'Job record updated successfully', job: updatedJobRecord });
};


interface CachedJobApplyData {
  data: Job[]; // Array of Job objects
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export const jobApplyById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; // Get the ID of the record from the URL parameters
  const { page = 1, limit = 100 } = req.query; // Pagination parameters

  const cacheKey = `jobApplyRecords:${id}:${page}:${limit}`;

  // Check if job application records are cached for the current page
  const cachedJobApplyRecords = cache.get(cacheKey) as CachedJobApplyData | undefined;

  if (cachedJobApplyRecords) {
    console.log(`Cache hit: Job Apply records found for Job ID ${id}, Page ${page}`);
    return res.status(200).json({
      message: 'Job Apply records retrieved successfully (from cache)',
      data: cachedJobApplyRecords.data,
      totalRecords: cachedJobApplyRecords.totalRecords,
      totalPages: cachedJobApplyRecords.totalPages,
      currentPage: cachedJobApplyRecords.currentPage,
    });
  } else {
    console.log(`Cache miss: Job Apply records not found for Job ID ${id}, Page ${page}`);
  }

  // Find paginated records by jobId, and get the total count
  const { rows: jobApplyRecords, count: totalRecords } = await ApplyList.findAndCountAll({
    where: { jobId: id },
    offset: (parseInt(page as string) - 1) * parseInt(limit as string),
    limit: parseInt(limit as string),
  });

  // Check if no records are found
  if (jobApplyRecords.length === 0) {
    return next(new BadRequestException(`Job Apply record with ID ${id} not found`, ErrorCode.WEACHIEVED_RECORD_NOT_FOUND));
  }

  const totalPages = Math.ceil(totalRecords / parseInt(limit as string));

  // Cache the fetched records along with total count and pagination info
  cache.set(cacheKey, {
    data: jobApplyRecords,
    totalRecords,
    totalPages,
    currentPage: parseInt(page as string),
  });

  // Respond with the records and the total count
  return res.status(200).json({
    message: 'Fetched job Apply Records successfully',
    data: jobApplyRecords,
    totalRecords,
    totalPages,
    currentPage: parseInt(page as string),
  });
};

// API route to update job applicant status
export const updateApplicantStatus = async (req: Request, res: Response) => {
  const { applicantId, status } = req.params; // Extract applicantId and status from the URL parameters

  if (!['Submitted', 'ShortListed', 'Finalized', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }


  // Find the applicant by ID and update the status
  const updatedApplicant = await ApplyList.update(
    { status },  // Update status
    { where: { id: applicantId } }  // Find the applicant by ID
  );

  if (updatedApplicant[0] === 0) {
    return res.status(404).json({ message: 'Applicant not found' });
  }
  cache.flushAll()

  return res.status(200).json({ message: 'Status updated successfully' });
};




export const Shortlistedemail = async (req: Request, res: Response): Promise<Response> => {
  // Extracting data from the request body
  const {
    interviewDate,
    jobId,
    senderName,
    senderPosition,
    jobTitle
  } = req.body;
  const companyName = 'IQ Architects'
  try {
    // Fetch shortlisted applicants for the given jobId
    const shortlistedApplicants = await ApplyList.findAll({
      where: {
        jobId: jobId,
        status: 'Shortlisted',
      },
    });


    // Check if there are shortlisted applicants
    if (shortlistedApplicants.length === 0) {
      return res.status(404).json({
        message: 'No shortlisted applicants found for the given job ID.',
      });
    }

    // Loop through each shortlisted applicant to send emails
    await Promise.all(shortlistedApplicants.map(async (applicant) => {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; margin: 20px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
                <p>Dear <strong>${applicant.name}</strong>,</p>

                <p>We are pleased to inform you that after reviewing your application, you have been shortlisted for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. Congratulations on making it to the next round!</p>

                <h3>Next Steps:</h3>
                <p>Our recruitment team will reach out to you shortly with further details about the next phase of the selection process. Please ensure that you are available for the upcoming interview on <strong>${interviewDate}</strong> and any additional assessments. If you have any questions, feel free to contact us.</p>

                <p>We look forward to getting to know you better!</p>

                <p>Best regards,<br>
                <strong>${senderName}</strong><br>
                ${senderPosition}<br>
                <strong>${companyName}</strong></p>
            </div>
            <div style="margin-top: 20px; font-size: 0.9em; color: #777;">
                <p>This email was sent to you because you applied for a position at ${companyName}.</p>
            </div>
        </div>
      `;

      await sendEmail(
        applicant.email,
        `Congratulations! You’ve Been Shortlisted for ${applicant.jobId} at ${companyName}`,
        '',
        emailContent
      );
    }));

    return res.status(200).json({
      message: 'Shortlisted emails sent successfully to all applicants.',
    });
  } catch (error: any) {
    console.error('Error sending emails:', error);
    return res.status(500).json({
      message: 'Error sending shortlisted emails',
      error: error.message,
    });
  }
};





export const compressAllImages = async (req: Request, res: Response) => {
  const uploadDir = 'upload2/';
  const files = fs.readdirSync(uploadDir);

  // Filter only image files by checking the file extension
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png|svg|webp|avif)$/i.test(file));

  const compressPromises = imageFiles.map(async (file, index) => {
    const filePath = path.join(uploadDir, file);
    const compressedPath = path.join(uploadDir, `${index + 1}.webp`);  // Sequential renaming
    const targetSize = 25 * 1024; // 25 KB target

    let quality = 50; // Start at 50% quality for more aggressive compression
    let compressedBuffer;

    try {
      // Read image and get metadata
      const imageBuffer = await sharp(filePath).toBuffer();
      const metadata = await sharp(imageBuffer).metadata();

      // Check if metadata is valid and contains width and height
      if (!metadata || typeof metadata.width !== 'number' || typeof metadata.height !== 'number') {
        throw new Error(`Metadata for ${file} is not valid or missing width/height.`);
      }

      // Optionally resize if the image is too large
      const maxWidth = 800; // Define max width
      const maxHeight = 800; // Define max height

      // Calculate aspect ratio
      const aspectRatio = metadata.width / metadata.height;
      let resizeWidth = metadata.width;
      let resizeHeight = metadata.height;

      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        if (aspectRatio > 1) {
          resizeWidth = maxWidth;
          resizeHeight = Math.round(maxWidth / aspectRatio);
        } else {
          resizeHeight = maxHeight;
          resizeWidth = Math.round(maxHeight * aspectRatio);
        }
      }

      // Dynamically adjust quality to fit the target size (25KB)
      do {
        compressedBuffer = await sharp(imageBuffer)
          .resize({ width: resizeWidth, height: resizeHeight })
          .webp({ quality })  // Always convert to webp
          .toBuffer();
        quality -= 5; // Decrease quality in each iteration
      } while (compressedBuffer.length > targetSize && quality > 0); // Allow going down to quality 0

      // Write the compressed image to disk with sequential renaming
      await sharp(compressedBuffer).toFile(compressedPath);

      // Remove the original file
      fs.unlinkSync(filePath);

      return compressedPath; // Return the path of the compressed image
    } catch (error) {
      console.error(`Failed to compress ${file}:`, error);
      throw new Error(`Compression failed for ${file}`);
    }
  });

  try {
    await Promise.all(compressPromises);
    res.status(200).send({ message: 'All images compressed and renamed successfully!' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to compress all images' });
  }
};


// Create a new Category
export const createMainServicesCategory = async (req: Request, res: Response) => {
  
    const { name } = req.body;

    // Check for required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const newCategory = await MainServicesCategory.create({ name });

    return res.status(201).json({
      message: 'Category created successfully.',
      data: newCategory,
    });
  
};
// Get all Categories with SubCategories
export const getAllMainServicesCategories = async (_req: Request, res: Response): Promise<Response> => {
  
    // Fetch all main service categories with associated subcategories
    const categories = await MainServicesCategory.findAll({
      include: [
        {
          association: 'subCategories', // Ensure this matches your Sequelize association name
          attributes: ['id', 'name'], // Fetch only relevant fields
        },
      ],
    });

    return res.status(200).json({
      message: 'Categories fetched successfully.',
      data: categories,
    });
};

// Get Category by ID with SubCategories
export const getMainServicesCategoryById = async (req: Request, res: Response) => {
  
    const { id } = req.params;

    const category = await MainServicesCategory.findByPk(id, {
      include: [{ model: MainServicesSubCategory, as: 'subCategories' }],
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.status(200).json({
      message: 'Category fetched successfully.',
      data: category,
    });
  
};
// Delete Category by ID
export const deleteMainServicesCategory = async (req: Request, res: Response) => {

    const { id } = req.params;

    const category = await MainServicesCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await category.destroy();

    return res.status(200).json({ message: 'Category deleted successfully.' });
  
};

// Create a new SubCategory
export const createMainServicesSubCategory = async (req: Request, res: Response) => {
  
    const { name, categoryId } = req.body;

    // Check for required fields
    if (!name || !categoryId) {
      return res.status(400).json({ message: 'Name and Category ID are required.' });
    }

    const newSubCategory = await MainServicesSubCategory.create({
      name,
      categoryId,
    });

    return res.status(201).json({
      message: 'SubCategory created successfully.',
      data: newSubCategory,
    });
};




export const getMainServicesSubCategory = async (req: Request, res: Response) => {
 
    const subCategories = await MainServicesSubCategory.findAll({
      include: [
        {
          model: MainServicesCategory,
          as: 'category', // Alias must match the one in associations
          attributes: ['id', 'name'], // Fetch only relevant fields
        },
      ],
    });

    return res.status(200).json({
      message: 'SubCategory fetched successfully.',
      data: subCategories,
    });
  
};


// Get SubCategory by ID
export const getMainServicesSubCategoryById = async (req: Request, res: Response) => {
  
    const { id } = req.params;

    const subCategory = await MainServicesSubCategory.findAll({
      where: {
        categoryId: id,
      },
    });
    
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found.' });
    }

    return res.status(200).json({
      message: 'SubCategory fetched successfully.',
      data: subCategory,
    });
  
};

// Delete SubCategory by ID
export const deleteMainServicesSubCategory = async (req: Request, res: Response) => {
 
    const { id } = req.params;

    const subCategory = await MainServicesSubCategory.findByPk(id);

    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found.' });
    }

    await subCategory.destroy();

    return res.status(200).json({ message: 'SubCategory deleted successfully.' });
  
};


// Create a new MainService
export const createMainServices = async (req: Request, res: Response) => {
  
    const { subTitle, videoLink, description, categoryId, subCategoryId } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const logo = files['logo'] ? files['logo'][0].path : ''; // Check if 'image' exists in req.files
    const backgroundImage = files['backgroundImage'] ? files['backgroundImage'][0].path : ''; // Check if 'image' exists in req.files

    // Check for required fields
    if (!subTitle || !categoryId) {
      return res.status(400).json({ message: 'SubTitle and Category ID are required.' });
    }

    // Create the new subcategory entry in the database
    const newSubCategory = await MainServices.create({
      subTitle,
      videoLink,
      description,
      categoryId,
      subCategoryId,
      logo, 
      backgroundImage
    });

    // Return success response
    return res.status(201).json({
      message: 'MainService created successfully.',
      data: newSubCategory,
    });
};

export const getMainServices = async (req: Request, res: Response) => {
 
  const mainServices = await MainServices.findAll({
      include: [
        {
          model: MainServicesCategory,
          as: 'category', // Alias must match the one in associations
          attributes: ['id', 'name'], // Fetch only relevant fields
          
        },
        {
          model: MainServicesSubCategory,
          as: 'subCategory', // Alias must match the one in associations
          attributes: ['id', 'name'], // Fetch only relevant fields
          
        },
      ],
    });

  return res.status(200).json({
    message: 'Main Services fetched successfully.',
    data: mainServices,
  });

};

export const deleteMainServices = async (req: Request, res: Response) => {
 
  const { id } = req.params;
  console.log(id)

  const services = await MainServices.findByPk(id);

  if (!services) {
    return res.status(404).json({ message: 'Services not found.' });
  }

  await services.destroy();

  return res.status(200).json({ message: 'Services deleted successfully.' });

};