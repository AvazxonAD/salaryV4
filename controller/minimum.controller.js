const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db = require('../models/index')
const Minimum = db.minimum
const Position = db.position
const File = db.file

// get minimum 
exports.getMinimum = asyncHandler(async (req, res, next) => {
    const minimum = await Minimum.findOne({ attributes : ["summa"]})
    
    if(!minimum){
        return next(new ErrorResponse('server xatolik eng kam ish haqi topilmadi', 500))
    }

    return res.status(200).json({success : true, data : minimum})
})

// update minimum 
exports.updateMinimum = asyncHandler(async (req, res, next) => {
    const {summa} = req.body
    if(!summa){
        return next(new ErrorResponse("Sorov bosh qoldirilishi mumkin emas", 403))
    }

    if(!req.user.admin){
        return next(new ErrorResponse("Sizga bu funksiya bajarish ruhsat etilmagan", 403))
    }
    
    const minimum = await Minimum.findOne()
    
    minimum.summa = summa
    await minimum.save()
    
    const positions = await Position.findAll()
    
    for(let position of positions){
        position.salary = position.coefficient * minimum.summa
        await position.save()
    }

    const files = await File.findAll()
    
    for(let file of files){
        file.selectSalary = file.selectcoefficient * minimum.summa 
        await file.save()
    }

    return res.status(200).json({success : true, data : minimum})
})