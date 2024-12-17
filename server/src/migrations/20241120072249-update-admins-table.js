'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename 'firstName' and 'lastName' columns to 'name'
    await queryInterface.renameColumn('Admins', 'firstName', 'name');
    await queryInterface.removeColumn('Admins', 'lastName'); // Remove lastName as it's now part of the 'name'

    // Ensure other columns are updated or kept as needed
    // If you want to update or modify other columns, you can do so here.

    // Example: Ensuring 'dob' and 'gender' columns are present
    await queryInterface.changeColumn('Admins', 'dob', {
      type: Sequelize.STRING,
      allowNull: true,  // You can change this to false if dob is required
    });

    await queryInterface.changeColumn('Admins', 'gender', {
      type: Sequelize.STRING,
      allowNull: true,  // You can change this to false if gender is required
    });

    // Add other columns like role if necessary, though role already exists.
  },

  async down(queryInterface, Sequelize) {
    // Revert the column renaming in case of a rollback
    await queryInterface.renameColumn('Admins', 'name', 'firstName');
    await queryInterface.addColumn('Admins', 'lastName', {
      type: Sequelize.STRING,
    });

    // Revert changes to other columns if needed
    await queryInterface.changeColumn('Admins', 'dob', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Admins', 'gender', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
