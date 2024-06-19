const http = require('http');
const host = "http://localhost";
const port = 3000;

const stats = require('./pcRam.js');

http.createServer((req, res) => {
  let url = req.url;

  if (url === '/status') {
    res.end(JSON.stringify(stats, null, 2));
  } else {
    res.end('<h1>Seja bem-vindo <a href="http://localhost:3000/status">http://localhost:3000/status</a></h1>');
  }
}).listen(port, () => console.log(`Rodando no ${host}:${port}`));


