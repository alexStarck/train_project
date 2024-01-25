const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const auth = require('./middleware/auth.middleware');
const multer = require('multer')
const {v4: uuidv4} = require('uuid');
const bcrypt = require("bcryptjs");
const SuperAdmin = require("./models/SuperAdmin");

const app = express();


app.use(express.json({extended: true}));

function logResponseBody(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;

    var chunks = [];

    res.write = function (chunk) {
        chunks.push(chunk);

        return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk)
            chunks.push(chunk);

        var body = Buffer.concat(chunks).toString('utf8');
        console.log(req.path, body);

        oldEnd.apply(res, arguments);
    };

    next();
}

app.use(logResponseBody);


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/task', require('./routes/task.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/company', require('./routes/company.routes'));
app.use('/api/superAdmin', require('./routes/superAdmin.routes'));
app.use('/api/objects', require('./routes/objects.routes'));
app.use('/api/report', require('./routes/report.routes'));
app.use('/api/typeOfElement', require('./routes/typeOfElement.routes'));
app.use('/uploads', auth, express.static(path.join(__dirname, '/uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        function formattedDate() {
            let d = new Date
            let month = String(Number(d.getMonth()) + 1);
            let day = String(d.getDate());
            const year = String(d.getFullYear());

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return `${day}${month}${year}`;
        }

        const dir = 'uploads' + '/' + req.user.userId + '/' + formattedDate()
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {recursive: true})
            }
        } catch (err) {

        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '.' + file.originalname.split('.')[1]);
    }
});


const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({storage, fileFilter}).single('file');


app.post('/fileRemove', auth, async (req, res) => {
    try {
        let path = req.body.path
        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        } else {
            res.status(400).json({message: 'такого файла нету'})
        }
        res.status(200).json({message: 'удален'})
    } catch (e) {
        res.status(500).json({message: 'ошибка'})
    }
})
app.post('/upload', auth, async (req, res) => {
    try {
        await upload(req, res, err => {

            if (err) {
                console.log(err)
                res.status(500)
            }

            res.json({
                path: res.req.file.destination + '/' + res.req.file.filename
            })
        })
    } catch (e) {
        res.status(500).json({message: 'ошибка'})
    }
})
app.get('/uploads/:file', function (req, res) {
    res.sendFile('/uploads/' + req.params.file)
})

async function start() {
    try {
        await mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true,
        });
    } catch (e) {
        console.log('bd Error', e.message);
    }
    try {
        await app.listen(5000, () => console.log(`App has  been started on port ${5000}...`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();
