const Sequelize = require('sequelize')

const sequelize = new Sequelize("salary", "postgres", "avazbek+1201", {
    host: "localhost", 
    port: 5432,
    dialect: "postgres"
})

db = {}

db.sequelize = sequelize 
db.Sequelize = Sequelize

db.master = require('./master.model')(sequelize, Sequelize)
db.coctav = require('./coctav.model')(sequelize, Sequelize)
db.file = require('./file.model')(sequelize, Sequelize)
db.folder = require('./folder.model')(sequelize, Sequelize)
db.location = require('./location.model')(sequelize, Sequelize)
db.position = require('./position.model')(sequelize, Sequelize)
db.rank = require('./rank.model')(sequelize, Sequelize)
db.tip = require('./tip.model')(sequelize, Sequelize)
db.minimum = require('./minimum')(sequelize, Sequelize)

// coctavlarni boglash 
db.master.hasMany(db.coctav, {
    as: "coctavs",
    onDelete: "CASCADE",
    constraints: true
});

db.coctav.belongsTo(db.master, {
    foreignKey: "masterId",
    as: "master"
});

// file bog'lanish 

db.folder.hasMany(db.file, {
    as: "files",
    onDelete: "CASCADE",
    constraints: true
});

db.file.belongsTo(db.folder, {
    foreignKey: "folderId",
    as: "folder"
});

// folderni masterga bog'lash
db.master.hasMany(db.folder, {
    as: "folders",
    onDelete: "CASCADE",
    constraints: true
});

db.folder.belongsTo(db.master, {
    foreignKey: "masterId",
    as: "master"
});

// folderni boshqa folderga bog'lash
db.folder.hasMany(db.folder, {
    as: "folders",
    onDelete: "CASCADE",
    constraints: true
});

db.folder.belongsTo(db.folder, {
    foreignKey: "folderId",
    as: "folder"
});

// location bog'lanish 
db.master.hasMany(db.location, {
    as: "locations",
    onDelete: "CASCADE",
    constraints: true
});

db.location.belongsTo(db.master, {
    foreignKey: "masterId",
    as: "master"
});

// position boglanish 
db.master.hasMany(db.position, {
    as: "positions",
    onDelete: "CASCADE",
    constraints: true
});

db.position.belongsTo(db.master, {
    foreignKey: "masterId",
    as: "master"
});

// rank boglanish 
db.master.hasMany(db.rank, {
    as: "ranks",
    onDelete: "CASCADE",
    constraints: true
});

db.rank.belongsTo(db.master, {
    foreignKey: "masterId",
    as: "master"
});

// tip bog'lanish 
db.master.hasMany(db.tip, {
    as: "tips",
    onDelete: "CASCADE",
    constraints: true
});

db.tip.belongsTo(db.master, {
    foreignKey: "masterId",
    as: "master"
});

module.exports = db
