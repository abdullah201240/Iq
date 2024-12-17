import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize'; // Sequelize instance

// Define the interface for the attributes
interface ClientAttributes {
    id:number
  image: string; // Fixed naming convention
}

// Define the optional attributes for creation
interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'> {}

// Define the Sequelize model class
class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
  public id!: number;
  public image!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db, // Pass the Sequelize instance
    modelName: 'Client',
    tableName: 'client',
    timestamps: true, // Enables createdAt and updatedAt
  }
);

export default Client;
