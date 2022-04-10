const express= require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config()
const app=express();

app.set('views engine','ejs');
//app.get('/', (req, res) => res.json({
   // "hello":"how are you?"
//}))
app.use('/', require('./routes/db'))
app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:9000/db',
      changeOrigin: true,
    })
  );
const PORT= process.env.PORT || 9000;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})
