module.exports = (sequelize, Sequelize) => {
    const position = sequelize.define("position", {
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
        coefficient: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },        
        salary: {
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
    return position
}