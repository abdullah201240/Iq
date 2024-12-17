import { z } from 'zod';

const signupSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters long'),

  email: z.string()
    .email('Invalid email')
    .min(1, 'Email is required'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters long')
    .max(15, 'Phone number must be at most 15 characters long'),

  dob: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Date of Birth must be a valid date',
    }),

  gender: z.string()
    .min(1, 'Gender is required')
    .max(10, 'Gender must be at most 10 characters long'),

  role: z.string()
    .min(3, 'Role must be at least 3 characters long')
    .max(20, 'Role must be at most 20 characters long'),
});

const loginSchema = z.object({
  email: z.string()
    .email('Invalid email')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required'),
});
const aboutSchema = z.object({
  homeTitle: z.string()
    .max(55, 'Home title must be at most 55 characters long'),

  homeDescription: z.string()
    .max(600, 'Home description must be at most 600 characters long'),



  homeVideo: z.string()
    .url('Home video must be a valid URL'),

  title: z.string()
    .max(30, 'Title must be at most 30 characters long'),

  description: z.string()
    .max(800, 'Description must be at most 800 characters long'),



  video: z.string()
    .url('Video must be a valid URL'),
});

const testimonialSchema  = z.object({
  title: z.string(),

  designation: z.string(),


    description: z.string(),

  
});
const teamSchema = z.object({
  name: z.string(),
  designation: z.string(),
  email: z.string().email(), // Ensures that the email is in a valid format
  phone: z.string(),
  description: z.string(),
});

const servicesSchema = z.object({
  title: z.string(),  // Ensures the title is a string
  subTitle: z.string(),  // Ensures the subTitle is a string
  mainTitle: z.string(),  // Ensures the mainTitle is a string
  description: z.string(),  // Ensures the description is a string
});

const contactsSchema = z.object({
  name: z.string(),  // Ensures the title is a string
  phone: z.string(),  // Ensures the subTitle is a string
  email: z.string().email(), // Ensures that the email is in a valid format
  subject: z.string(),  // Ensures the description is a string
  description: z.string(),  // Ensures the description is a string
});
const categorySchema = z.object({
  name: z.string(),  // Ensures the title is a string
 
});

const projectSchema = z.object({
  name: z.string(), 
  categoryId: z.string(),  
});



const weAchievedSchema = z.object({
  title: z.string(), 
  subTitle: z.string(),  
  date: z.string(),  

});

const blogSchema = z.object({
  title: z.string(), 
  description: z.string(),   

});
const jobSchema = z.object({
  deadline: z.string(),
  position: z.string(),
  location: z.string(),
  experience: z.string(),
  description: z.string(),
  salary: z.string(),
  vacancies: z.string(),
  keyResponsibilities: z.string(),
  skillsExperience: z.string(),
});


export {jobSchema,blogSchema, weAchievedSchema,projectSchema,categorySchema, contactsSchema,signupSchema,servicesSchema,teamSchema, loginSchema,aboutSchema ,testimonialSchema};

