    const { DataTypes } = require('sequelize');

    module.exports = (sequelize) => {
        const Users = sequelize.define('users', {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_name: {
                type: DataTypes.STRING,
            },
            user_email: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
            },
        }, {
            tableName: 'users',
            timestamps: false,
        });

        return Users;
    };
