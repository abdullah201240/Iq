'use strict';

// Function to generate fake project images
const generateFakeProjectImages = (num) => {
  const projectImages = [];
  for (let i = 1; i <= num; i++) {
    projectImages.push({
      imageName: `${i}.webp`,  // imageName will follow the pattern 1.webp, 2.webp, etc.
      projectId: 4,  // Random projectId between 1 and 100 (adjust based on your projects)
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return projectImages;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakeData = generateFakeProjectImages(1374);  // Generate 1374 project images
    await queryInterface.bulkInsert('project_images', fakeData, {});  // Insert into the project_images table
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('project_images', {}, {});  // Delete all project images if you need to rollback
  }
};
