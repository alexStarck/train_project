const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const Tasks = require('../models/Tasks')
const TypeOfElement = require('../models/TypeOfElement')
const router = Router();

router.post('/list', auth, async (req, res) => {
    try {

        const typeOfElement = await TypeOfElement.find({})
        const tasks = await Tasks.find({})
        const uniqType = await Tasks.find({}).distinct('typeComposition')


        const arr = await typeOfElement.map((item) => {
            const arr = tasks.filter((el) => el.typeComposition.toString() === item._id.toString()).sort(function (a, b) {
                if (a.order > b.order) {
                    return 1;
                }
                if (a.order < b.order) {
                    return -1;
                }
                return 0;
            })
            let obj = {
                Class: item.Class,
                composition: arr
            }
            return obj

        })

        res.json(arr)


    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});
router.post('/create', auth, async (req, res) => {
    try {


        const type = await TypeOfElement.findOne({Class: req.body.Class})
        const candidate = await Tasks.find({typeComposition: type._id})


        if (candidate.length === 0) {

            for (const item of req.body.arr) {
                let obj = await new Tasks({
                    name: item.name,
                    order: item.number,
                    typeComposition: type._id
                })

                await obj.save()
            }

            res.json({message: 'задача была создана'})
        } else {
            await Tasks.deleteMany({_id: candidate})
            for (const item of req.body.arr) {
                let obj = await new Tasks({
                    name: item.name,
                    order: item.number,
                    typeComposition: type._id
                })

                await obj.save()
            }

            res.json({message: 'задача была изменена'});
        }


    } catch (e) {
        res.status(500).json({message: 'ошибка создания задачи '});
    }
});
router.post('/info', auth, async (req, res) => {
    try {
        const report = await Tasks.findById(req.body.id)


        res.json(report);
    } catch (e) {
        res.status(500).json({message: 'Error  Train post '});
    }
});


module.exports = router;
