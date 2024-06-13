const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db = require('../models/index')
const Position = db.position
const Minimum = db.minimum

// create position 
exports.createPosition = asyncHandler(async (req, res, next) => {
    const {positions} = req.body
    if(!positions || positions.length < 1){
        return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
    }
    const minimum = await Minimum.findOne()

    for(let position of positions){
        
        if(!position.name || !position.coefficient){
            return next(new ErrorResponse("Sorovlar bosh qolmasligi kerak", 403))
        }
        const test = await Position.findOne({where: {name : position.name, masterId : req.user.id}})
        
        if(test){
            return next(new ErrorResponse(`Siz bu lavozimni oldin kiritgansiz : ${test.name}`, 403))
        }
    }
    
    for(let position of positions){
        const now = new Date();
        // Hozirgi yil, oy va kunni olish
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Oylarda 0 dan boshlanganligi uchun 1 qo'shamiz
        const day = String(now.getDate()).padStart(2, '0');
        const createDate = `${year}-${month}-${day}`;

        await Position.create({
            name : position.name,
            coefficient : position.coefficient,
            salary : position.coefficient * minimum.summa,
            masterId : req.user.id,
            date : createDate,
        })
    }

    return res.status(200).json({success : true, data : "kiritildi"})
})

// get all position 
exports.getAllPosition = asyncHandler(async (req, res, next) => {
    
    const positions = await Position.findAll({
        where: {masterId: req.user.id},
        order: [["coefficient", "DESC"]]
    })
    
    return res.status(200).json({success : true, data : positions})
})

// delete position 
exports.deletePosition = asyncHandler(async (req, res, next) => {
    const position = await Position.findByPk(req.params.id)
    
    if(!position){
        return next(new ErrorResponse("Lavozim topilmadi", 500))
    }
    
    await position.destroy()

    return res.status(200).json({success : true, data : "Delete"})
})

// update position 
exports.updatePosition = asyncHandler(async (req, res, next) => {
    const minimum = await Minimum.findOne()
    const position = await  Position.findByPk(req.params.id)
    
    if(!position){
        return next(new ErrorResponse("server xatolik lavozim topilmadi", 500))
    }

    if(!req.body.name || !req.body.coefficient){
        return next(new ErrorResponse("Sorovlar bosh qolmasligi kerak", 403))
    }

    if(position.name !== req.body.name.trim()){
        const test = await Position.findOne({where: { name: req.body.name.trim(), masterId: req.user.id }})
        
        if(test){
            return next(new ErrorResponse(`Bu malumotdan oldin foydalanilgan: ${test.name}`))
        }
    }

    position.name = req.body.name
    position.coefficient = req.body.coefficient
    position.salary = req.body.coefficient * minimum.summa
    await position.save()

    return res.status(200).json({success : true, data : position})
})
