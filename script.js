// Haal citaten op uit localStorage, of lege array als er nog niets is
let alleCitaten = JSON.parse(localStorage.getItem('opgeslagenCitaten') || '[]');

const update = new CustomEvent('citatenUpdate');
const citatenSectie = document.querySelector('section.citaten');

function voegCitaatToe(cit) {
    if (!cit.prijs.includes('euro')) {
        cit.prijs += ' euro';
    }
    const citaatArtikel = document.createElement('article');
    citaatArtikel.innerHTML = `
        <img class="delete" src="./img/bin.png" alt="delete">
        <button class="edit-btn">Edit</button>
        

        <h2>${cit.titel || ''}</h2><p>${cit.beschrijving || ''}</p><p class="ijskost">${cit.prijs || ''}</p>
       

    `;
    citaatArtikel.classList.add(`${cit.taal}`);
    citatenSectie.appendChild(citaatArtikel);

    // Delete event
    citaatArtikel.querySelector('img.delete').addEventListener('click', () => {
        verwijderCitaat(cit.titel, citaatArtikel);
    });

    // Edit event
    citaatArtikel.querySelector('.edit-btn').addEventListener('click', () => {
        startBewerken(cit, citaatArtikel);
    });
}

// Toon alle citaten op pagina
function toonAlleCitaten() {
    citatenSectie.innerHTML = ''; // Eerst leegmaken
    if (alleCitaten.length === 0) {
        document.getElementById('geencitaten').style.display = 'block';
    } else {
        document.getElementById('geencitaten').style.display = 'none';
        alleCitaten.forEach(cit => voegCitaatToe(cit));
    }
    updateStatistieken();
}

toonAlleCitaten();

function verwijderCitaat(verwijderTitel, artikelElement) {
    const plaats = alleCitaten.findIndex(cit => cit.titel === verwijderTitel);
    if (plaats !== -1) {
        alleCitaten.splice(plaats, 1);
        localStorage.setItem('opgeslagenCitaten', JSON.stringify(alleCitaten)); // Opslaan!
        artikelElement.remove();

        toonAlleCitaten(); // Optioneel opnieuw tonen
        citatenSectie.dispatchEvent(new CustomEvent('citatenUpdate'));
    }
}



function voegToe() {
  const titel = document.querySelector('#title').value.trim();
  const beschrijving = document.querySelector('#beschrijving').value.trim();
  let prijs = document.querySelector('#prijs').value.trim();

  const alleenLetters = /^[A-Za-zÀ-ÿ\s]+$/;
  const alleenCijfers = /^\d+$/;

  const foutmelding = 
    !titel || !alleenLetters.test(titel) ? 'Titel mag alleen letters en spaties bevatten' :
    !beschrijving || !alleenLetters.test(beschrijving) ? 'Tekst mag alleen letters en spaties bevatten' :
    !prijs || !alleenCijfers.test(prijs) ? 'Prijs moet alleen uit cijfers bestaan' :
    null;

  if (foutmelding) return toonMelding('error', foutmelding);

  const nieuwCitaat = { titel, beschrijving, prijs, taal: 'nl' };
  alleCitaten.push(nieuwCitaat);
  voegCitaatToe(nieuwCitaat);

  // **Belangrijk: update localStorage**
  localStorage.setItem('opgeslagenCitaten', JSON.stringify(alleCitaten));

  document.querySelector('#title').value = '';
  document.querySelector('#beschrijving').value = '';
  document.querySelector('#prijs').value = '';

  toonMelding('succes', 'Nieuw veld toegevoegd');
  document.querySelector('section.citaten').dispatchEvent(update);
}


function toonMelding(soort, melding) {
    document.querySelector('#feedback').innerHTML = `<p class="${soort}">${melding}</p>`;
}

function startBewerken(cit, artikel) {
    artikel.innerHTML = `
        <input type="text" name="titel" value="${cit.titel}">
        <input type="text" name="beschrijving" value="${cit.beschrijving}">
        <input type="text" name="prijs" value="${cit.prijs.replace(' euro', '')}">
        <button class="save-btn">Opslaan</button>
        <button class="cancel-btn">Annuleer</button>
    `;

    artikel.querySelector('.cancel-btn').addEventListener('click', () => {
        artikel.remove();
        voegCitaatToe(cit);
    });

    artikel.querySelector('.save-btn').addEventListener('click', () => {
        const nieuweTitel = artikel.querySelector('input[name=titel]').value.trim();
        const nieuweBeschrijving = artikel.querySelector('input[name=beschrijving]').value.trim();
        let nieuwePrijs = artikel.querySelector('input[name=prijs]').value.trim();

        const alleenLetters = /^[A-Za-zÀ-ÿ\s]+$/;
        const alleenCijfers = /^\d+$/;

        if (!nieuweTitel || !alleenLetters.test(nieuweTitel)) return toonMelding('error', 'Titel mag alleen letters en spaties bevatten');
        if (!nieuweBeschrijving || !alleenLetters.test(nieuweBeschrijving)) return toonMelding('error', 'Text mag alleen letters en spaties bevatten');
        if (!nieuwePrijs || !alleenCijfers.test(nieuwePrijs)) return toonMelding('error', 'Prijs moet alleen uit cijfers bestaan');

        nieuwePrijs += ' euro';

        // Update in array
        const index = alleCitaten.findIndex(c => c.titel === cit.titel);
        if (index !== -1) {
            alleCitaten[index] = { titel: nieuweTitel, beschrijving: nieuweBeschrijving, prijs: nieuwePrijs, taal: 'nl' };
            localStorage.setItem('opgeslagenCitaten', JSON.stringify(alleCitaten)); // Opslaan!
        }

        artikel.remove();
        toonAlleCitaten();
        toonMelding('succes', 'Citaat bijgewerkt');
        citatenSectie.dispatchEvent(update);
    });
}

function updateStatistieken() {
    const prijzen = alleCitaten.map(c => parseFloat(c.prijs));
    if (prijzen.length === 0) {
      document.getElementById('totaal').textContent = 'Geen ijsjes';
      document.getElementById('gemiddelde').textContent = '';
      document.getElementById('duurste').textContent = '';
      document.getElementById('goedkoopste').textContent = '';
      return;
    }
  
    const totaal = prijzen.length;
    const som = prijzen.reduce((acc, val) => acc + val, 0);
    const gemiddelde = (som / totaal).toFixed(2);
    const duurste = Math.max(...prijzen);
    const goedkoopste = Math.min(...prijzen);
  
    document.getElementById('totaal').textContent = `Aantal ijsjes: ${totaal}`;
    document.getElementById('gemiddelde').textContent = `Gemiddelde prijs: €${gemiddelde}`;
    document.getElementById('duurste').textContent = `Duurste ijsje: €${duurste}`;
    document.getElementById('goedkoopste').textContent = `Goedkoopste ijsje: €${goedkoopste}`;
  }
  

/* Kleur Titel */
const h1Titel = document.querySelector('h1');
h1Titel.addEventListener('click', () => {
    const rood = Math.round(Math.random() * 255);
    const groen = Math.round(Math.random() * 255);
    const zwart = Math.round(Math.random() * 255);
    h1Titel.style.color = `rgb(${rood},${groen},${zwart})`;
});

/* Element verwijderen */
document.getElementById('geencitaten').style.display = alleCitaten.length === 0 ? 'block' : 'none';

/* Footer */
document.body.insertAdjacentHTML('beforeend', '<footer><p>&copy;2025 - Leuventje</p></footer>');
