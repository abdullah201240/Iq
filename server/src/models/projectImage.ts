import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize';  // Sequelize instance
import Projects from './project';  // Import Projects model

// Define the attributes for the ProjectImage model
interface ProjectImageAttributes {
  id: number;
  imageName: string;
  projectId: number; // Foreign key reference to Projects
}

interface ProjectImageCreationAttributes extends Optional<ProjectImageAttributes, 'id'> {}

class ProjectImage extends Model<ProjectImageAttributes, ProjectImageCreationAttributes> implements ProjectImageAttributes {
  public id!: number;
  public imageName!: string;
  public projectId!: number;

  public readonly project?: Projects; // Association with Project
}

ProjectImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    imageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'ProjectImage',
    tableName: 'project_images',
    timestamps: true,
  }
);

// ProjectImage.belongsTo(Projects, { foreignKey: 'projectId' });



export default ProjectImage;
