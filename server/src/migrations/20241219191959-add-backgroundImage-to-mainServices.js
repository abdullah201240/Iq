module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('main_services', 'backgroundImage', {
      type: Sequelize.STRING,
      allowNull: true, // Optional field
      after: 'logo', // This places the backgroundImage column right after the 'logo' column
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('main_services', 'backgroundImage');
  },
};
