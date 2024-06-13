const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const db = require('../models/index')
const Folder = db.folder
const Master = db.master
const File = db.file
const pathUrl = require("../utils/path")
const {Op} = require('sequelize')

// get open user 
exports.getOpenUser = asyncHandler(async (req, res, next) => {

    const folders = await Folder.findAll({where: { masterId: req.user.id }})
    
    return res.status(200).json({success : true, data : folders, path : "/" + req.user.username})
})

//create new folder 
exports.createFolder = asyncHandler(async (req, res, next) => {
    let newFolder = null

    const {name} = req.body
   
    if(!name){
        return next(new ErrorResponse("sorovlar bosh qolishi mumkin emas", 403))
    }
    
    const now = new Date()
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Oylarda 0 dan boshlanganligi uchun 1 qo'shamiz
    const day = String(now.getDate()).padStart(2, '0');
    const createDate = `${year}-${month}-${day}`;

    if(req.query.who === 'user'){
        masterParent = await Master.findByPk(req.params.id)
        
        if(masterParent){
            const test = await Folder.findOne({
                where: {name: req.body.name.trim(), masterId: masterParent.id}
            })
    
            if(test){
                return next(new ErrorResponse(`bu bolim avval kiritilgan: ${test.name}`))
            }
            
            newFolder = await Folder.create({
                name: req.body.name, 
                masterId: masterParent.id,
                date: createDate,
                type: "Folder",
                parentMaster: req.user.id
            })
            return res.status(200).json({ success : true, newFolder})
        }
    }
    if(req.query.who === 'folder'){
        const folderParent = await Folder.findByPk(req.params.id)
        
        if(!folderParent){
            return next(new ErrorResponse("ega folder yoki user topilmadi server xatolik", 500))
        }

        const test = await Folder.findOne({
            where: {name: req.body.name.trim(), folderId: folderParent.id}
        })

        if(test){
            return next(new ErrorResponse(`bu bolim avval kiritilgan : ${test.name}`))
        }

        newFolder = await Folder.create({
            name: req.body.name, 
            folderId: folderParent.id,
            date: createDate,
            type: "Folder",
            parentMaster: req.user.id
        })

        return res.status(200).json({ success : true, newFolder})
    }    
    
})

// get folder open 
exports.getOpenFolder = asyncHandler(async (req, res, next) => {
    let checkFile = false
    
    const folder = await Folder.findByPk(req.params.id)

    const folders = await Folder.findAll({where: { folderId: folder.id}})

    const files = await File.findAll({
        where: { folderId: folder.id}
    })

    if(files.length >= 1 ){
        checkFile = true
    }

    let path = await pathUrl(folder)
    path = "/" + req.user.username + path 
 
    return res.status(200).json({success: true, data: folders, file: checkFile, path})
})

// get open files
exports.getOpenFolderForFile = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findByPk(req.params.id)
    
    let path = "/"
    const url = await pathUrl(folder)
    path = path + req.user.username + url
    
    const files = await File.findAll({where: {folderId: folder.id}})
   
    return res.status(200).json({success : true, data : files, path})
})


// delete folder 
exports.deleteFolder = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findByPk(req.params.id)

    if(!folder){
        return next(new ErrorResponse(`server xatolik bolim topilmadoi`, 500))
    }

    await folder.destroy()

    return res.status(200).json({success : true, data : "Delete"})
})

// update folder name
exports.updateFolder = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findByPk(req.params.id)
    
    if(!folder){
        return next(new ErrorResponse("bolim topilmadi server xatolik", 500))
    }

    const {name} = req.body

    if(!name){
        return next(new ErrorResponse('Sorovlar bosh qolishi mumkin emas', 403))
    }
    
    if(folder.name !== req.body.name.trim()){
        if(folder.masterId){
            const test = await Folder.findOne({
                where: {name: name.trim(), masterId: folder.masterId}
            })
    
            if(test){
                return next(new ErrorResponse(`bu bolim nomi oldin kiritilgan: ${test.name}`, 403))
            }
        }
        const test = await Folder.findOne({
            where: {name: req.body.name.trim(), folderId: folder.folderId}
        })
        
        if(test){
            return next(new ErrorResponse(`bu bolim nomi oldin kiritilgan: ${test.name}`, 403))
        }
    }

    folder.name = name.trim()
    await folder.save()
    
    return res.status(200).json({success : true, data : folder})
})

// Folder qidiruv
exports.searchFolder = asyncHandler(async (req, res, next) => {
    const searchTerm = req.body.name;
    if (!searchTerm) {
        return next(new ErrorResponse("Input bosh qoldi", 403));
    }

    // To'g'ri mos keluvchi qidiruv
    const exactMatch = await Folder.findOne({
        where: {
            name: searchTerm,
            parentMaster: req.user.id
        }
    });

    if (exactMatch) {
        return res.status(200).json({ success: true, data: [exactMatch] });
    }

    // Regex qidiruv
    const regexPattern = `%${searchTerm}%`; // SQL LIKE pattern uchun
    const folders = await Folder.findAll({
        where: {
            name: {
                [Op.iLike]: regexPattern // PostgreSQL uchun case insensitive qidiruv
            },
            parentMaster: req.user.id
        }
    });

    if (!folders.length) {
        return next(new ErrorResponse("Bunday nomi bo'lgan bo'lim topilmadi", 403));
    }

    return res.status(200).json({ success: true, data: folders });
});


// orqaga 
exports.getBack = asyncHandler(async (req, res, next) => {
    let parentFolder = null
    let path = null
    let files = false

    const folder = await Folder.findByPk(req.params.id)
    
    if(!folder){
        return next(new ErrorResponse("Folder id notogri kiritldi yoki server ishlamayapti", 500))
    }

   if(folder.folderId){
        parentFolder = await Folder.findByPk(folder.folderId)
        
        const folders = await Folder.findAll({
            where: {folderId: parentFolder.id}
        })
        
        const filesCheck = await File.findAll({where: {folderId: parentFolder.id}})
        
        if(filesCheck.length >= 1){
            files
        }

        path = '/' + req.user.username  + await pathUrl(parentFolder)

        return res.status(200).json({success: true, data: folders, files, path})
   }
   
   parentFolder = await Master.findByPk(folder.masterId)

   const folders = await Folder.findAll({
    where: {masterId: parentFolder.id}
   })

   path = "/" + req.user.username

    return res.status(200).json({success : true, data : folders, path})
})

// for folder path 
exports.forPath = asyncHandler(async (req, res, next) => {
    let folders = []
   
    if(req.query.who === "user"){
        const parentMaster = await Master.findByPk(req.params.id)
        console.log(parentMaster.id)
    
        folders = await Folder.findAll({
            where: {masterId: parentMaster.id},
            attributes: ["name", "id"]
        })
    }

    if(req.query.who === "folder"){
        const parentFolder = await Folder.findByPk(req.params.id)
        folders = await Folder.findAll({
            where: {folderId: parentFolder.id},
            attributes: ["name", "id"]
        })
    }
    
    return res.status(200).json({success: true, data: folders})
})
