const express = require('express')
const app = express();
let bodyParser = require('body-parser'); 
let createError = require('http-errors');
const users = require('./routes/user');
const auth = require('./routes/auth');
const book = require('./routes/books');
const camp = require('./routes/camp');
const news = require('./routes/news');
const plan = require('./routes/plans');
const sms = require('./routes/sms');
const upload = require('./routes/upload')
const dashboard = require('./routes/dashboard');
const subscriber = require('./routes/subscribers');
const subscription = require('./routes/subcription');
const common = require('./routes/common');
const audit = require('./routes/audit');
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
let path = require('path');
var cron = require('node-cron');
const { validateSubscription } = require('./schedular');

const port = 3002;
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,OPTIONS, DELETE, PATCH');
        return res.status(200).json({});
    }

    if (req.method === 'DELETE') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,OPTIONS, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});
/**
 * @purpose: test server is running
 */
app.get('/', (req, res) => {
    res.send('Hello World!')
})
/**
 * connect to db
 */
try {
    let db = require('./config/db');
    db.connect(function () {
    });
} catch (err) {
    console.info('Connection fail to db with err %s', err.message);
}
/**
 * load users module
 */
app.use('/user',users);
app.use(auth);
app.use('/book',book);
app.use('/camp',camp);
app.use('/news', news);
app.use('/subscriber', subscriber);
app.use('/subscription', subscription);
app.use('/plan', plan);
app.use('/dashboard', dashboard);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload', upload);
app.use('/common',common);
app.use('/audit', audit);
app.use('/send-sms', sms);

/**
 * swagger configration
 */
 app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
cron.schedule("59 23 * * *", function() {
    validateSubscription();
});
app.listen(port, () => {
    console.log(`KYS listening at http://103.224.246.103:${port}`)
})
