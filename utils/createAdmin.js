const db = require('../models/index')
const Master = db.master

async function createAdmin(){

    const masters = await Master.findAll()
    check = masters.find(item => {item.adminStatus === true})
    console.log(check)

    if(!check){
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