module.exports = (sequelize, Sequelize) => {
    const folder = sequelize.define("folders", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("name", value.trim())
            }
        },
        date: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        parentMaster: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
        { timestamps: true }
    )
    return folder
}