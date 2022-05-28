const {check, validationResult} = require('express-validator');
const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company')
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');


const router = Router();


router.post(
    '/create',
    [
        check('login', 'Некорректный login').exists(),//.isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').exists()
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

            const candidate = await User.findOne({login});

            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await new User({
                login,
                password: hashedPassword,
                name: req.body.name,
                surname: req.body.surname,
                company: req.user.company,
                phoneNumber: req.body.phoneNumber,
                personnelNumber: req.body.personnelNumber,
                reports: []
            });

            await user.save();

            res.status(201).json({message: 'Пользователь создан'});
        } catch (e) {
            // console.log(e)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
        }
    },
);


router.post(
    '/login',
    [
        check('login', 'Введите корректный login').exists(),//.normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists(),//.exists(),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при входе в систему',
                });
            }
            const {login, password} = req.body;
            let user = await User.findOne({login});

            if (!user) {
                return res.status(401).json({message: 'Пользователь не найден'});
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'});
            }
            const token = jwt.sign(
                {
                    userId: user.id,
                    company: user.company
                },
                process.env.JWT_SECRET,
                {expiresIn: '30d'},
            );

            res.json({token});
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
        }
    },
);


router.post('/list', auth, async (req, res) => {
    try {
        const users = await User.find({company: req.user.company})
        let arr = users.map((user) => {
            user._doc.password = ''
            return {...user._doc}
        })
        res.json(arr)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const users = await User.find({})
        const companies = await Company.find({})
        let arr = users.map((user) => {
            let companyName = companies.filter(company => company._id.toString() === user.company.toString())[0].name
            return {...user._doc, companyName}
        })
        res.json(arr)

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});


router.post('/info', auth, async (req, res) => {
    try {

        let user = await User.findById(req.user.userId);
        delete user._doc.password
        let company = await Company.findById(user.company)
        user._doc.company = company.name

        res.json(user);
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});


router.post('/edit', auth, async (req, res) => {
    try {
        const user = await User.findById(req.body._id);


        let isLogin = await User.findOne({login: req.body.login});
        if (!isLogin) {
            user.login = req.body.login;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        if (req.body.password !== '' && req.body.password.length > 6) {
            user.password = hashedPassword;
        }
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.phoneNumber = req.body.phoneNumber;
        user.personnelNumber = req.body.personnelNumber;
        await user.save();
        res.status(201).json({message: 'Пользователь изменен'});
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const user = await User.findById(req.body._id);
        await user.remove();
        res.status(201).json({message: 'Пользователь удален'});
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});


router.post('/deleteM', auth, async (req, res) => {
    try {
        const user = await User.deleteMany({_id: req.body});

        res.status(201).json({message: 'Пользователи удалены'});
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});


module.exports = router;
