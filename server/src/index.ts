import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import db from './config/sequelize'; // Adjust path
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet'; // HTTP header security
import xssClean from 'xss-clean'; // Prevents XSS attacks
import hpp from 'hpp'; // Prevents HTTP Parameter Pollution
import { errorMiddleware } from './middleware/error'; // Adjust path as needed
import cookieParser from 'cookie-parser'; // Import cookie-parser
import compression from 'compression'; // Import compression
import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8080', 10); // Ensure port is a number

// Use morgan to log HTTP requests
app.use(morgan('combined')); // You can change the format as per your needs
app.use(bodyParser.json());

// Helmet for setting secure HTTP headers
app.use(helmet());
app.use(compression())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      // Allow requests without an origin header (e.g., from Postman, curl)
      callback(null, true);
    } else {
      const allowedOrigins = [
        "http://localhost:3000", 
        "http://192.168.68.188:3000",
        "http://192.168.68.188:8080"
      ];
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // allow the request
      } else {
        callback(new Error('Not allowed by CORS'), false); // reject the request
      }
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));



// Protect against XSS attacks
app.use(xssClean());

// Protect against HTTP Parameter Pollution (duplicate query params)
app.use(hpp());
// Cookie Parser Middleware
app.use(cookieParser());

// Sanitize user input (optional, you can use libraries like express-validator for more control)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the routes
app.use('/api', routes);

// Error handling middleware should be the last middleware
app.use(errorMiddleware);

// Serve static files (uploads)
app.use('/upload', express.static('upload'));
app.use('/uploadPdf', express.static('uploadPdf'));

app.get("/", (req: Request, res: Response) => {
  res.send("Express on Vercel");
});


// Connect to database
db.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Database connection failed:', err));

// Start the server and connect to the database
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
