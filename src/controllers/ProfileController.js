
const Profile = require('../model/Profile')

module.exports = {
    index(req, res) {
        return res.render("profile", { profile: Profile.get() })
    },

    update(req, res) {
        //req.body para pegar os dados
        const data = req.body

        // definir quantas semanas tem um ano: 52
        const weeksPerYear = 52

        // remover as semanas de férias do ano, afim de pegar quantas semanas possui 1 mês
        const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

        // horas trabalhadas por semana
        const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

        // horas trabalhadas no mes
        const monthlyTotalHours = weekTotalHours * weeksPerMonth

        // qual será o valor da hora?
        const valueHour = data["monthly-budget"] / monthlyTotalHours

        // repondo 'data' com os dados tratados
        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hour": valueHour
        })


        return res.redirect('/profile')
    }
}