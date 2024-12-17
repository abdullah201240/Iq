import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize';  // Sequelize instance

// Define the attributes for the ProjectCategory model
interface ProjectCategoryAttributes {
  id: number;
  name: string;
}

// Define the attributes required for creation (without the 'id' field)
interface ProjectCategoryCreationAttributes extends Optional<ProjectCategoryAttributes, 'id'> {}

class ProjectCategory extends Model<ProjectCategoryAttributes, ProjectCategoryCreationAttributes> implements ProjectCategoryAttributes {
  public id!: number;
  public name!: string;

 
}

ProjectCategory.init(
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
  },
  {
    sequelize: db,
    modelName: 'ProjectCategory',
    tableName: 'project_categories',
    timestamps: true,
  }
);

export default ProjectCategory;
