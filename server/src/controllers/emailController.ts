import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('EMAIL_USER and EMAIL_PASS must be defined in the .env file');
}

// Create the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ensure you're using a valid service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define the Attachment interface
export interface Attachment {
  filename: string;  // The name of the file
  content?: Buffer;  // The content of the file, read as Buffer
  path?: string;     // Alternatively, you can use path to point to a file
}

// Send email function
export default async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string, // Optional HTML content
  attachments?: Attachment[] // Attachments array
): Promise<void> {
  try {
    // Define mail options
    const mailOptions = {
      from: `Interio <${process.env.EMAIL_USER}>`, // Sender's email
      to: to,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments, // Optional attachments
    };

    // Send the email using async/await
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.response);
  } catch (error:any) {
    console.error('Error sending email:', error);

    // Rethrow error to handle it in the calling function if needed
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
