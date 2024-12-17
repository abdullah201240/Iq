import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize';  // Sequelize instance
import ProjectCategory from './projectCategory';  // Import ProjectCategory
import ProjectImage from './projectImage';

// Define the attributes for the Projects model
interface ProjectAttributes {
  id: number;
  name: string;
  themeImage: string;
  categoryId: number; // Foreign key reference to ProjectCategory
}

// Define the attributes required for creation (without the 'id' field)
interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

class Projects extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public name!: string;
  public themeImage!: string;
  public categoryId!: number;

  // Relationships
  public readonly category?: ProjectCategory;
  public readonly images?: ProjectImage[];
}

Projects.init(
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
    themeImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Projects',
    tableName: 'projects',
    timestamps: true,
  }
);

Projects.hasMany(ProjectImage, { foreignKey: 'projectId', as: 'project' });

// Associations
Projects.belongsTo(ProjectCategory, {
  foreignKey: 'categoryId',
  as: 'category',
});



export default Projects;
