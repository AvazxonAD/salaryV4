const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db = require('../models/index') 
const Location = db.location

// create location
exports.createLocation = asyncHandler(async (req, res, next) => {
    const {locations} = req.body
 
    if(!locations || locations.length < 1){
        return next(new ErrorResponse('Sorovlar bosh qolishi mumkin emas', 403))
    }
    for(let location of locations){
        if(!location.name){
            return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
        }
        const test = await Location.findOne({where: {name : location.name.trim(), masterId : req.user.id}})
        if(test){
            return next(new ErrorResponse(`Bu malumot avval kiritilgan: ${test.name}`, 403))
        }
    }

    for(let location of locations){
        const now = new Date();
        // Hozirgi yil, oy va kunni olish
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Oylarda 0 dan boshlanganligi uchun 1 qo'shamiz
        const day = String(now.getDate()).padStart(2, '0');
        const createDate = `${year}-${month}-${day}`;

        await Location.create({
            name : location.name,
            masterId : req.user.id,
            date : createDate
        })

    }
    return res.status(200).json({success : true, data : "Kiritildi"})
})

//get all location 
exports.getAllLocation = asyncHandler(async (req, res, next) => {
    const locations = await Location.findAll({
        where: {masterId : req.user.id},
        order: [["name", "ASC"]]
    })

    return res.status(200).json({success : true, data : locations})
})

// update location 
exports.updateLocation = asyncHandler(async (req, res, next) => {
    const location = await Location.findOne({where: {id: req.params.id}})
    
    if(!location){
        return next(new ErrorResponse("server xatolik rayon topilmadi", 403))
    }  

    if(!req.body.name){
        return next(new ErrorResponse("sorovlar bosh qolmasligi", 403))
    }
    
    if(location.name !== req.body.name.trim()){
        const test = await Location.findOne({where: {name: req.body.name.trim(), masterId: req.user.id}})

        if(test){
            return next(new ErrorResponse(`bu malumotdan oldin foydalanilgan: ${test.name}`))
        } 
    }
    
    location.name = req.body.name
    await location.save()

    return res.status(200).json({success : true, data : location})
})

// delete locations 
exports.deleteLocation = asyncHandler(async (req, res, next) => {
    const location = await Location.findOne({where: {id: req.params.id}})
    if(!location){
        return next(new ErrorResponse("rayon topilmadi server xatolik", 500))
    }

    await location.destroy()
   
    return res.status(200).json({success : true, data : "Delete"})
})

