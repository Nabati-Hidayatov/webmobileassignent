const venueSections = [
  { id: 'orchestra', name: 'Orchestra', price: 68, rows: ['A', 'B', 'C', 'D', 'E'], seatsPerRow: 10, unavailable: ['A-04', 'C-08', 'E-02'] },
  { id: 'mezzanine', name: 'Mezzanine', price: 48, rows: ['F', 'G', 'H'], seatsPerRow: 8, unavailable: ['F-06', 'H-01'] },
  { id: 'balcony', name: 'Balcony', price: 32, rows: ['J', 'K'], seatsPerRow: 8, unavailable: ['J-03'] }
];

const sectionsRoot = document.querySelector('#sections-root');
const seats = [];
function createVenue() {
  venueSections.forEach(section => {
    const sectionElement = document.createElement('section');
    sectionElement.className = `venue-section ${section.id}`;
    const heading = document.createElement('div');
    heading.className = 'section-heading';
    heading.innerHTML = `<span>${section.name}</span><span>$${section.price}</span>`;
    sectionElement.append(heading);
    const rowsContainer = document.createElement('div');
    rowsContainer.className = 'seat-rows';
    section.rows.forEach(rowName => {
      const rowElement = document.createElement('div');
      rowElement.className = 'seat-row';
      rowElement.setAttribute('aria-label', `Row ${rowName}`);
      for (let number = 1; number <= section.seatsPerRow; number += 1) {
        const seatNumber = String(number).padStart(2, '0');
        const seatCode = `${rowName}-${seatNumber}`;
        const seat = { id: `${section.id}-${seatCode}`, sectionName: section.name, row: rowName, number, price: section.price, unavailable: section.unavailable.includes(seatCode) };
        seats.push(seat);
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'seat'; button.textContent = seatNumber; button.dataset.seatId = seat.id;
        button.setAttribute('aria-label', `${section.name}, row ${rowName}, seat ${seatNumber}${seat.unavailable ? ', unavailable' : ', available'}`);
        if (seat.unavailable) { button.classList.add('is-unavailable'); }
        rowElement.append(button);
      }
      rowsContainer.append(rowElement);
    });
    sectionElement.append(rowsContainer);
    sectionsRoot.append(sectionElement);
  });
}

let inspectedSeatId = null;
let cartSeatIds = [];
const detailHeading = document.querySelector('#detail-heading');
const seatDetail = document.querySelector('#seat-detail');
const unavailableMessage = document.querySelector('#unavailable-message');
const addSeatButton = document.querySelector('#add-seat');
function inspectSeat(seatId) {
  const seat = seats.find(item => item.id === seatId);
  if (!seat) return;
  inspectedSeatId = seat.id;
  detailHeading.textContent = seat.unavailable ? 'Seat unavailable' : 'Seat inspected';
  unavailableMessage.hidden = !seat.unavailable;
  seatDetail.hidden = seat.unavailable;
  if (!seat.unavailable) {
    document.querySelector('#detail-section').textContent = seat.sectionName;
    document.querySelector('#detail-location').textContent = `Row ${seat.row} · Seat ${String(seat.number).padStart(2, '0')}`;
    document.querySelector('#detail-price').textContent = `$${seat.price.toFixed(2)}`;
  }
  addSeatButton.disabled = seat.unavailable || cartSeatIds.includes(seat.id);
  updateSeatStates();
}
function updateSeatStates() {
  document.querySelectorAll('.seat').forEach(button => {
    const seat = seats.find(item => item.id === button.dataset.seatId);
    if (!seat) return;
    button.classList.toggle('is-inspected', inspectedSeatId === seat.id && !seat.unavailable && !cartSeatIds.includes(seat.id));
    button.classList.toggle('is-in-cart', cartSeatIds.includes(seat.id));
  });
}
sectionsRoot.addEventListener('click', event => {
  const button = event.target.closest('.seat');
  if (button && !button.disabled) inspectSeat(button.dataset.seatId);
});

const venueLayout = document.querySelector('#venue-layout');
let mapScale = 1, mapX = 0, mapY = 0;
function updateMap() {
  venueLayout.style.setProperty('--zoom', mapScale);
  venueLayout.style.setProperty('--pan-x', `${mapX}px`);
  venueLayout.style.setProperty('--pan-y', `${mapY}px`);
}
function moveMap(direction) {
  if (direction === 'up') mapY += 34;
  if (direction === 'down') mapY -= 34;
  if (direction === 'left') mapX += 34;
  if (direction === 'right') mapX -= 34;
  mapX = Math.max(-220, Math.min(220, mapX)); mapY = Math.max(-220, Math.min(220, mapY)); updateMap();
}
function changeZoom(amount) { mapScale = Math.max(.7, Math.min(1.55, mapScale + amount)); updateMap(); }
document.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => moveMap(button.dataset.move)));
document.querySelector('[data-zoom="in"]').addEventListener('click', () => changeZoom(.1));
document.querySelector('[data-zoom="out"]').addEventListener('click', () => changeZoom(-.1));
document.querySelector('#reset-view').addEventListener('click', () => { mapScale = 1; mapX = 0; mapY = 0; updateMap(); });

const cartList = document.querySelector('#cart-list');
const cartTotal = document.querySelector('#cart-total');
function renderCart() {
  cartList.innerHTML = ''; let total = 0;
  cartSeatIds.forEach(seatId => {
    const seat = seats.find(item => item.id === seatId); if (!seat) return;
    total += seat.price;
    const item = document.createElement('li');
    item.textContent = `${seat.sectionName}, row ${seat.row}, seat ${String(seat.number).padStart(2, '0')} — $${seat.price.toFixed(2)}`;
    const removeButton = document.createElement('button');
    removeButton.type = 'button'; removeButton.className = 'remove-ticket'; removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeSeat(seatId));
    item.append(removeButton);
    cartList.append(item);
  });
  cartTotal.textContent = `$${total.toFixed(2)}`;
  document.querySelector('#empty-cart').hidden = cartSeatIds.length > 0;
  document.querySelector('#header-count').textContent = String(cartSeatIds.length);
  updateSeatStates();
}
function addSeat() {
  const seat = seats.find(item => item.id === inspectedSeatId);
  if (!seat || seat.unavailable || cartSeatIds.includes(seat.id)) return;
  cartSeatIds.push(seat.id); renderCart(); inspectSeat(seat.id);
}
addSeatButton.addEventListener('click', addSeat);

function removeSeat(seatId) {
  cartSeatIds = cartSeatIds.filter(id => id !== seatId);
  renderCart();
  if (inspectedSeatId === seatId) inspectSeat(seatId);
}

createVenue();
renderCart();
updateMap();
