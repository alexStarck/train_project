const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const TypeOfElement = require('../models/TypeOfElement')
const router = Router();

router.post('/list', auth, async (req, res) => {
    try {

        const typeOfElement = await TypeOfElement.find({})

        let arr = []
        for (const type of typeOfElement) {
            arr.push(type.Class)
        }
        res.json(arr);
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});

router.post('/info', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.body.id)


        res.json(report);
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});


module.exports = router;
