const todosCuentos = [
    {
      id: 1,
      titulo: 'La tortuga y la liebre',
      tipo: 'tradicional',
      descripcion: 'Una fábula sobre la constancia...',
      img: 'assets/img/liebre.jpg'
    },
    {
      id: 2,
      titulo: 'La aventura espacial',
      tipo: 'ia',
      descripcion: 'Un viaje fuera de este mundo...',
      img: 'assets/img/cuento2.jpg'
    },
    {
      id: 3,
      titulo: 'El bosque mágico',
      tipo: 'ia',
      descripcion: 'Descubre criaturas encantadas...',
      img: 'assets/img/cuento3.jpg'
    }
  ];
  
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  
  function renderCuentos(filter) {
    const contenedor = document.getElementById('lista-cuentos');
    contenedor.innerHTML = '';
  
    const cuentosFiltrados = filter && filter !== 'todos'
      ? todosCuentos.filter(c => c.tipo === filter)
      : todosCuentos;
  
    cuentosFiltrados.forEach(cuento => {
      const card = document.createElement('div');
      card.className = 'story-card';
      card.innerHTML = `
        <img src="${cuento.img}" alt="${cuento.titulo}">
        <div class="card-content">
          <h2>${cuento.titulo}</h2>
          <p>${cuento.descripcion}</p>
          <a class="btn-leer" href="conejo.html">Leer</a>
        </div>
      `;
      contenedor.appendChild(card);
    });
  }
  
  function leer(id) {
    alert(`Abriendo cuento con ID ${id}`);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const tipo = getQueryParam('tipo') || 'todos';
    renderCuentos(tipo);
  
    document.querySelectorAll('#filtros button').forEach(btn => {
      btn.addEventListener('click', () => {
        renderCuentos(btn.dataset.tipo);
      });
    });
  });
  