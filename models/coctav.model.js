module.exports = (sequelize, Sequelize) => {
    const coctav = sequelize.define("coctavs", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        { timestamps: true }
    )
    return coctav
}