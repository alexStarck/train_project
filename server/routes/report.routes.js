const {Router} = require('express');
const auth = require('../middleware/auth.middleware');
const Report = require('../models/Report')
const User = require('../models/User')
const Tasks = require('../models/Tasks')
const Objects = require('../models/Objects')
const fs = require('fs')
const router = Router();
const PDFDocument = require('pdfkit');
const {v4: uuidv4} = require('uuid');

router.post('/list', auth, async (req, res) => {
    try {
        const users = await User.find({company: req.user.company}, {password: 0})
        const ids = users.map(item => item.reports).flat()
        const reports = await Report.find({_id: {$in: ids}})
        const result = []
        function generateDate(timestamp) {
            const year = new Intl.DateTimeFormat('ru', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            }).format(timestamp);

            return year
        }
        function generateTime(timestamp) {
            const hour = new Intl.DateTimeFormat('ru', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
                second:'numeric',
            }).format(timestamp);

            return hour
        }

        for (const report of reports) {
            const obj = JSON.parse(JSON.stringify(report))
            const owner = users.find(item => item.reports.includes(report._id))
            obj.owner = {name: owner.name, surname: owner.surname}
            if (Object.keys().includes('dateOut')) {
                obj.timeOut = generateTime(new Date(report.dateOut).getTime())
                obj.dateOut = generateDate(new Date(report.dateOut).getTime())
            } else {
                obj.timeOut = ''
                obj.dateOut = ''
            }
            obj.timeIn = generateTime(new Date(report.dateIn).getTime())
            obj.dateIn = generateDate(new Date(report.dateIn).getTime())
            result.push(obj)
        }
        res.json(result)
    } catch (e) {
        res.status(500).json({message: 'ошибка запроса списка отчетов'});
    }
});

router.post('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)


        let arr = []


        for (const report of user._doc.reports) {

            const myReport = await Report.findById(report)
            for (const page of myReport._doc.data) {
                if (page.hasOwnProperty('data')) {
                    delete page.path
                }

            }
            arr.push({...myReport._doc})
        }
        if (arr.length > 0) {
            res.json(arr)
        } else {
            res.status(500)
        }

    } catch (e) {
        res.status(500).json({message: 'ошибка запроса списка отчетов пользователя '});
    }
});
router.post('/create', auth, async (req, res) => {
    try {

        const object = await Objects.findOne({objectName: req.body.objectName})
        if (!object) {
            res.status(400).json({message: 'не нашлось такого обьекта'})
        }
        let arr = []
        let user = await User.findById(req.user.userId)
        let opened = false
        let lastReport = {}

        for (const report of user._doc.reports) {
            const myReport = await Report.findById(report)

            if (myReport._doc.objectName === req.body.objectName) {

                if (!myReport._doc.hasOwnProperty('dateOut')) {

                    opened = true
                    lastReport = myReport
                }

            }
        }

        if (!opened) {

            for (const item of object._doc.composition) {
                let array = []
                let tasks = await Tasks.find({typeComposition: item.class})
                for (const task of tasks) {
                    array.push({name: task._doc.name, order: task._doc.order})
                }

                array.sort(function (a, b) {
                    if (a.order > b.order) {
                        return 1;
                    }
                    if (a.order < b.order) {
                        return -1;
                    }
                    return 0;
                })

                arr.push({tasks: array})
            }

            let reports = await Report.find({})
            if (reports.length === 0) {
                reports = 1
            } else {
                reports = reports.length + 1
            }

            let report = new Report({
                number: reports,
                objectName: object._doc.objectName,
                dateIn: new Date(),
                gps: req.body.gps,
                data: arr
            })
            await report.save()
            const obj = await User.findById(req.user.userId)
            obj.reports = [...obj.reports, report._id]

            await obj.save()

            res.json({...report._doc});
        } else {
            res.status(200).json({...lastReport._doc})
        }

    } catch (e) {
        console.log('ошибка pdf create', e)
        res.status(500).json({message: 'ошибка создания отчета '});
    }
});
router.post('/update', auth, async (req, res) => {
    try {

        function CheckHeight(doc, height, value, paths) {

            if (value === 'true') {
                if (doc.y + height + 15 >= doc.page.height * 19 / 20) {
                    doc.addPage({size: 'A4'})
                    doc.x = 5
                    doc.y = 5
                }
            } else {
                if (paths.length > 0) {
                    if (doc.y + height + 15 + 182 >= doc.page.height * 19 / 20) {
                        doc.addPage({size: 'A4'})
                        doc.x = 5
                        doc.y = 5
                    }
                } else {
                    if (doc.y + height + 15 >= doc.page.height * 19 / 20) {
                        doc.addPage({size: 'A4'})
                        doc.x = 5
                        doc.y = 5
                    }
                }

            }
        }

        function GetLength(doc, name, details) {
            let a = doc.heightOfString(name, {
                columns: 1,
                columnGap: 0,
                width: doc.page.width / 2,
                align: 'center'
            }) + 15
            let b = doc.heightOfString(details, {
                columns: 1,
                columnGap: 0,
                width: doc.page.width / 2 - doc.page.width / 10 - doc.page.width / 10 - 5,
                align: 'center'
            }) + 15
            if (a > b) {
                return {height: a, nameless: name}
            } else {
                return {height: b, nameless: details}
            }

        }

        function CreateTrueLine(doc, height, name) {

            let y = doc.y
            let x = 5

            const x1 = doc.page.width / 2
            const x2 = doc.page.width / 10
            const x3 = doc.page.width / 10
            const x4 = doc.page.width - x - x1 - x2 - x3 - 5


            doc.text(name, x, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x1,
                align: 'center'
            })


            doc.rect(x, y, x1, height).stroke();
            doc.text(`Да`, x + x1, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x2,
                align: 'center'
            });

            doc.rect(x + x1, y, x2, height).stroke();

            doc.text(` `, x + x1 + x2, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x3,
                align: 'center'
            });
            doc.rect(x + x1 + x2, y, x3, height).stroke();


            doc.text(` `, x + x1 + x2 + x3, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x4,
                align: 'center'
            });
            doc.rect(x + x1 + x2 + x3, y, x4, height).stroke();

            doc.y = y + height

            doc.x = 5


        }

        function CreateFalseLine(doc, height, name, type, detail, paths, c) {
            let p = (doc.page.width - 10 - 2 * 20) / 3
            let y = doc.y
            let x = 5

            const x1 = doc.page.width / 2
            const x2 = doc.page.width / 10
            const x3 = doc.page.width / 10
            const x4 = doc.page.width - x - x1 - x2 - x3 - 5


            doc.text(name, x, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x1,
                align: 'center'
            })


            doc.moveTo(x, y).lineTo(x, y + height).undash().stroke()
            doc.moveTo(x, y).lineTo(x + x1, y).undash().stroke()


            doc.moveTo(x + x1, y).lineTo(x + x1, y + height).undash().stroke()
            doc.moveTo(x + x1, y).lineTo(x + x1 + x2, y).undash().stroke()


            doc.moveTo(x + x1 + x2, y).lineTo(x + x1 + x2, y + height).undash().stroke()
            doc.moveTo(x + x1 + x2, y).lineTo(x + x1 + x2 + x3, y).undash().stroke()


            doc.moveTo(x + x1 + x2 + x3, y).lineTo(x + x1 + x2 + x3, y + height).undash().stroke()
            doc.moveTo(x + x1 + x2 + x3, y).lineTo(x + x1 + x2 + x3 + x4, y).undash().stroke()


            doc.moveTo(x + x1 + x2 + x3 + x4, y).lineTo(x + x1 + x2 + x3 + x4, y + height).undash().stroke()

            if (paths.length === 0) {
                doc.moveTo(x, y + height).lineTo(x + x1 + x2 + x3 + x4, y + height).undash().stroke()
            } else {
                doc.moveTo(x, y + height).lineTo(x + x1, y + height).dash(5, {space: 10}).stroke()
                doc.moveTo(x + x1, y + height).lineTo(x + x1 + x2, y + height).dash(5, {space: 10}).stroke()
                doc.moveTo(x + x1 + x2, y + height).lineTo(x + x1 + x2 + x3, y + height).dash(5, {space: 10}).stroke()
                doc.moveTo(x + x1 + x2 + x3, y + height).lineTo(x + x1 + x2 + x3 + x4, y + height).dash(5, {space: 10}).stroke()
                doc.moveTo(x, y + height + c).lineTo(x + x1 + x2 + x3 + x4, y + height + c).undash().stroke()
            }

            doc.text(` `, x + x1, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x2,
                align: 'center'
            });


            doc.text(`Нет`, x + x1 + x2, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x3,
                align: 'center'
            });

            doc.text(detail, x + x1 + x2 + x3, y + 5, {
                columns: 1,
                columnGap: 0,
                width: x4,
                align: 'center'
            });


            let h = y + height
            let startX
            if (paths.length === 0) {
                doc.y = y + height
            } else if (paths.length === 1) {
                startX = doc.page.width / 2 - p / 2
                doc.image(paths[0], startX, h + 10, {
                    width: p,
                    height: p - 20,
                    align: 'center',
                    link: paths[0]
                })
                doc.moveTo(x, y).lineTo(x, y + height + c).undash().stroke()
                doc.moveTo(doc.page.width - 5, y).lineTo(doc.page.width - 5, y + height + c).undash().stroke()
                doc.y = y + height + c
            } else if (paths.length === 2) {
                startX = doc.page.width / 2 - p - 20
                doc.image(paths[0], startX, h + 10, {
                    width: p,
                    height: p - 20,
                    align: 'center',
                    link: 'http://5.53.125.122:5000/' + paths[0]
                })
                startX += p + 20
                doc.image(paths[1], startX, h + 10, {
                    width: p,
                    height: p - 20,
                    align: 'center',
                    link: 'http://5.53.125.122:5000/' + paths[1]
                })
                doc.moveTo(x, y).lineTo(x, y + height + 90).undash().stroke()
                doc.moveTo(doc.page.width - 5, y).lineTo(doc.page.width - 5, y + height + c).undash().stroke()

                doc.y = y + height + c
            } else if (paths.length === 3) {
                startX = 5
                doc.image(paths[0], startX, h + 10, {
                    width: p,
                    height: p - 20,
                    align: 'center',
                    link: paths[0]
                })
                startX += p + 20
                doc.image(paths[1], startX, h + 10, {
                    width: p,
                    height: p - 20,
                    align: 'center',
                    link: paths[1]
                })
                startX += p + 20
                doc.image(paths[2], startX, h + 10, {
                    width: p,
                    height: p - 20,
                    align: 'center',
                    link: paths[2]
                })
                doc.moveTo(x, y).lineTo(x, y + height + c).undash().stroke()
                doc.moveTo(doc.page.width - 5, y).lineTo(doc.page.width - 5, y + height + c).undash().stroke()
                doc.y = y + height + c
            }
            doc.x = 5
        }

        function Pod(doc, name) {
            let b = doc.heightOfString(name) + 30
            if (doc.y + b >= doc.page.height) {
                doc.addPage({size: 'A4'})
                doc.x = 5
                doc.y = 5
            }


            let x = 5
            let y = doc.y

            doc.text(name, 15, doc.y + 20, {
                    align: 'justify'

                }
            );

            doc.rect(x, y, doc.page.width - 10, doc.y - y + 10).stroke();
            doc.y += 10
        }

        async function GeneratePdf(data, path, name, objectName, number, date, fio, gps, doc) {
            if (number > 1) {
                doc.addPage({size: 'A4'})
            }

            async function CreateGrid(arr) {

                let y = doc.y
                let x = doc.x

                const x1 = doc.page.width / 2
                const x2 = doc.page.width / 10
                const x3 = doc.page.width / 10
                const x4 = doc.page.width - x - x1 - x2 - x3 - 5

                // ==========x1===========
                doc.text(`Наименование проверки`, x, y + 5, {
                    columns: 1,
                    columnGap: 0,
                    width: x1,
                    align: 'center'
                })
                let height = doc.y - y

                doc.rect(x, y, x1, height + 5).stroke();
                // ==========x2===========
                doc.text(`Да`, x + x1, y + 5, {
                    columns: 1,
                    columnGap: 0,
                    width: x2,
                    align: 'center'
                });
                doc.rect(x + x1, y, x2, height + 5).stroke();
                // ==========x3===========
                doc.text(`Нет`, x + x1 + x2, y + 5, {
                    columns: 1,
                    columnGap: 0,
                    width: x3,
                    align: 'center'
                });
                doc.rect(x + x1 + x2, y, x3, height + 5).stroke();
                // ==========x4===========
                doc.text(`детали`, x + x1 + x2 + x3, y + 5, {
                    columns: 1,
                    columnGap: 0,
                    width: x4,
                    align: 'center'
                });
                doc.rect(x + x1 + x2 + x3, y, x4, height + 5).stroke();
                doc.y += 5

                for (const item of arr) {

                    let obj = GetLength(doc, item.name, item.details)
                    CheckHeight(doc, obj.height, item.value, item.paths)


                    if (item.value === 'true') {
                        CreateTrueLine(doc, obj.height, obj.nameless)
                    } else {
                        CreateFalseLine(doc, obj.height, item.name, item.value, item.details, item.paths, 182)
                    }


                }

                Pod(doc, `Подпись Руководителя__________`)

                Pod(doc, `Подпись Проверяющего__________`)

            }


            doc.font('fonts/DejaVuSans.ttf')
            doc.x = 5
            doc.y = 5
            let x = doc.x
            let y = doc.y

            doc.text(`КОНТРОЛЬНЫЙ СПИСОК ПАРАМЕТРОВ ${objectName}`, doc.x, doc.y + 5, {
                    align: 'center',
                    width: doc.page.width - 10
                }
            )


            doc.rect(doc.x, y, doc.page.width - 10, doc.y).stroke();


            doc.text(`заполни контрольный список по результатам проверки`, doc.x, doc.y + 5, {
                    align: 'center',
                    width: doc.page.width - 10
                }
            );


            doc.text(`проконтролируй устранения невополненых праметров`, doc.x, doc.y + 5, {
                    align: 'center',
                    width: doc.page.width - 10
                }
            );


            doc.text(`зафиксируй неустраненные замечания`, doc.x, doc.y + 5, {
                    align: 'center',
                    width: doc.page.width - 10
                }
            );


            doc.text(`№ Вагона ${number}  `, doc.x + 10, doc.y + 30, {
                    align: 'justify',
                    width: doc.page.width
                }
            );


            doc.text(`ДАТА ${date} `, doc.x, doc.y + 10, {
                    align: 'justify',
                    width: doc.page.width
                }
            );


            doc.text(`Координаты ${gps} `, doc.x, doc.y + 10, {
                    align: 'justify',
                    width: doc.page.width
                }
            );


            doc.text(`ФИО Мастера экипировки ${fio}`, doc.x, doc.y + 10, {
                    align: 'justify',
                    width: doc.page.width

                }
            );


            doc.text(`ФИО Представителя Исполнителя_________________`, doc.x, doc.y + 10, {
                    align: 'justify',
                    width: doc.page.width
                }
            );
            doc.x = 5
            doc.rect(doc.x, y, doc.page.width - 10, doc.y).stroke();
            doc.y += 5
            await CreateGrid(data)


            return doc
        }

        const report = await Report.findById(req.body._id)

        async function SaveAll(id, arr, path) {
            let obj = await Report.findById(id)
            obj.data = arr
            obj.pathToPdf = path
            obj.dateOut = new Date()
            await obj.save()
        }

        const user = await User.findById(req.user.userId)
        let end = req.body.hasOwnProperty('close')
        if (req.body.hasOwnProperty('data')) {

            if (report._doc.data.length === req.body.data.length) {
                report.data = req.body.data
                await report.save()
            }


        }

        if (end) {

            let obj = await Report.findById(req.body._id)
            if (CheckReport(obj)) {
                await CreatePdf(obj, user)
            }

        }

        async function CreatePdf(report, user) {

            function formattedDate() {
                let d = new Date()
                let month = String(Number(d.getMonth()) + 1)
                let day = String(d.getDate())
                const year = String(d.getFullYear())

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return `${day}${month}${year}`;
            }

            let date = formattedDate()
            let dateForm = `${date.substr(0, 2)}.${date.substr(2, 2)}.${date.substr(4, 4)}`
            let fio = `${user.surname.substr(0, 1).toUpperCase() + user.surname.substr(1, user.surname.length) + ' ' + user.name.substr(0, 1).toUpperCase() + '.'}`
            let folderPath = `uploads/${req.user.userId}/${date}`

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, {recursive: true})
            }

            let data = report._doc.data


            let number = 0
            let name = uuidv4() + '.pdf'
            const doc = new PDFDocument({size: 'A4'})
            doc.pipe(fs.createWriteStream(folderPath + '/' + name))
            for (const page of data) {

                await GeneratePdf(page.tasks, folderPath + '/', name, report._doc.objectName, number + 1, dateForm, fio, report._doc.gps, doc)

                // arr.push({...page,path:folderPath+'/'+name})
                number++

            }
            await doc.end()
            await SaveAll(report._doc._id, data, folderPath + '/' + name)


        }

        function CheckReport(report) {
            let check = true

            for (const page of report._doc.data) {

                for (const task of page.tasks) {
                    if (!task.hasOwnProperty('value')) {
                        check = false
                    }
                }
            }

            return (check)
        }


        if (end) {
            res.status(200).json({message: ' отчет обновлен и завершен'})
        } else {
            res.status(200).json({message: ' отчет обновлен'})
        }
        //res.status(200).json({ message: ' отчет обновлен' })
    } catch (e) {
        console.log('ошибка создание отчета pdf ', e)
        res.status(500).json({message: 'ошибка обновления отчета '});
    }
});
router.post('/done', auth, async (req, res) => {
    try {


    } catch (e) {
        res.status(500).json({message: 'Error Train post '});
    }
});
router.post('/info', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.body._id)


        res.json(report)
        //res.json(report);
    } catch (e) {
        res.status(500).json({message: 'ошибка запроса информации по отчету '});
    }
});


module.exports = router;
