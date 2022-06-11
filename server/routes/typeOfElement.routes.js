const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const TypeOfElement = require('../models/TypeOfElement')
const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const typesOfElement = await TypeOfElement.find({company:req.user.company})
        console.log(typesOfElement)
        res.json(typesOfElement);
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        console.log(req.param)
        // const report = await Report.findById(req.body.id)


        res.json({});
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});


module.exports = router;
