import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the ApplyList model
export interface ApplyListAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  salary: string;
  choosePosition: string;
  portfolio: string;
  resume: string;
  jobId: string;
  status: string;
}

// Specify which attributes are optional for model creation
export interface ApplyListCreationAttributes
  extends Optional<ApplyListAttributes, 'id'> {}

// Define the ApplyList model class
class ApplyList
  extends Model<ApplyListAttributes, ApplyListCreationAttributes>
  implements ApplyListAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public education!: string;
  public experience!: string;
  public salary!: string;
  public choosePosition!: string;
  public portfolio!: string;
  public resume!: string;
  public jobId!: string;
  public status!: string;

  // Add any instance-level methods here if needed
}

// Initialize the ApplyList model
ApplyList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    choosePosition: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    portfolio: {
      type: DataTypes.STRING,
      allowNull: true, // Portfolio might be optional
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobId:{
        type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
      allowNull: false,
    },

    
  },
  {
    sequelize: db, // Use the configured Sequelize instance
    modelName: 'ApplyList',
    tableName: 'apply_list', // Specify table name
    timestamps: true, // Enable `createdAt` and `updatedAt`
  }
);

export default ApplyList;
