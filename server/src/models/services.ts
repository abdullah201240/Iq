import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Services model
export interface ServicesAttributes {
  id: number;
  title: string;
  subTitle: string;
  logo: string;
  image: string;
  mainTitle: string;
  description: string;
}

// Specify which attributes are optional for model creation
export interface ServicesCreationAttributes extends Optional<ServicesAttributes, 'id'> {}

// Define the Services model class
class Services extends Model<ServicesAttributes, ServicesCreationAttributes> implements ServicesAttributes {
  public id!: number;
  public title!: string;
  public subTitle!: string;
  public logo!: string;
  public image!: string;
  public mainTitle!: string;
  public description!: string;

}

// Initialize the Services model
const ServicesModel = (sequelizeInstance: Sequelize): typeof Services => {
  Services.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING, // Matches the title field in the interface
        allowNull: false,
      },
      subTitle: {
        type: DataTypes.STRING, // Matches the subTitle field in the interface
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING, // Matches the logo field in the interface
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, // Matches the image field in the interface
        allowNull: false,
      },
      mainTitle: {
        type: DataTypes.STRING, // Matches the mainTitle field in the interface
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT, // Matches the description field in the interface
        allowNull: false,
      },
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'Services',
      tableName: 'services', // Specify table name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  return Services;
};

export default ServicesModel;
