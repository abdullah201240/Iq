'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the 'image' column from the 'admin' table
    await queryInterface.removeColumn('Admins', 'image');
  },

  async down(queryInterface, Sequelize) {
    // Add the 'image' column back to the 'admin' table (optional, for rollback)
    await queryInterface.addColumn('Admins', 'image', {
      type: Sequelize.STRING, // Use the appropriate type for the column
      allowNull: true, // Or false, depending on your requirements
    });
  },
};

