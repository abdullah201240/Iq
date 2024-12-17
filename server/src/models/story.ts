import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize'; // Sequelize instance

// Define the interface for the attributes
interface StoryAttributes {
    id:number
  link: string; // Fixed naming convention
}

// Define the optional attributes for creation
interface StoryCreationAttributes extends Optional<StoryAttributes, 'id'> {}

// Define the Sequelize model class
class Story
  extends Model<StoryAttributes, StoryCreationAttributes>
  implements StoryAttributes
{
  public id!: number;
  public link!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Story.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Pass the Sequelize instance
    modelName: 'Story',
    tableName: 'story',
    timestamps: true, // Enables createdAt and updatedAt
  }
);

export default Story;
