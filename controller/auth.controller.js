const asyncHandler = require('../middleware/async.js')
const ErrorResponse = require('../utils/errorResponse.js')
const db = require('../models/index.js')
const Master = db.master
const Folder = db.folder

// for login page 
exports.getLogin = asyncHandler(async (req, res, next) => {
    const usernames = await Master.findAll({
        attributes: ["username"],
        order: [["createdAt", "ASC"]]
    })
    
    return res.status(200).json({success : true, data : usernames})
})


//create worker  
exports.createWorker = asyncHandler(async (req, res, next) => {
    if(!req.user.admin){
        return next(new ErrorResponse('Siz uchun bu funksiya ruhsat berilmagan '))
    }

    const {username, password} = req.body
    if(!username || !password){
        return next(new ErrorResponse('Sorovlar bosh qolishi mumkin emas', 403))
    }
    const test = await Master.findOne({where: {username: username.trim()}})
    if(test){
        return next(new ErrorResponse(`Bu nomga ega ishchi  bor iltimos boshqa nomdan foydalaning : ${test.username}`,403 ))
    }
    //if(password.length < 6){
    //    return next(new ErrorResponse('Password belgilari 6 tadan kam bolmasligi kerak'))
    //}
    const newUser = await Master.create({username, password, passwordInfo : password})


    return res.status(200).json({success : true, data : newUser})
})

// login 
exports.login = asyncHandler(async (req, res, next) => {
    const {username, password} = req.body
    
    if(!username || !password){
        return next(new ErrorResponse("Sorovlar bosh qolmasligi kerak", 403))
    }

    const user = await Master.findOne({where: {username : username.trim()}})
    
    if(!user){
        return next(new ErrorResponse('Username yoki password hato kiritildi', 403))
    }

    const match = await user.matchPassword(password)
    if(!match){
        return next(new ErrorResponse('Username yoki password hato kiritildi', 403))
    }

    const token = user.jwtToken()
    return res.status(200).json({success : true, data : user, token})
})

// get user open 
exports.userOpen = asyncHandler(async (req, res, next) => {
    const user = await Master.findOne({
        where: {id: req.user.id},
        attributes: ["username", "passwordInfo", "adminStatus"]
    })
    if(!user){
        return next(new ErrorResponse("Server xatolik", 403))
    }

    if(user.adminStatus){
        const users = await Master.findAll({
            where: {adminStatus: false},
            attributes: ["username", "passwordInfo"],
            order: [["createdAt", "ASC"]]
        })

        return res.status(200).json({success : true, admin : user, users})
    }

    return res.status(200).json({success : true, data : user})
}) 

// // update password 
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await Master.findOne({where: {id: req.user.id}} )
    
    if(!user){
        return next(new ErrorResponse("server xatolik", 500))
    }

    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
    }

    const match = await user.matchPassword(oldPassword)
    
    if(!match){
        return next(new ErrorResponse('Password xato kiritildi', 403))
    }
    // if(newPassword.length < 6 ){
    //     return next(new ErrorResponse('Yangi password belgilar soni 6 tadan kam bolmasligi kerak',403))
    // }
    
    user.passwordInfo = newPassword
    user.password = newPassword
    await user.save()
    return res.status(200).json({success : true, data : user})
})
