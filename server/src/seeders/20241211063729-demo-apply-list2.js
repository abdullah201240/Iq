'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create an array to hold the 1000 records
    const fakeData = [];
    const numRecords = 1000;
    const startId = 2001;

    // List of specific emails to assign
    const specificEmails = [
      'abdullahalsakib7075@gmail.com',
      'sakibdob@gmail.com',
      'nhoda201224@gmail.com',
      'bariulislam000@gmail.com',
      'murtuja.munuar00@gmail.com',
      'shoshekhan222@gmail.com',
      'akhiakter56991@gmail.com',
    ];

    // Loop to generate 1000 records and assign the specific emails
    for (let i = startId; i < startId + numRecords; i++) {
      fakeData.push({
        name: `Name ${i}`,
        email: specificEmails[(i - startId) % specificEmails.length], // Cycle through the specific emails
        phone: `123-456-789${i}`,
        address: `Address ${i}`,
        education: `Education ${i}`,
        experience: `Experience ${i}`,
        salary: `${i * 1000}`,
        choosePosition: `Position ${i}`,
        portfolio: `Portfolio ${i}`,
        resume: `Resume ${i}`,
        jobId: `3`,
        status: 'ShortListed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Use bulkInsert to insert the data
    return queryInterface.bulkInsert('apply_list', fakeData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Delete all records from the 'apply_list' table
    return queryInterface.bulkDelete('apply_list', null, {});
  },
};
