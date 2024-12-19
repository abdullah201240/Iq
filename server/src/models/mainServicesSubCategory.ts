import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Ensure this is your Sequelize instance
import MainServicesCategory from './mainServicesCategory';

// Define the attributes for the model
interface MainServicesSubCategoryAttributes {
  id: number;
  name: string;
  categoryId: number; // Foreign key
}

interface MainServicesSubCategoryCreationAttributes
  extends Optional<MainServicesSubCategoryAttributes, 'id'> {}

class MainServicesSubCategory
  extends Model<MainServicesSubCategoryAttributes, MainServicesSubCategoryCreationAttributes>
  implements MainServicesSubCategoryAttributes
{
  public id!: number;
  public name!: string;
  public categoryId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
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
    sequelize: db, // Ensure `db` is correctly initialized
    modelName: 'MainServicesSubCategory',
    tableName: 'main_services_sub_category',
    timestamps: true,
  }
);


export default MainServicesSubCategory;
