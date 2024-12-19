'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('main_services', 'image');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('main_services', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
