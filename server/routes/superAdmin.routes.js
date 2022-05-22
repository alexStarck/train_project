const { check, validationResult } = require('express-validator');
const { Router } = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');
const auth = require('../middleware/auth.middleware');


const router = Router();
const bcrypt = require('bcryptjs');

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
            const { login, password } = req.body;

            let superAdmin = await SuperAdmin.findOne({ login });

            if (!superAdmin) {
                return res.status(401).json({ message: 'Пользователь не найден' });
            }
            const isMatch = await bcrypt.compare(password, superAdmin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
            }
            const token = jwt.sign(
                {
                    userId: superAdmin.id,
                    company:null
                },
                config.get('jwtSecret'),
                { expiresIn: '240h' },
            );

            res.json({ token, userId: superAdmin.id  });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    },
);




router.post('/list', auth, async (req, res) => {
    try {
        const users= await SuperAdmin.find({company:req.body.company})
        res.json(users)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так сссссс, попробуйте снова' });
    }
});

router.post('/info', auth, async (req, res) => {
    try {
        const user = await SuperAdmin.findById(req.body.id);
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так сссссс, попробуйте снова' });
    }
});



router.post('/edit', auth, async (req, res) => {
    try {
        const user = await SuperAdmin.findById(req.body._id);
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.phoneNumber = req.body.phoneNumber;
        user.personnelNumber = req.body.personnelNumber;
        await  user.save();
        res.status(201).json({ message: 'Пользователь изменен' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так сссссс, попробуйте снова' });
    }
});

router.post('/delete', auth,  async (req, res) => {
    try {

        const user = await SuperAdmin.findById(req.body._id);
        await user.remove();
        res.status(201).json({ message: 'Пользователь удален' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так сссссс, попробуйте снова' });
    }
});


router.post('/deleteM', auth,  async (req, res) => {
    try {
        // console.log(req.body)
        const user = await SuperAdmin.deleteMany({ _id: req.body });

        res.status(201).json({ message: 'Пользователи удалены' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так сссссс, попробуйте снова' });
    }
});



module.exports = router;
