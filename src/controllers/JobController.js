const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    create(req, res) {
        res.render('job')
    },

    save(req, res) {
        // validação de id 
        const jobs = Job.get();
        
        const lastId = jobs[jobs.length - 1]?.id || 0;


        // insere dados no array
        jobs.push({
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
        
        const jobs = Job.get()
        const profile = Profile.get()

        // procurar e retornar valor quando verdadeiro seguindo instrução do parâmetro
        const job = jobs.find(job => Number(job.id) === Number(jobId))			
        
        // validação não achou job na busca acima
        if(!job) {
            return res.send('job not found')
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])
        
        return res.render("job-edit", { job })
    },

    update(req, res) {

        // jobId recebe parametros do objeto pelo id
        const jobId = req.params.id
        
        const jobs = Job.get()
        
        // procurar e retornar valor quando verdadeiro seguindo instrução do parâmetro
        const job = jobs.find(job => Number(job.id) === Number(jobId))			
        
        // validação se o job não existe...
        if(!job) {
            return res.send('job not found')
        }

        const updatedJob = {
            // espalhe dados do obj 'job'
            ...job,
            // sobrescrever o dado 'name' c/ 'req.body(obj que serão alterados pelo client-side)
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
        }

        const newJobs = jobs.map(job => {
            if(Number(job.id) === Number(jobId)) {
                job = updatedJob
            }

            return job
        })

        Job.update(newJobs)

        res.redirect('/job/' + jobId)
    },

    delete(req, res) {
        const jobId = req.params.id

        Job.delete(jobId)
        return res.redirect('/')
    }
};