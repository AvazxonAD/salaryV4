module.exports = (sequelize, Sequelize) => {
    const minimum  = sequelize.define("minimum", {
        summa: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
        { timestamps: true }
    )
    return minimum
}