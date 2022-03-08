const express = require('express');
const routes = express.Router()

const ProfileController = require('./controllers/ProfileController')

// Objeto literal
const Job = {
	data: [
		{
			id: 1,
			name: "Pizzaria Guloso",
			"daily-hours": 2,
			"total-hours": 1,
			created_at: Date.now()
		},
		{
			id: 2,
			name: "OneTwo Project",
			"daily-hours": 3,
			"total-hours": 47,
			created_at: Date.now()
		}
	],

	controllers: {
		index(req, res) {
			// 'map' retorna um array de Objs
			const updatedJobs = Job.data.map((job) => {
				// inserindo dados 'remaining' & 'status' no Obj job via funções

				const remaining = Job.services.remainingDays(job)

				// etamos no dia 0: true = 'done' / false = 'progress'
				const status = remaining <= 0 ? 'done' : 'progress'

				return {

					...job,
					remaining,
					status,
					budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
				}
			})
			// valor de jobs: updatedJobs
			return res.render("index", { jobs: updatedJobs })
		},

		create(req, res) {
			res.render('job')
		},

		save(req, res) {
			// validação de id 
			const lastId = Job.data[Job.data.length - 1]?.id || 0;


			// insere dados no array
			Job.data.push({
				id: lastId + 1,
				name: req.body.name,
				"daily-hours": req.body["daily-hours"],
				"total-hours": req.body["total-hours"],
				created_at: Date.now() // atribuindo nova data
			})

			// redirecionar para page index
			return res.redirect('/')

		},

		show(req, res) {
			
			// jobId recebe parametros do objeto pelo id
			const jobId = req.params.id

			// procurar e retornar valor quando verdadeiro seguindo instrução do parâmetro
			const job = Job.data.find(job => Number(job.id) === Number(jobId))			
			
			// validação se o job não existe...
			if(!job) {
				return res.send('job not found')
			}

			job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])
			
			return res.render("job-edit", { job })
		},

		update(req, res) {

			// jobId recebe parametros do objeto pelo id
			const jobId = req.params.id

			// procurar e retornar valor quando verdadeiro seguindo instrução do parâmetro
			const job = Job.data.find(job => Number(job.id) === Number(jobId))			
			
			// validação se o job existe...
			if(!job) {
				return res.send('job not found')
			}

			const updateJob = {
				// espalhe dados do obj 'job'
				...job,
				// sobrescrever o dado 'name' c/ 'req.body(obj que serão alterados pelo client-side)
				name: req.body.name,
				"total-hours": req.body["total-hours"],
				"daily-hours": req.body["daily-hours"],
			}

			Job.data = Job.data.map(job => {
				if(Number(job.id) === Number(jobId)) {
					job = updateJob
				}

				return job
			})

			res.redirect('/job/' + jobId)
		},

		delete(req, res) {
			const jobId = req.params.id

			// remover 'job' filtrado pelo 'id'
			Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))


			return res.redirect('/')
		}
	},

	services: {
		// calculo de tempo restante
		remainingDays(job) {
			const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()		// 'toFixed()' obtendo resultado como objeto

			// obter a data alvo 
			const createDate = new Date(job.created_at)

			// Somar a data alvo 
			const dueDay = createDate.getDate() + Number(remainingDays)

			// criar nova data baseado em 'createDate'
			const dueDateInMs = createDate.setDate(dueDay)

			// data em milisegundos
			const timeDiffInMs = dueDateInMs - Date.now()

			// Transformar data em dias
			const dayInMs = 1000 * 60 * 60 * 24 // calculo de dias em milisegundos

			// Calcular a diferença de dias
			const dayDiff = Math.floor(timeDiffInMs / dayInMs)

			return dayDiff
		},

		calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
	},
}




// Atualizar e exibir jobs ao acessar a rota index
routes.get('/', Job.controllers.index)


routes.get('/job', Job.controllers.create)

// envio de dados dados
routes.post('/job', Job.controllers.save)

// exibir dados editados
routes.get('/job/:id', Job.controllers.show)

// editar dados da rota show
routes.post('/job/:id', Job.controllers.update)

routes.post('/job/delete/:id', Job.controllers.delete)

routes.get('/profile', ProfileController.index)

routes.post('/profile', ProfileController.update )


module.exports = routes;