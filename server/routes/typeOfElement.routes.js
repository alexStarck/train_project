const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const TypeOfElement = require('../models/TypeOfElement')
const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const typesOfElement = await TypeOfElement.find({company: req.user.company},{Class:1})
        res.json(typesOfElement);
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        console.log(req.param)
        console.log(req.user)
        // const report = await Report.findById(req.body.id)


        res.json({});
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const type = await TypeOfElement.findOne({Class: req.body.Class, company: req.user.company})
        if (!type) {
            await TypeOfElement.create({Class: req.body.Class, company: req.user.company})
            res.status(200).json({message: 'тип вагона создан'})
        } else {
            res.status(401).json({message: 'такой тип уже существует'})
        }
    } catch (e) {
        res.status(500).json({message: 'ошибка создания типа вагона'});
    }
});
router.delete('/', auth, async (req, res) => {
    try {
        let array = req.body.array
        let count = 0
        for (let id of array) {
            await TypeOfElement.deleteOne({company:req.user.company,_id:id})
            count++
        }
        res.status(200).json({message: `удалены ${count} типов вагонов`})
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});


module.exports = router;
