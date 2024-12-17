import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Services model
export interface ContactAttributes {
  id: number;
  name: string;
  email: string;
  subject: string;
  phone: string;
  description: string;
}

// Specify which attributes are optional for model creation
export interface ContactCreationAttributes extends Optional<ContactAttributes, 'id'> {}

// Define the Services model class
class Contacts extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public subject!: string;
  public description!: string;

}

// Initialize the Services model
const ContactsModel = (sequelizeInstance: Sequelize): typeof Contacts => {
    Contacts.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING, // Matches the title field in the interface
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING, // Matches the subTitle field in the interface
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING, // Matches the logo field in the interface
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING, // Matches the image field in the interface
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT, // Matches the description field in the interface
        allowNull: false,
      },
    },
    {
      sequelize: db, // Use the passed `sequelizeInstance`
      modelName: 'Contacts',
      tableName: 'contacts', // Specify table name
      timestamps: true, // Enable `createdAt` and `updatedAt`
    }
  );

  return Contacts;
};

export default ContactsModel;
