const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const Admin = require('../models/Admin');
const router = Router();


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
            let admin = await Admin.findOne({login});

            if (!admin) {
                return res.status(401).json({message: 'Пользователь не найден'});
            }
            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'});
            }
            const token = jwt.sign(
                {
                    userId: admin.id,
                    company: admin.company


                },
                process.env.JWT_SECRET,
                {expiresIn: '30d'},
            );

            res.json({token, userId: admin.id, company: admin.company});
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
        }
    },
);

module.exports = router;
