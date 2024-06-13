const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db = require('../models/index')
const { where } = require('sequelize')
const Tip = db.tip

// create tip
exports.createTip = asyncHandler(async (req, res, next) => {
    const { tips } = req.body
    if (!tips || tips.length < 1) {
        return next(new ErrorResponse('Sorovlar bosh qolishi mumkin emas', 403))
    }
    for (let tip of tips) {
        if (!tip.name) {
            return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
        }
        const test = await Tip.findOne({ where: { name: tip.name.trim(), masterId: req.user.id } })
        if (test) {
            return next(new ErrorResponse(`Bu tip avval kiritilgan: ${test.name}`, 403))
        }
    }

    for (let tip of tips) {
        const now = new Date();
        // Hozirgi yil, oy va kunni olish
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Oylarda 0 dan boshlanganligi uchun 1 qo'shamiz
        const day = String(now.getDate()).padStart(2, '0');
        const createDate = `${year}-${month}-${day}`;

        await Tip.create({
            name: tip.name,
            masterId: req.user.id,
            date: createDate
        })
    }
    return res.status(200).json({ success: true, data: "kiritildi" })
})

//get all tip
exports.getAllTip = asyncHandler(async (req, res, next) => {
    console.log(req.user.id)
    const tips = await Tip.findAll({
        where: { masterId: req.user.id },
        order: [["name", "ASC"]]
    })

    return res.status(200).json({ success: true, data: tips })
})

// update tip 
exports.updateTip = asyncHandler(async (req, res, next) => {
    const tip = await Tip.findOne({where: {id: req.params.id}})

    if(!tip){
        return next(new ErrorResponse("tip topilmadi server xatolik", 500))
    }

    if (!req.body.name) {
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }

    if (tip.name !== req.body.name.trim()) {
        const test = await Tip.findOne({where: { name: req.body.name.trim(), masterId: req.user.id }})
        if (test) {
            return next(new ErrorResponse(`bunday nomli tip turi kiritilgan: ${test.name}`, 403))
        }
    }
    
    tip.name = req.body.name.trim()
    await tip.save()

    return res.status(200).json({ success: true, data: tip })
})

// delete tips 
exports.deleteTip = asyncHandler(async (req, res, next) => {
    const tip = await Tip.findOne({where: { id: req.params.id }})
    
    if (!tip) {
        return next(new ErrorResponse("tip topilmadi server xatolik", 500))
    }

    await tip.destroy()

    return res.status(200).json({ success: true, data: "Delete" })
})
