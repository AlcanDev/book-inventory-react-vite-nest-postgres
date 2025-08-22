'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('admin1234', 10);
    await queryInterface.bulkInsert('users', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        email: 'admin@cmpc.local',
        passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@cmpc.local' });
  },
};
