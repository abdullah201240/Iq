import { Admin } from './admin'; // Adjust paths if necessary
import {About} from './about'
export { Admin,About };

import Projects from './project';
import ProjectImage from './projectImage';
import ProjectCategory from './projectCategory'; // Import ProjectCategory model if needed

// Define associations after all models are initialized
Projects.hasMany(ProjectImage, {
  foreignKey: 'projectId',
  as: 'images',
});

ProjectImage.belongsTo(Projects, {
  foreignKey: 'projectId',
  as: 'project',
});
