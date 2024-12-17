'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the "phone" column
    await queryInterface.removeColumn('jobs', 'phone');

    // Add the "experience" column
    await queryInterface.addColumn('jobs', 'experience', {
      type: Sequelize.STRING, // Adjust the type based on your requirements
      allowNull: false, // Set to true if it's optional
      defaultValue: '', // Add a default value if necessary
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the "experience" column
    await queryInterface.removeColumn('jobs', 'experience');

    // Re-add the "phone" column
    await queryInterface.addColumn('jobs', 'phone', {
      type: Sequelize.STRING,
      allowNull: false, // Adjust this based on your original schema
    });
  },
};
