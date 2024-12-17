'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('apply_list', 'jobId', {
      type: Sequelize.STRING,
      allowNull: false, // Change this based on whether the field is optional or required
      after: 'choosePosition', // Ensures the column is added after `choosePosition`
    });

    await queryInterface.addColumn('apply_list', 'status', {
      type: Sequelize.STRING,
      allowNull: false, // Change this based on whether the field is optional or required
      defaultValue: 'Submitted', // Set a default value if needed
      after: 'jobId', // Ensures the column is added after `jobId`
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('apply_list', 'jobId');
    await queryInterface.removeColumn('apply_list', 'status');
  },
};
