const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({message: 'Нет авторизации'});
        }

        req.user = jwt.verify(token, process.env.JWTSECRET);
        next();
    } catch (e) {
        res.status(401).json({message: 'Нет авторизации'});
    }
};
