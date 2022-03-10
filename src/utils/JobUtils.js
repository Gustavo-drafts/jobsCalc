module.exports = {
    
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
};