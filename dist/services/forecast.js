// services/forecast.js
const moment = require('moment');

function forecastNextMonth(expensesRows) {
  // expect rows with { amount:number, date:'YYYY-MM-DD' }
  if (!Array.isArray(expensesRows) || expensesRows.length === 0) return 0;

  // filter last 30 days
  const today = moment().startOf('day');
  const last30Start = moment(today).subtract(29, 'days'); // include today => 30 days
  const last30 = expensesRows.filter(r => {
    const d = moment(r.date, 'YYYY-MM-DD');
    return d.isBetween(last30Start.subtract(0,'days'), today.add(0,'days'), null, '[]');
  });

  const total30 = last30.reduce((s, r) => s + Number(r.amount), 0);
  const avgDaily = total30 / 30;
  const forecast = avgDaily * 30; // next 30 days
  return Number(forecast.toFixed(2));
}

module.exports = { forecastNextMonth };

