import  MainServicesCategory  from './mainServicesCategory';
import MainServicesSubCategory  from './mainServicesSubCategory';

// Define associations
MainServicesCategory.hasMany(MainServicesSubCategory, {
  as: 'subCategories',
  foreignKey: 'categoryId',
});

MainServicesSubCategory.belongsTo(MainServicesCategory, {
  as: 'category',
  foreignKey: 'categoryId',
});
export { MainServicesCategory };
export { MainServicesSubCategory };