module.exports = (sequelize, Sequelize) => {
    const file = sequelize.define("files", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        selectPosition: {
            type: Sequelize.STRING,
            allowNull: false
        },
        selectSalary: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        selectcoefficient: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        selectCoctav: {
            type: Sequelize.STRING,
            allowNull: false
        },
        selectTip: {
            type: Sequelize.STRING,
            allowNull: false
        },
        selectRegion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        selectStavka: {
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
    return file
}