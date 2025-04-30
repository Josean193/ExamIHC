let rawData;
let chartTotal, chartEdad;

const loader = document.getElementById('loader');

// Cargar datos
fetch('usuario.json')
  .then(res => res.json())
  .then(data => {
    rawData = data;
    updateSummary(rawData);
    initCharts(rawData);
    setupControls();
  })
  .catch(err => {
    console.error('Error cargando JSON:', err);
    alert('No se pudo cargar data.json');
  })
  .finally(() => {
    loader.style.display = 'none';
  });

// Calcula estadísticas y rellena las tarjetas
function updateSummary(data) {
  const total = data.length;
  const nulls = data.filter(d => d.edad === null).length;
  const valid = total - nulls;

  // Cuenta por color
  const counts = data.reduce((acc, { color }) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {});
  const topColor = Object.entries(counts)
    .sort((a,b) => b[1] - a[1])[0][0] || '-';

  document.querySelector('#total-responses .value').textContent = total;
  document.querySelector('#valid-responses .value').textContent = valid;
  document.querySelector('#null-responses .value').textContent = nulls;
  document.querySelector('#top-color .value').textContent = topColor;
}

// Inicializa los gráficos
function initCharts(data) {
  const colors = ['Rojo','Azul','Verde','Amarillo','Naranja','Morado'];
  const ages = ['18-25','26-35','36-45','46+'];

  const ctxT = document.getElementById('chart-total').getContext('2d');
  chartTotal = new Chart(ctxT, {
    type: 'bar',
    data: {
      labels: colors,
      datasets: [{
        label: 'Votos',
        data: colors.map(c => data.filter(d => d.color === c).length)
      }]
    },
    options: {
      responsive: true,
      plugins: { tooltip: { enabled: true } },
      onHover: (evt, items) => evt.native.target.style.cursor = items.length ? 'pointer' : 'default'
    }
  });

  const ctxE = document.getElementById('chart-edad').getContext('2d');
  chartEdad = new Chart(ctxE, {
    type: 'bar',
    data: {
      labels: ages,
      datasets: colors.map((c, i) => ({
        label: c,
        data: ages.map(a => data.filter(d => d.edad === a && d.color === c).length)
      }))
    },
    options: {
      responsive: true,
      plugins: { tooltip: { enabled: true } },
      scales: { x: { stacked: true }, y: { stacked: true } },
      onHover: (evt, items) => evt.native.target.style.cursor = items.length ? 'pointer' : 'default'
    }
  });
}

// Configura los filtros
function setupControls() {
  document.querySelectorAll('.controls input').forEach(el =>
    el.addEventListener('change', () => {
      const filtered = applyFilters();
      updateSummary(filtered);
      chartTotal.data.datasets[0].data = chartTotal.data.labels
        .map(c => filtered.filter(d => d.color === c).length);
      chartTotal.update();
      chartEdad.data.datasets.forEach((ds, i) => {
        ds.data = chartEdad.data.labels
          .map(a => filtered.filter(d => d.edad === a && d.color === ds.label).length);
      });
      chartEdad.update();
    })
  );
}

function applyFilters() {
  const selAges = [...document.querySelectorAll('.controls fieldset:first-of-type input:checked')]
    .map(cb => cb.value);
  const includeNulls = document.getElementById('toggle-nulos').checked;
  return rawData.filter(d =>
    d.edad === null
      ? includeNulls
      : selAges.includes(d.edad)
  );
}
