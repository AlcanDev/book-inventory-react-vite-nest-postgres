'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      title: { type: Sequelize.STRING, allowNull: false },
      author: { type: Sequelize.STRING, allowNull: false },
      publisher: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      genre: { type: Sequelize.STRING, allowNull: false },
      imageUrl: { type: Sequelize.STRING },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      deletedAt: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('books', ['title']);
    await queryInterface.addIndex('books', ['author']);
    await queryInterface.addIndex('books', ['publisher']);
    await queryInterface.addIndex('books', ['genre']);
    await queryInterface.addIndex('books', ['available']);
    await queryInterface.addIndex('books', ['price']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('books');
  },
};
