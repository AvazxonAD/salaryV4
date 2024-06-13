const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db = require('../models/index')
const Folder = db.folder
const File = db.file
const Minimum = db.minimum
const Position = db.position
const Location = db.location
const Tip = db.tip
const Coctav = db.coctav

const pathUrl = require('../utils/path')

// create new file
exports.createFile = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findByPk(req.params.id)
    
    if(!folder){
        return next(new ErrorResponse('bolim topilmadi server xatolik', 404))
    }

    const {files} = req.body
    
    for(let file of files){
        if(!file.selectPosition  || !file.selectPercent || !file.selectSalary ||  !file.selectCoctav || !file.selectTip   || !file.selectRegion  || !file.selectStavka ){
            return next(new ErrorResponse("Sorovlar bosh qolmasligi kerak", 402))
        }
        const test = await File.findOne({
            where: {
                selectPosition : file.selectPosition, 
                folderId : folder.id, 
                selectRegion: file.selectRegion
            }
        })

        if(test){
            return next(new ErrorResponse(`Bu malumotdan oldin foydalanilgan : ${test.selectPosition}  ${test.selectRegion}`))
        }
    }

    const now = new Date();
    // Hozirgi yil, oy va kunni olish
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Oylarda 0 dan boshlanganligi uchun 1 qo'shamiz
    const day = String(now.getDate()).padStart(2, '0');
    const createDate = `${year}-${month}-${day}`;

    for(let file of files){
        const newFile = await File.create({
            selectPosition : file.selectPosition,
            selectSalary : file.selectSalary, 
            selectcoefficient : file.selectPercent, 
            selectTip : file.selectTip, 
            selectCoctav : file.selectCoctav, 
            selectRegion : file.selectRegion,
            selectStavka: file.selectStavka,
            folderId : folder.id,
            date : createDate
        })
    }

    return res.status(200).json({success : true, data : "kiritildi"})
})

// update file 
exports.updateFile = asyncHandler(async (req, res, next) => {
    const file = await File.findByPk(req.params.id)

    if(!req.body.selectPosition  || !req.body.selectPercent || !req.body.selectSalary ||  !req.body.selectCoctav || !req.body.selectTip   || !req.body.selectRegion  || !req.body.selectStavka ){
        return next(new ErrorResponse("Sorovlar bosh qolmasligi kerak", 402))
    }

    if(file.selectPosition !== req.body.selectPosition){
       const test = await  File.findOne({
            where: {
                folderId : file.folderId, 
                selectPosition : req.body.selectPosition, 
                selectRegion: req.body.selectRegion 
            }
       })

       if(test){
        return next(new ErrorResponse(`Ushbu malumotdan foydalanilgan : ${test.selectPosition} ${test.selectRegion}`))
       } 
    }
    
    file.selectCoctav = req.body.selectCoctav
    file.selectTip = req.body.selectTip
    file.selectPosition = req.body.selectPosition
    file.selectCoefficient = req.body.selectoCefficient
    file.selectSalary = req.body.selectSalary
    file.selectRegion = req.body.selectRegion
    file.selectStavka = req.body.selectStavka

    await file.save()
    return res.status(200).json({success : true, data : file})    
})

// delete file 
exports.deleteFile = asyncHandler(async (req, res, next) => {
    await File.destroy({
        where: {id: req.params.id}
    })

    return res.status(200).json({ success : true, data : "Delete"})
})

// get file by id 
exports.getFileById = asyncHandler(async (req, res, next) => {
    const file = await File.findByPk(req.params.id)
    
    if(!file){
        return next(new ErrorResponse("server xatolik shtatka topilmadi", 500))
    }

    return res.status(200).json({success : true, data : file})
})

// create info for page 
exports.createInfo = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findByPk(req.params.id)
    const path = "/" + req.user.username + await pathUrl(folder)

    const positions = await Position.findAll({
        where: {masterId : req.user.id},
        order: [["name", "ASC"]]
    })

    const tips = await Tip.findAll({
        where: {masterId : req.user.id},
        order: [["name", "ASC"]]
    })

    const coctavs = await Coctav.findAll({
        where: {masterId : req.user.id},
        order: [["name", "ASC"]]
    })

    const locations = await Location.findAll({
        where: {masterId : req.user.id},
        order: [["name", "ASC"]]
    })

    return res.status(200).json({success : true, positions, tips, coctavs, locations, path})
}) 