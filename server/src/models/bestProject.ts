import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize'; // Sequelize instance

// Define the interface for the attributes
interface BestProjectAttributes {
    id:number
  image: string; // Fixed naming convention
}

// Define the optional attributes for creation
interface BestProjectCreationAttributes extends Optional<BestProjectAttributes, 'id'> {}

// Define the Sequelize model class
class BestProject
  extends Model<BestProjectAttributes, BestProjectCreationAttributes>
  implements BestProjectAttributes
{
  public id!: number;
  public image!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
BestProject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Pass the Sequelize instance
    modelName: 'BestProject',
    tableName: 'best_project',
    timestamps: true, // Enables createdAt and updatedAt
  }
);

export default BestProject;
