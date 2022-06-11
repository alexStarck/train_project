const {check, validationResult} = require('express-validator');
const {Router} = require('express');
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const auth = require('../middleware/auth.middleware');
const router = Router();
const bcrypt = require('bcryptjs');


router.post(
    '/create',
    [
        check('login', 'Некорректный login').exists(),//.isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 7}).exists(),//.isLength({ min: 7 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при создании',
                });
            }
            const {login, password} = req.body;

            const candidate = await Admin.findOne({login});

            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            await Admin.create({
                login,
                password: hashedPassword,
                company: req.body.company,
                name: req.body.name,
                surname: req.body.surname,
                phoneNumber: req.body.phoneNumber,
                personnelNumber: req.body.personnelNumber
            });

            res.status(201).json({message: 'Администратор создан'});
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
        }
    },
);

router.post('/list', auth, async (req, res) => {
    try {
        const admins = await Admin.find({}, {password: 0}).populate('company', {name: 1, _id: 0})

        const arr = admins.map(admin => {
            const obj = JSON.parse(JSON.stringify(admin))
            obj.companyName = admin.company.name
            delete obj.company
            return obj
        })
        res.json(arr)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/info', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.userId,{password:0});
        res.json(admin);
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});


router.post('/edit', auth, async (req, res) => {
    try {
        const {login, password, name, surname, phoneNumber, personnelNumber, companyName, _id} = req.body
        const admin = await Admin.findById(_id);
        if (admin && companyName) {
            const company = await Company.findOne({name: companyName})
            admin.company = company._id
        }
        if (admin.login !== login) {
            const candidate = await Admin.findOne({login});
            if (!candidate) {
                admin.login = login
            }
        }
        if (password) {
            admin.password = await bcrypt.hash(password, 12);
        }
        if (name) {
            admin.name = name;
        }
        if (surname) {
            admin.surname = surname;
        }
        if (phoneNumber) {
            admin.phoneNumber = phoneNumber;
        }

        if (personnelNumber) {
            admin.personnelNumber = personnelNumber
        }

        await admin.save();

        res.status(200).json({message: 'Администратор изменен'});

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        await Admin.deleteOne({_id:req.body._id});
        res.status(200).json({message: 'Администратор удален'});
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/deleteM', auth, async (req, res) => {
    try {
        await Admin.deleteMany({_id:req.body})
        res.status(200).json({message: 'Администраторы удалены'});
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});


module.exports = router;
