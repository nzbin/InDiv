const express = require('express');

const app = express();

// ejs 相关
app.engine('.html', require('ejs').__express);

app.set('view engine', 'html');

// 静态文件
app.set('views', './demo');
// app.use(express.static('./demo'));
app.use(express.static('./dist'));

app.use('/demo', (req, res, next) => {
  res.render('index-app.html');
});

app.listen(2234);
console.log(`listening port 2234`);

module.exports = app;
