'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jobs', {
      id: {
        type: Sequelize.DataTypes.INTEGER,  // Use Sequelize.DataTypes
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      deadline: {
        type: Sequelize.DataTypes.STRING,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      position: {
        type: Sequelize.DataTypes.STRING,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      location: {
        type: Sequelize.DataTypes.STRING,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      phone: {
        type: Sequelize.DataTypes.STRING,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      salary: {
        type: Sequelize.DataTypes.STRING,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      vacancies: {
        type: Sequelize.DataTypes.STRING,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      keyResponsibilities: {
        type: Sequelize.DataTypes.TEXT,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      skillsExperience: {
        type: Sequelize.DataTypes.TEXT,  // Use Sequelize.DataTypes
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,  // Use Sequelize.DataTypes
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,  // Use Sequelize.DataTypes
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('jobs');
  },
};
