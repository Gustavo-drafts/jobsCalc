const express = require('express')
const server = express()
const routes = require('./routes')

// set EJS como template engine
server.set('view engine', 'ejs')

// middleware que habilita arquivos estáticos
server.use(express.static("public"))

// habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))

// routes
server.use(routes)

server.listen(3000, () => console.log('server running'))