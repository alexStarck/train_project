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
            console.log(req.body)
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

            res.status(201).json({message: 'Пользователь создан'});
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
        }
    },
);

router.post('/list', auth, async (req, res) => {
    try {
        const admins = await Admin.find({})
        const companies = await Company.find({})
        let arr = admins.map((admin) => {
            let companyName = companies.filter(company => company._id.toString() === admin.company.toString())[0].name
            delete admin._doc.password
            return {...admin._doc, companyName}
        })
        res.json(arr)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/info', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.userId);
        delete admin._doc.password
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

        res.status(200).json({message: 'Пользователь изменен'});

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.body.user._id);
        await admin.remove();
        res.status(201).json({message: 'Пользователь удален'});
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});


module.exports = router;
