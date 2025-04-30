// script.js

let rawData;
let chartTotal, chartEdad;

// Paleta moderna corregida para que los colores coincidan:
// Rojo, Azul, Verde, Amarillo, Naranja, Morado
const palette = [
  '#FF6384', // Rojo
  '#36A2EB', // Azul
  '#4BC0C0', // Verde
  '#FFCE56', // Amarillo
  '#FF9F40', // Naranja
  '#9966FF'  // Morado
];

// Ratio de píxeles para pantallas retina
const DPR = window.devicePixelRatio || 1;

/**
 * Ajusta un <canvas> para que se vea nítido en pantallas de alta densidad.
 */
function fixCanvasDPI(canvas) {
  const rect = canvas.getBoundingClientRect();
  canvas.width  = rect.width  * DPR;
  canvas.height = rect.height * DPR;
}

/**
 * Carga los datos y arranca la inicialización de gráficos y filtros.
 */
fetch('usuario.json')
  .then(res => res.json())
  .then(data => {
    rawData = data;
    initCharts();
    setupControls();
    updateSummary(rawData);
  })
  .catch(err => console.error('Error cargando JSON:', err))
  .finally(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
  });

/**
 * Actualiza las tarjetas de resumen con estadísticas clave.
 */
function updateSummary(data) {
  const total = data.length;
  const nulls = data.filter(d => d.edad === null).length;
  const valid = total - nulls;

  const counts = data.reduce((acc, { color }) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {});
  const topColor = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  document.querySelector('#total-responses .value').textContent = total;
  document.querySelector('#valid-responses .value').textContent = valid;
  document.querySelector('#null-responses .value').textContent = nulls;
  document.querySelector('#top-color .value').textContent = topColor;
}

/**
 * Inicializa ambos gráficos: doughnut de totales y barras horizontales apiladas de edades.
 */
function initCharts() {
  const colors = ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Morado'];
  const ages   = ['18-25', '26-35', '36-45', '46+'];

  // 1) Doughnut de popularidad total
  const canvasTotal = document.getElementById('chart-total');
  fixCanvasDPI(canvasTotal);
  chartTotal = new Chart(canvasTotal.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: colors,
      datasets: [{
        data: colors.map(c => rawData.filter(d => d.color === c).length),
        backgroundColor: palette
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed} votos`
          }
        }
      },
      animation: { animateScale: true }
    }
  });

  // 2) Barras horizontales apiladas por rango de edad
  const canvasEdad = document.getElementById('chart-edad');
  fixCanvasDPI(canvasEdad);
  chartEdad = new Chart(canvasEdad.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ages,
      datasets: colors.map((c, i) => ({
        label: c,
        data: ages.map(a => rawData.filter(d => d.edad === a && d.color === c).length),
        backgroundColor: palette[i],
        borderWidth: 1
      }))
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: { display: true, text: 'Votos' }
        },
        y: { stacked: true }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x}`
          }
        }
      }
    }
  });
}

/**
 * Configura los controles (checkboxes) para recargar las gráficas al cambiar filtros.
 */
function setupControls() {
  document.querySelectorAll('.controls input').forEach(el =>
    el.addEventListener('change', () => {
      const filteredData = applyFilters();
      updateSummary(filteredData);

      // Actualiza doughnut
      chartTotal.data.datasets[0].data =
        chartTotal.data.labels.map(c => filteredData.filter(d => d.color === c).length);
      chartTotal.update();

      // Actualiza barras por edad
      chartEdad.data.datasets.forEach(ds => {
        ds.data = chartEdad.data.labels.map(a =>
          filteredData.filter(d => d.edad === a && d.color === ds.label).length
        );
      });
      chartEdad.update();
    })
  );
}

/**
 * Aplica los filtros de rango de edad y nulos, retorna el subconjunto de datos.
 */
function applyFilters() {
  const selectedAges = Array.from(
    document.querySelectorAll('fieldset:first-of-type input:checked')
  ).map(input => input.value);
  const includeNulls = document.getElementById('toggle-nulos').checked;

  return rawData.filter(d =>
    d.edad === null
      ? includeNulls
      : selectedAges.includes(d.edad)
  );
}
