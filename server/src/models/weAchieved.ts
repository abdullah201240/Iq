import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize'; // Sequelize instance

// Define the interface for the attributes
interface WeAchievedAttributes {
  id: number;
  title: string;
  subTitle: string;
  date: string;
  image: string; // Fixed naming convention
}

// Define the optional attributes for creation
interface WeAchievedCreationAttributes extends Optional<WeAchievedAttributes, 'id'> {}

// Define the Sequelize model class
class WeAchieved
  extends Model<WeAchievedAttributes, WeAchievedCreationAttributes>
  implements WeAchievedAttributes
{
  public id!: number;
  public title!: string;
  public subTitle!: string;
  public date!: string;
  public image!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
WeAchieved.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Pass the Sequelize instance
    modelName: 'WeAchieved',
    tableName: 'we_achieved',
    timestamps: true, // Enables createdAt and updatedAt
  }
);

export default WeAchieved;
