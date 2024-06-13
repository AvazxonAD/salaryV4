const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Model yaratish
module.exports = (sequelize, Sequelize) => {
    const Master = sequelize.define("master", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("username", value.trim());
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("password", value.trim());
            }
        },
        adminStatus: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        passwordInfo: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    { 
        timestamps: true,
        hooks: {
            beforeSave: async (master) => {
                if (master.changed("password")) {
                    const saltRounds = 10;
                    master.password = await bcrypt.hash(master.password, saltRounds);
                }
            }
        }
    });

    // Parolni solishtirish funksiyasini qo'shish
    Master.prototype.matchPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    // JWT belgisini olish funksiyasini qo'shish
    Master.prototype.jwtToken = function() {
        return jwt.sign(
            { username: this.username, id: this.id, admin: this.adminStatus },
            process.env.JWT_TOKEN_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );
    };

    return Master;
};
