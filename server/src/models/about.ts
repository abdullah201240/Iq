import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the About model
export interface AboutAttributes {
  id: number;
  homeTitle: string;
  homeDescription: string;
  homeImage: string;
  homeVideo: string;
  title: string;
  description: string;
  image: string;
  video: string;
}

// Specify which attributes are optional for model creation
export interface AboutCreationAttributes extends Optional<AboutAttributes, 'id'> {}

// Define the About model class
class About extends Model<AboutAttributes, AboutCreationAttributes> implements AboutAttributes {
  public id!: number;
  public homeTitle!: string;
  public homeDescription!: string;
  public homeImage!: string;
  public homeVideo!: string;
  public title!: string;
  public description!: string;
  public image!: string;
  public video!: string;

  // Add any instance-level methods here if needed
}

// Initialize the About model
const AboutModel = (sequelizeInstance: Sequelize): typeof About => {
  About.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      homeTitle: {
        type: DataTypes.STRING(55), // Match max length from Zod schema
        allowNull: false,
      },
      homeDescription: {
        type: DataTypes.STRING(600), // Match max length from Zod schema
        allowNull: false,
      },
      homeImage: {
        type: DataTypes.STRING, // Store valid URLs as strings
        allowNull: false,
       
      },
      homeVideo: {
        type: DataTypes.STRING, // Store valid URLs as strings
        allowNull: false,
        
      },
      title: {
        type: DataTypes.STRING(30), // Match max length from Zod schema
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(800), // Match max length from Zod schema
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, // Store valid URLs as strings
        allowNull: false,
        
      },
      video: {
        type: DataTypes.STRING, // Store valid URLs as strings
        allowNull: false,
        
      },
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'About',
      tableName: 'abouts', // Specify table name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  return About;
};

export default AboutModel;
