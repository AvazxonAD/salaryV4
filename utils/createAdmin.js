const db = require('../models/index')
const Master = db.master

async function createAdmin(){
    const admin = await Master.findOne({where: {adminStatus: true}})
    if(!admin){
        await Master.create({
            username : "Respublika",
            password : "123",
            passwordInfo : "123",
            adminStatus : true
        })
        return;
    }
    return;
}

module.exports = createAdmin