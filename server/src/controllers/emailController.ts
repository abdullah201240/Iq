import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Define the Attachment interface
interface Attachment {
  filename: string;  // The name of the file
  content?: Buffer;  // The content of the file, read as Buffer
  path?: string;     // Alternatively, you can use path to point to a file
}

export default function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string, // Optional HTML content
  attachments?: Attachment[] // Attachments array
) {
  const mailOptions = {
    from: `Interio <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: attachments
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}