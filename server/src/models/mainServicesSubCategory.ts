import { DataTypes, Model } from 'sequelize';
import db from '../config/sequelize';
import MainServicesCategory from './mainServicesCategory';

class MainServicesSubCategory extends Model {
  public id!: number;
  public name!: string;
  public categoryId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MainServicesSubCategory.init(
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'MainServicesSubCategory',
    tableName: 'main_services_sub_category',
    timestamps: true,
  }
);
MainServicesSubCategory.belongsTo(MainServicesCategory, { foreignKey: 'categoryId', as: 'category' });

export default MainServicesSubCategory;
