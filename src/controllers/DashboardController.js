const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {

  async index(req, res) {


    // 'map' retorna um array de Objs
    const jobs = await Job.get();
    const profile = await Profile.get();

    // contar status
    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    // total de horas por dia de cada Job em progresso
    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      // inserindo dados 'remaining' & 'status' no Obj job via funções

      const remaining = JobUtils.remainingDays(job)

      // etamos no dia 0: true = 'done' / false = 'progress'
      const status = remaining <= 0 ? 'done' : 'progress'

      // Somando a quantidade de status
      statusCount[status] += 1;

      // total de horas por dia de cada Job em progresso
      
      /* condicional ternário */
      jobTotalHours = status == 'progress' ? jobTotalHours + Number(job["daily-hours"]) : jobTotalHours

      /* condicinal Comum */
      // if(status == 'progress'){
      //   jobTotalHours += Number(job["daily-hours"])
      // }

      return {

        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"])
      };
    });

    /* qtd de horas que quero trabalhar dia (PROFILE) 
    * MENOS 
    * qtd de horas/dia de cada job em progress
    */
    const freeHours = profile["hours-per-day"] - jobTotalHours;


    // valor de jobs: updatedJobs
    return res.render("index", { 
      jobs: updatedJobs, 
      profile: profile, 
      statusCount: statusCount, 
      freeHours: freeHours
    });
  }
}