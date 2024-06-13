const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db = require('../models/index')
const Rank = db.rank

// create new rank 
exports.createRank = asyncHandler(async (req, res, next) => {
    const {ranks} = req.body
    if(!ranks || ranks.length === 0){
        return next(new ErrorResponse("Sorovlar bosh qolmasligi kerak", 403))
    }

    for(let rank of ranks){
        if(!rank.name || rank.summa == null){
            return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
        }
        console.log(rank)
        const test = await Rank.findOne({ where: { name: rank.name.trim(), masterId: req.user.id }})
        if(test){
            return next(new ErrorResponse(`Bu unvonni oldin kiritgansiz : ${test.name}`,403))
        }
    }
    for(let rank of ranks){

        const now = new Date();
        // Hozirgi yil, oy va kunni olish
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Oylarda 0 dan boshlanganligi uchun 1 qo'shamiz
        const day = String(now.getDate()).padStart(2, '0');
        const createDate = `${year}-${month}-${day}`;

        await Rank.create({
            name : rank.name, 
            summa : rank.summa, 
            masterId : req.user.id, 
            date : createDate
        })

    }
    return res.status(200).json({success : true, data : "Kiritildi"})
})

// get all rank 
exports.getAllRank =asyncHandler(async (req, res, next) => {
    const ranks = await Rank.findAll({
        where: {masterId: req.user.id},
        order: [
            [ "name", "ASC" ]
        ]
    })

    return res.status(200).json({success : true, data : ranks})
})

// update rank 
exports.updateRank = asyncHandler(async (req, res, next) => {
    const rank = await Rank.findOne({where: {id: req.params.id}})

    if(!rank){
        return next(new ErrorResponse("server xatolik unvon topilmadi", 500))
    }
    
    if(!req.body.name || req.body.summa === undefined){
        return next(new ErrorResponse("sorovlar bosh qolmasligi kerak", 403))
    }
    if(req.body.name.tim() !== rank.name){
        const test = await Rank.findOne({where: {name: req.body.name.trim(), masterId: req.user.id}})
        if(test){
            return next(new ErrorResponse(`bu malumotdan oldin foydalanilgan: ${test.name}`))
        }
    }
    rank.name = req.body.name
    rank.summa = req.body.summa
    await rank.save()

    return res.status(200).json({success : true, data : rank})
})

// delete ranks
exports.deleteRank = asyncHandler(async (req, res, next) => {
    const rank = await Rank.findOne({where: {id: req.params.id}})

    if(!rank){
        return next(new ErrorResponse("unvon topilmadi server xatolik", 500))
    }

    await rank.destroy()

    return res.status(200).json({success : true, data : "Delete"})
})
