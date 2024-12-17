import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/sequelize'; // Sequelize instance

// Define the interface for the attributes
interface BlogAttributes {
    id: number
    title:string
    image: string; 
    description: string
}

// Define the optional attributes for creation
interface BlogCreationAttributes extends Optional<BlogAttributes, 'id'> { }

// Define the Sequelize model class
class Blog
    extends Model<BlogAttributes, BlogCreationAttributes>
    implements BlogAttributes {
    public id!: number;
    public image!: string;
    public title!: string;
    public description!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the model
Blog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db, // Pass the Sequelize instance
        modelName: 'Blog',
        tableName: 'blog',
        timestamps: true, // Enables createdAt and updatedAt
    }
);

export default Blog;
