'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('abouts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      homeTitle: {
        type: Sequelize.STRING(55), // Max length based on schema
        allowNull: false,
      },
      homeDescription: {
        type: Sequelize.STRING(600), // Max length based on schema
        allowNull: false,
      },
      homeImage: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true, // Validate URL
        },
      },
      homeVideo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true, // Validate URL
        },
      },
      title: {
        type: Sequelize.STRING(100), // Max length based on schema
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(800), // Max length based on schema
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true, // Validate URL
        },
      },
      video: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true, // Validate URL
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('abouts');
  },
};
