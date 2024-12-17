import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Team model
export interface TeamAttributes {
  id: number;
  name: string;
  designation: string;
  email: string;
  phone: string;
  
  description: string;
  image: string;
}

// Specify which attributes are optional for model creation
export interface TeamCreationAttributes extends Optional<TeamAttributes, 'id'> {}

// Define the Team model class
class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
  public id!: number;
  public name!: string;
  public designation!: string;
  public email!: string;
  public phone!: string;

  public description!: string;
  public image!: string;

  // Add any instance-level methods here if needed
}

// Initialize the Team model
const TeamModel = (sequelizeInstance: Sequelize): typeof Team => {
  Team.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING, // Matches the name field in the interface
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING, // Matches the designation field in the interface
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING, // Matches the email field in the interface
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING, // Matches the phone field in the interface
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT, // Matches the description field in the interface
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, // Matches the image field in the interface
        allowNull: false,
      },
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'Team',
      tableName: 'teams', // Specify table name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  return Team;
};

export default TeamModel;
