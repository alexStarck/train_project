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
            const admin = new Admin({
                login,
                password: hashedPassword,
                company: req.body.company,
                name: req.body.name,
                surname: req.body.surname,
                phoneNumber: req.body.phone,
                personnelNumber: req.body.personnelNumber
            });

            await admin.save();

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
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const admin = await Admin.findById(req.body.id);
        const candidate = await Admin.findOne({login: req.body.login});
        if (!candidate)
            admin.login = req.body.login
        admin.password = hashedPassword
        admin.name = req.body.name;
        admin.surname = req.body.surname;
        admin.phoneNumber = req.body.phoneNumber;
        admin.personnelNumber = req.body.personnelNumber;
        admin.company = req.body.company
        await admin.save();
        if (candidate) {
            res.status(201).json({message: 'Пользователь изменен ,логин занят'});
        } else {
            res.status(201).json({message: 'Пользователь изменен'});
        }
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
