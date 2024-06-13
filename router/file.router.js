const {Router} = require('express')
const router = Router()

const {protect} = require('../middleware/auth')

const {
    createFile, 
    updateFile, 
    deleteFile, 
    getFileById,
    createInfo
} = require('../controller/file.controller')

router.get('/get/:id', protect, getFileById)
router.post("/create/:id", protect, createFile)
router.put('/update/:id', protect, updateFile)
router.delete("/delete/:id", protect, deleteFile)
router.get("/create/info/:id", protect, createInfo)

module.exports = router

