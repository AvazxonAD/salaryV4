module.exports = (sequelize, Sequelize) => {
    const rank = sequelize.define("rank", {
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
        summa: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        date: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        { timestamps: true }
    )
    return rank
}