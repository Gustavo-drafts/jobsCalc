const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    create(req, res) {
        res.render('job')
    },

    async save(req, res) {

        // insere dados no array
        await Job.create({
          name: req.body.name,
          "daily-hours": req.body["daily-hours"],
          "total-hours": req.body["total-hours"],
          created_at: Date.now() // atribuindo nova data
      });

        

        // redirecionar para page index
        return res.redirect('/')

    },

    async show(req, res) {
        
        // jobId recebe parametros do objeto pelo id
        const jobId = req.params.id
        
        const jobs = await Job.get()
        
        // procurar e retornar valor quando verdadeiro seguindo instrução do parâmetro
        const job = jobs.find(job => Number(job.id) === Number(jobId))			
        
        // validação não achou job na busca acima
        if(!job) {
            return res.send('job not found')
        }

        const profile = await Profile.get()
        
        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])
        
        return res.render("job-edit", { job })
    },

    async update(req, res) {

        // jobId recebe parametros do objeto pelo id
        const jobId = req.params.id        	

        // Dados inseridos pelo usuário no body do navegador
        const updatedJob = {
            // sobrescrever o dado 'name' c/ 'req.body(obj que serão alterados pelo client-side)
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
        }

        await Job.update(updatedJob, jobId)

        res.redirect('/job/' + jobId)
    },

    async delete(req, res) {
        const jobId = req.params.id

        await Job.delete(jobId)

        return res.redirect('/')
    }
};