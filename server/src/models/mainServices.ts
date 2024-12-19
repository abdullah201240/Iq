import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize';
import MainServicesCategory from './mainServicesCategory';
import MainServicesSubCategory from './mainServicesSubCategory';

// Define attributes for MainServices model
export interface MainServicesAttributes {
  id: number;
  subTitle: string;
  logo: string;
  videoLink: string;
  description: string;
  categoryId: number;
  subCategoryId: number;
  categoryName?: string; // Virtual field for category name
  subCategoryName?: string; // Virtual field for subcategory name
  backgroundImage?: string; // New field for background image

}

// Specify optional attributes
export interface MainServicesCreationAttributes extends Optional<MainServicesAttributes, 'id' | 'categoryName' | 'subCategoryName'> {}

// Define MainServices model
class MainServices extends Model<MainServicesAttributes, MainServicesCreationAttributes> implements MainServicesAttributes {
  public id!: number;
  public subTitle!: string;
  public logo!: string;
  public videoLink!: string;
  public description!: string;
  public categoryId!: number;
  public subCategoryId!: number;

  // Virtual fields
  public categoryName?: string;
  public subCategoryName?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize MainServices model
MainServices.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    subCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MainServicesSubCategory,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    backgroundImage: {
      type: DataTypes.STRING, // Assuming it's a URL or file path
      allowNull: true, // Make this field optional
    },
  },
  {
    sequelize: db,
    modelName: 'MainServices',
    tableName: 'main_services',
    timestamps: true,
  }
);

// Define relationships
MainServices.belongsTo(MainServicesCategory, {
  foreignKey: 'categoryId',
  as: 'category',
});

MainServices.belongsTo(MainServicesSubCategory, {
  foreignKey: 'subCategoryId',
  as: 'subCategory',
});

export default MainServices;
