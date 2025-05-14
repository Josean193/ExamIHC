// Ejemplo de datos estáticos; más adelante vendrán de un API
const cuentosDestacados = [
    { id: 1, titulo: 'La liebre y la tortuga', tipo: 'tradicional', img: 'assets/img/liebre.jpg' },
    { id: 2, titulo: 'La aventura espacial', tipo: 'ia', img: 'assets/img/espacial.jpg' },
  ];
  
  function renderDestacados() {
    const cont = document.getElementById('destacados-lista');
    cuentosDestacados.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${c.img}" alt="${c.titulo}" />
        <h3>${c.titulo}</h3>
        <a href="cuentos.html?tipo=${c.tipo}">Ver más</a>
      `;
      cont.appendChild(card);
    });
  }
  
  document.addEventListener('DOMContentLoaded', renderDestacados);
  