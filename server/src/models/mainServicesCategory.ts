import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize';
import MainServicesSubCategory from './mainServicesSubCategory';

// Define the attributes for the MainServicesCategory model
export interface MainServicesCategoryAttributes {
  id: number;
  name: string;
}

export interface MainServicesCategoryCreationAttributes
  extends Optional<MainServicesCategoryAttributes, 'id'> {}

class MainServicesCategory
  extends Model<MainServicesCategoryAttributes, MainServicesCategoryCreationAttributes>
  implements MainServicesCategoryAttributes
{
  public id!: number;
  public name!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


  public readonly category?: MainServicesSubCategory;

 
}

MainServicesCategory.init(
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
    modelName: 'MainServicesCategory',
    tableName: 'main_services_category',
    timestamps: true,
  }
);
export default MainServicesCategory;
