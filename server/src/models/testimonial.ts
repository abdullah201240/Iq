import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Testimonial model
export interface TestimonialAttributes {
  id: number;
  designation: string;
  title: string;
  description: string;
  image: string;
}

// Specify which attributes are optional for model creation
export interface TestimonialCreationAttributes extends Optional<TestimonialAttributes, 'id'> {}

// Define the Testimonial model class
class Testimonial extends Model<TestimonialAttributes, TestimonialCreationAttributes> implements TestimonialAttributes {
  public id!: number;
  public title!: string;
  public designation!: string;
  public description!: string;
  public image!: string;

  // Add any instance-level methods here if needed
}

// Initialize the Testimonial model
const TestimonialModel = (sequelizeInstance: Sequelize): typeof Testimonial => {
  Testimonial.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING, // Match max length from Zod schema
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING, // Match max length from Zod schema
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT, // Store valid URLs as strings
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, // Store valid URLs as strings
        allowNull: false,
      },
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'Testimonial',
      tableName: 'testimonials', // Specify table name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  return Testimonial;
};

export default TestimonialModel;
