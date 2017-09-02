let express = require('express');
let path = require('path');
let fs = require('fs');
let helmet = require('helmet');
let cors = require('cors');
let compression = require("compression");
let morgan = require("morgan");
let https = require('https');
let app = express();

app.use(morgan('common')); //启用请求日志输出
app.use(helmet()); //武装API头部
app.use(cors({
    origin: ['*'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); //处理跨域请求
app.use(compression()); //启用压缩

app.use(express.static(path.join('bin/release')));

app.use('/', (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'bin/release', 'index.html'))
});

let credentials = {
    key: fs.readFileSync('my-api.key', 'utf8'),
    cert: fs.readFileSync('my-api.cert', 'utf8')
};
// https.createServer(credentials, app) //启用HTTPS
//     .listen(3000, () => {
//         console.log('Http Server is running...');
//     });
//openssl genrsa -des3 -out my-api.key 1024
//openssl req -new -key my-api.key -out my-api.csr
//openssl x509 -req -days 365 -in my-api.csr -signkey my-api.key -out my-api.cert
//cp my-api.key my-api.key.orig
//openssl rsa -in my-api.key.orig -out my-api.key

app.listen(3000);