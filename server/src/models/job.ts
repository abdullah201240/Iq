import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize'; // Adjust path as needed

// Define the attributes for the Job model
export interface JobAttributes {
    id: number;
    deadline: string;
    position: string;
    location: string;
    experience: string;
    description: string;
    salary: string;
    vacancies: string;
    keyResponsibilities: string;
    skillsExperience: string;
}

// Specify which attributes are optional for model creation
export interface JobCreationAttributes extends Optional<JobAttributes, 'id'> { }

// Define the Job model class
class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
    public id!: number;
    public deadline!: string;
    public position!: string;
    public location!: string;
    public experience!: string;
    public description!: string;
    public salary!: string;
    public vacancies!: string;
    public keyResponsibilities!: string;
    public skillsExperience!: string;

    // Add any instance-level methods here if needed
}

// Initialize the Job model
Job.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        deadline: {
            type: DataTypes.STRING, // Matches the deadline field in the interface
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING, // Matches the position field in the interface
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING, // Matches the location field in the interface
            allowNull: false,
        },
        experience: {
            type: DataTypes.STRING, // Matches the phone field in the interface
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT, // Matches the description field in the interface
            allowNull: false,
        },
        salary: {
            type: DataTypes.STRING, // Matches the salary field in the interface
            allowNull: false,
        },
        vacancies: {
            type: DataTypes.STRING, // Matches the vacancies field in the interface
            allowNull: false,
        },
        keyResponsibilities: {
            type: DataTypes.TEXT, // Matches the keyResponsibilities field in the interface
            allowNull: false,
        },
        skillsExperience: {
            type: DataTypes.TEXT, // Matches the skillsExperience field in the interface
            allowNull: false,
        },
    },
    {
        sequelize: db, // Use the passed `sequelizeInstance`
        modelName: 'Job',
        tableName: 'jobs', // Specify table name (changed to 'jobs' for consistency)
        timestamps: true, // Enable `createdAt` and `updatedAt`
    }
);

export default Job;
