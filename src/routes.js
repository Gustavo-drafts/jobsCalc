const express = require('express');
const routes = express.Router()

const ProfileController = require('./controllers/ProfileController')
const JobController = require('./controllers/JobController')
const DashboardController = require('./controllers/DashboardController')


// Atualizar e exibir jobs ao acessar a rota index
routes.get('/', DashboardController.index)


routes.get('/job', JobController.create)

// envio de dados dados
routes.post('/job', JobController.save)

// exibir dados editados
routes.get('/job/:id', JobController.show)

// editar dados da rota show
routes.post('/job/:id', JobController.update)

routes.post('/job/delete/:id', JobController.delete)

routes.get('/profile', ProfileController.index)

routes.post('/profile', ProfileController.update )


module.exports = routes;