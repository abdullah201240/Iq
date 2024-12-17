import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize';
import MainServicesCategory from './mainServicesCategory';

// Define the attributes for the MainServicesSubCategory model
export interface MainServicesSubCategoryAttributes {
  id: number;
  name: string;
  categoryId: number; // Foreign key to link with MainServicesCategory
}

export interface MainServicesSubCategoryCreationAttributes
  extends Optional<MainServicesSubCategoryAttributes, 'id'> {}

class MainServicesSubCategory
  extends Model<MainServicesSubCategoryAttributes, MainServicesSubCategoryCreationAttributes>
  implements MainServicesSubCategoryAttributes
{
  public id!: number;
  public name!: string;
  public categoryId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate() {
    this.belongsTo(MainServicesCategory, { foreignKey: 'categoryId', as: 'category' });
  }
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
      references: {
        model: MainServicesCategory,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize: db,
    modelName: 'MainServicesSubCategory',
    tableName: 'main_services_sub_category',
    timestamps: true,
  }
);

export default MainServicesSubCategory;
