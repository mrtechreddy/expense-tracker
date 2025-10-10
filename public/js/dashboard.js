// public/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  async function loadSummary() {
    const res = await fetch('/api/summary');
    if (!res.ok) {
      if (res.status === 401) {
        window.location = '/login';
      }
      return;
    }
    const data = await res.json();

    document.getElementById('todayAmount').textContent = `₹${Number(data.dailySpent||0).toFixed(2)}`;
    document.getElementById('weekAmount').textContent = `₹${Number(data.weeklySpent||0).toFixed(2)}`;
    document.getElementById('monthAmount').textContent = `₹${Number(data.monthlySpent||0).toFixed(2)}`;
    document.getElementById('quarterAmount').textContent = `₹${Number(data.quarterlySpent||0).toFixed(2)}`;
    document.getElementById('totalSpent').textContent = `₹${Number(data.totalSpent||0).toFixed(2)}`;
    document.getElementById('forecastNext').textContent = `₹${Number(data.forecastNext||0).toFixed(2)}`;

    // recent table
    const tbody = document.getElementById('recentRows');
    tbody.innerHTML = '';
    (data.recent || []).forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.date}</td><td>${r.category}</td><td>₹${Number(r.amount).toFixed(2)}</td>`;
      tbody.appendChild(tr);
    });

    // pie chart by category
    const labels = Object.keys(data.totalsByCategory || {});
    const values = labels.map(k => data.totalsByCategory[k]);

    const ctx = document.getElementById('categoryPie').getContext('2d');
    // destroy previous chart if exists
    if (window._categoryPie) window._categoryPie.destroy();
    window._categoryPie = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#ff6384','#36a2eb','#ffcd56','#4bc0c0','#9966ff','#ff9f40',
            '#8c9eff','#ff80ab','#b2ff59','#80d8ff','#cfd8dc'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  loadSummary();
});

