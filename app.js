const express = require('express');
const path = require('path');

const app = express();

// ejs 相关
app.engine('.html', require('ejs').__express);

app.set('view engine', 'html');

// 静态文件
app.set('views', './demo');
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/demo', (req, res, next) => {
  res.render('index-app.html');
});

app.listen(1234);
console.log(`listening port 1234`);

module.exports = app;
