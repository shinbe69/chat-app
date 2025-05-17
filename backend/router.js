const express = require('express')
const router = express.Router()

router.get('/check-health', (req, res) => {
    res.sendStatus(200)
})



module.exports = router