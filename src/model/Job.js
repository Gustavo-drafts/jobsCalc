const Database = require('../db/config');


module.exports = {
	async get() {
		// Abrindo conexão c/ banco
		const db = await Database()

		// pegar todo conteúdo da tabela 'jobs'
		const jobs = await db.all(`SELECT * FROM jobs`)



		// fechando conexão c/ banco
		await db.close()

		// criando um objeto novo com array de itens que o SQL 
		// consiga ler, trocando '-' por '_'

		return jobs.map(job => ({
			id: job.id,
			name: job.name,
			"daily-hours": job.daily_hours,
			"total-hours": job.total_hours,
			"created_at": job.created_at
		}))
	},

	async update(updatedJob, jobId) {
		const db = await Database()

		await db.run(`UPDATE jobs SET 
			name = "${updatedJob.name}",
			daily_hours = ${updatedJob["daily-hours"]},
			total_hours = ${updatedJob["total-hours"]}
			WHERE id = ${jobId}
		`)

		await db.close()
	},

	async delete(id) {
		const db = await Database()

		// apague da tabela jobs onde o 'id'
		db.run(`DELETE FROM jobs WHERE id = ${id}`)

		await db.close()
	},

	async create(newJob) {
		const db = await Database()

		await db.run(`INSERT INTO jobs (
			name,
			daily_hours,
			total_hours,
			created_at
		) VALUES (
			"${newJob.name}",
			${newJob["daily-hours"]},
			${newJob["total-hours"]},
			${newJob.created_at}
		)`)

		await db.close()
	}

}

