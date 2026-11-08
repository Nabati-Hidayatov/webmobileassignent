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

createVenue();
