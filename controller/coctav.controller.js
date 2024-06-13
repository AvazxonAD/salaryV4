const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db  = require('../models/index')
const Coctav = db.coctav

// create coctav
exports.createCoctav = asyncHandler(async (req, res, next) => {
    const { coctavs } = req.body
    if(!coctavs || coctavs.length < 1){
        return next(new ErrorResponse('Sorovlar bosh qolishi mumkin emas', 403))
    }

    for(let coctav of coctavs){
        if(!coctav.name){
            return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
        }
        const test = await Coctav.findOne({where: {name : coctav.name.trim(), masterId : req.user.id }})

        if(test){
            return next(new ErrorResponse('Bu joylashuvda ushbu faoliyat avval kiritilgan', 403))
        }
    }

    for(let coctav of coctavs){
        const now = new Date();
        // Hozirgi yil, oy va kunni olish
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Oylarda 0 dan boshlanganligi uchun 1 qo'shamiz
        const day = String(now.getDate()).padStart(2, '0');
        const createDate = `${year}-${month}-${day}`;

        await Coctav.create({
            name : coctav.name,
            masterId : req.user.id,
            date : createDate
        })
    }
    return res.status(200).json({success : true, data : "kiritildi"})
})

//get all coctav
exports.getAllCoctav = asyncHandler(async (req, res, next) => {
    const coctavs = await Coctav.findAll({
        where: {masterId: req.user.id},
        order: [['name', "ASC"]]
    })

    return res.status(200).json({success : true, data : coctavs})
})

// delete coctavs 
exports.deleteCoctav = asyncHandler(async (req, res, next) => {
    const coctav = await Coctav.findOne({where: {id: req.params.id}})

    if(!coctav){
        return next(new ErrorResponse("Joylashuv topilmadi", 403))
    }

    await coctav.destroy()
    
    return res.status(200).json({success : true, data : "Delete"})
})

// update coctav 
exports.updateCoctav = asyncHandler(async (req, res, next) => {
    const coctav = await Coctav.findOne({where: {id: req.params.id}})
    
    if(!coctav){
        return next(new ErrorResponse("coctav topilmadi server xatolik", 500))
    }

    if(!req.body.name){
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }

    if(coctav.name !== req.body.name){
        const test = await Coctav.findOne({where: {name: req.body.name, masterId: req.user.id}})
        if(test){
            return next(new ErrorResponse(`bunday nomli coctav turi kiritilgan: ${test.name}`, 403))
        }
    }

    coctav.name = req.body.name
    await coctav.save()
    
    return res.status(200).json({ success : true, data: coctav })
})