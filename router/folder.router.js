const {Router} = require('express')
const router = Router()

const {protect} = require('../middleware/auth')

const {
    createFolder, 
    getOpenFolder,
    deleteFolder,
    updateFolder, 
    getOpenFolderForFile,
    searchFolder,
    getOpenUser,
    getBack,
    forPath
} = require('../controller/folder.controller')

router.get("/open/user", protect, getOpenUser)
router.get('/open/:id', protect, getOpenFolder)
router.get('/open/file/:id', protect, getOpenFolderForFile)
router.post("/create/:id", protect, createFolder)
router.delete("/delete/:id", protect, deleteFolder)
router.put("/update/:id", protect, updateFolder)
router.post("/search", protect, searchFolder)
router.get("/back/:id", protect, getBack)
router.get('/path/:id', protect, forPath)

module.exports = router


