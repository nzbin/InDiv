const express = require('express');

const app = express();

// ejs 相关
app.engine('.html', require('ejs').__express);

app.set('view engine', 'html');

// 静态文件
app.set('views', './dist');
app.use(express.static('./dist'));


app.use('/', (req, res, next) => {
  res.render('index.html');
});
app.use('/demo', (req, res, next) => {
  res.render('index.html');
});
app.use('/dess', (req, res, next) => {
  res.send({ a: 1 });
});

app.listen(1234);
console.log(`listening port 1234`);

module.exports = app;
