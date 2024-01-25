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
    auth,
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
            await User.create({
                login,
                password: hashedPassword,
                name: req.body.name,
                surname: req.body.surname,
                company: req.user.company,
                phoneNumber: req.body.phoneNumber,
                personnelNumber: req.body.personnelNumber,
                reports: []
            });

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
                process.env.JWTSECRET,
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
        const users = await User.find({company: req.user.company}, {password: 0})
        // console.log(users)
        res.json(users)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так сссссс, попробуйте снова'});
    }
});

router.post('/', auth, async (req, res) => {
    try {
        console.log('tuttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')
        const users = await User.find({},{password:0}).populate('company')
        console.log('users')
        console.log(users)
        let arr = users.map((user) => {
            const obj = JSON.parse(JSON.stringify(user))
            obj.companyName = user.company.name
            delete obj.company
            return obj
        })
        console.log('! users')
        console.log(arr)
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
        const {_id,login,password,name,surname,phoneNumber,personnelNumber}=req.body
        const user = await User.findById(_id);
        if(user.login!==login){
            let isLogin = await User.findOne({login: req.body.login});
            if (!isLogin) {
                user.login = req.body.login;
            }
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password, 12);
            if (password !== '' && password.length > 6) {
                user.password = hashedPassword;
            }
        }

        if(name) user.name=name
        if(surname) user.surname=surname
        if(phoneNumber) user.phoneNumber=phoneNumber
        if(personnelNumber) user.personnelNumber=personnelNumber

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
