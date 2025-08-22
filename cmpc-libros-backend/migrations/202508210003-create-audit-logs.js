'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      userId: { type: Sequelize.UUID },
      entity: { type: Sequelize.STRING, allowNull: false },
      action: { type: Sequelize.STRING, allowNull: false },
      entityId: { type: Sequelize.UUID },
      meta: { type: Sequelize.JSONB },
      ip: { type: Sequelize.STRING },
      userAgent: { type: Sequelize.STRING },
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
    });
    await queryInterface.addIndex('audit_logs', ['entity', 'action']);
    await queryInterface.addIndex('audit_logs', ['userId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};
