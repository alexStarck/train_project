const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const Objects = require('../models/Objects')
const TypeOfElement = require('../models/TypeOfElement')
const router = Router();


router.post('/create', auth, async (req, res) => {
    try {

        const candidate = await Objects.findOne({objectName: req.body.objectName})

        if (candidate) {
            res.json({message: 'Error  such a Objects already exists '});
        } else {


            let arr = []
            for (const item of req.body.composition) {
                let obj = await TypeOfElement.findOne({Class: item.class})

                if (obj) {
                    arr.push({...item, class: obj._id})
                } else {
                    let typeOfElement = new TypeOfElement({
                        Class: item.Class
                    })
                    await typeOfElement.save()
                    arr.push({...item, class: typeOfElement._id})
                }
            }


            const objects = new Objects({
                objectName: req.body.objectName,
                type: req.body.type,
                company: req.user.company,
                composition: arr,
                detail: req.body.detail
            })

            await objects.save();
            res.status(200).json({message: 'Поезд был создан '})


        }


    } catch (e) {
        res.status(500).json({message: 'ошибка создания поезда'});
    }
});
router.post('/info', auth, async (req, res) => {
    try {

        const object = await Objects.findOne({objectName: req.body.objectName})
        let arr = []

        for (const item of object._doc.composition) {

            let obj = await TypeOfElement.findById(item.class)

            arr.push({...obj._doc})
        }

        res.json({...object._doc, composition: arr})
    } catch (e) {
        res.status(500).json({message: 'ошибка запроса поезда '});
    }
});
router.post('/list', auth, async (req, res) => {
    try {
        const typeOfElement = await TypeOfElement.find({})
        const objects = await Objects.find({company: req.user.company})
        let arr = objects.map((object) => {

            let composition
            if (object.composition.length > 0) {
                composition = object.composition.map((item) => {
                    return {...item, class: typeOfElement.find(el => el._id.toString() === item.class.toString()).Class}
                })
            }
            return {...object._doc, composition}
        })

        res.json(arr)
    } catch (e) {
        res.status(500).json({message: 'ошибка запроса списка поездов '});
    }
});
router.post('/delete', auth, async (req, res) => {
    try {
        const objects = await Objects.findById(req.body._id)
        await objects.remove();
        res.status(200).json({message: 'Поезд был удален '})
    } catch (e) {
        res.status(500).json({message: 'ошибка удаления поезда '});
    }
});


router.post('/deleteM', auth, async (req, res) => {
    try {
        const objects = await Objects.deleteMany({_id: req.body});
        res.status(200).json({message: 'Поезда были удалены '})
    } catch (e) {
        res.status(500).json({message: 'ошибка удаления поездов '});
    }
});
router.post('/edit', auth, async (req, res) => {
    try {

        const typeOfElements = await TypeOfElement.find({})
        let arr = req.body.composition.map((item) => {

            let obj = typeOfElements.find(el => el.Class === item.class)

            if (obj) {

                return {...item, class: obj._id}
            } else {
                let typeOfElement = new TypeOfElement({
                    Class: item.class
                })
                typeOfElement.save()
                return {...item, class: typeOfElement._id}
            }


        })
        const object = await Objects.findById(req.body._id)

        object.objectName = req.body.objectName
        object.type = req.body.type
        object.composition = arr
        object.detail = req.body.detail
        await object.save();
        res.status(200).json({message: 'Поезд изменен '})
    } catch (e) {
        res.status(500).json({message: 'Ошибка изменения '});
    }
});

module.exports = router;
