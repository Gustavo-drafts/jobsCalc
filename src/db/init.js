const Database = require('./config')


const initDb = {
	async init() {


		// iniciando bd
		const db = await Database()

		// inserção de SQL

		/* Estrutura de uma tabela 'profile' */

		await db.exec(`CREATE TABLE profile (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			avatar TEXT,
			monthly_budget INT,
			days_per_week INT,
			hours_per_day INT,
			vacation_per_year INT,
			value_hour INT
		)`);

		await db.exec(`CREATE TABLE jobs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			daily_hours INT,
			total_hours INT,
			created_at DATETIME
			)`)

		// inserir informações na tabela 'profile'

		await db.run(`INSERT INTO profile (
				name,
				avatar,
				monthly_budget,
				days_per_week,
				hours_per_day,
				vacation_per_year,
				value_hour
				) VALUES (
					"gustavo",
					"https://avatars.githubusercontent.com/u/35564120?v=4",
					7500,
					5,
					5,
					6,
					70
					);`)

		await db.run(`INSERT INTO jobs (
						name,
						daily_hours,
						total_hours,
						created_at
						) VALUES (
							"Pizzaria Guloso",
							2,
							1,
							1646974392005
							);`)

		await db.run(`INSERT INTO jobs (
								name,
								daily_hours,
								total_hours,
								created_at
								) VALUES (
									"OneTwoProjects",
									3,
									47,
									1646974519893
									);`)

		// desligando db
		await db.close()
	}
}

initDb.init()
