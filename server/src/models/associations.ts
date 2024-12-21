import  MainServicesCategory  from './mainServicesCategory';
import MainServicesSubCategory  from './mainServicesSubCategory';
import Projects from './project';
import ProjectCategory from './projectCategory';
import ProjectImage from './projectImage';

// Define associations
MainServicesCategory.hasMany(MainServicesSubCategory, {
  as: 'subCategories',
  foreignKey: 'categoryId',
});

MainServicesSubCategory.belongsTo(MainServicesCategory, {
  as: 'category',
  foreignKey: 'categoryId',
});
Projects.belongsTo(ProjectCategory, { as: 'category', foreignKey: 'categoryId' });
Projects.hasMany(ProjectImage, { as: 'project', foreignKey: 'projectId' });
ProjectCategory.hasMany(Projects, { as: 'projects', foreignKey: 'categoryId' });
ProjectImage.belongsTo(Projects, { as: 'project', foreignKey: 'projectId' });



export { MainServicesCategory };
export { MainServicesSubCategory };
export { ProjectCategory };
export { Projects };
export { ProjectImage };