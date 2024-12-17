'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Reposition the "experience" column to be after "location"
    await queryInterface.sequelize.query(`
      ALTER TABLE jobs MODIFY COLUMN experience VARCHAR(255) NOT NULL AFTER location;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally revert the column position (defaulting to adding it at the end)
    // Sequelize doesn't track column position, so this is primarily for documentation
  },
};
