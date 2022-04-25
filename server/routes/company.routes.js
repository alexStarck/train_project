const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const Company = require('../models/Company')
const Admin = require('../models/Admin')
const User = require('../models/User')
const router = Router();

router.post('/create', auth, async (req, res) => {
    try {

        const candidate = await Company.findOne({name: req.body.name})
        if (candidate) {
            res.json({message: 'Error  such a Company already exists '});
        } else {
            const company = new Company({
                name: req.body.name,
                nameObject: req.body.nameObject,
            })
            await company.save();
            res.json(company);
        }


    } catch (e) {
        res.status(500).json({message: 'Error  Company post '});
    }
});
router.post('/list', auth, async (req, res) => {
    try {

        const companies = await Company.find({})
        const admins = await Admin.find({})
        const users = await User.find({})

        let arr = companies.map((company) => {
            //
            //
            let obj = company._doc
            obj.admins = admins.filter(admin => admin.company.toString() === company._id.toString()).length
            obj.users = users.filter(user => user.company.toString() === company._id.toString()).length
            // console.log(obj)
            // console.log(users.filter(user=>console.log(user)))
            return (company)
        })
        // console.log(arr)
        res.json(arr)
    } catch (e) {
        res.status(500).json({message: 'Error  Company post '});
    }
});
router.post('/delete', auth, async (req, res) => {
    try {

        const company = await Company.findById(req.body._id)
        const admins = await Admin.find({})
        const users = await User.find({})
        const adminList = admins.filter(admin => admin.company.toString() === company._id.toString()).length
        const userList = users.filter(user => user.company.toString() === company._id.toString()).length
        if (adminList === 0 && userList === 0) {
            await company.remove();
            res.json({message: 'company was destroyed '})
        } else {
            res.json({message: 'company have any users or admins '})
        }

    } catch (e) {
        res.status(500).json({message: 'Error  Objects post '});
    }
});
router.post('/edit', auth, async (req, res) => {
    try {
        const company = await Company.findById(req.body._id)
        company.name = req.body.name
        company.nameObject = req.body.nameObject
        await company.save();
        res.json({message: 'company was edited '})
    } catch (e) {
        res.status(500).json({message: 'Error  Company post '});
    }
});


router.post('/deleteM', auth, async (req, res) => {
    try {

        const admins = await Admin.find({})
        const users = await User.find({})
        let deleted = 0
        req.body.map(async (obj) => {

            const adminList = admins.filter(admin => admin.company.toString() === obj._id.toString()).length
            const userList = users.filter(user => user.company.toString() === obj._id.toString()).length
            if (adminList === 0 && userList === 0) {
                deleted++
                await Company.deleteOne({_id: obj._id})

            }
        })

        if (deleted !== 0) {

            res.json({message: ` ${deleted} companies was destroyed `})
        } else {
            res.json({message: 'companies have any users or admins '})
        }


    } catch (e) {
        res.status(500).json({message: 'Error  Objects post '});
    }
});

module.exports = router;
