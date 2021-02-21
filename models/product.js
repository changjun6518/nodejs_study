module.exports = (sequelize, DataTypes) => {
    return sequelize.define('product', {
      pro_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      pro_post: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      author_name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('now()'),
      },
    }, {
      timestamps: false,
    });
  };