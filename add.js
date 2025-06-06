import { basisCitaten } from "./citaten.js";
localStorage.setItem('opgeslagenCitaten', JSON.stringify (basisCitaten));


document.querySelector('form.add').addEventListener('submit', (event) => {
    event.preventDefault();
    voegToe();
  });

  function voegToe() {
    // Haal waarden op
    const titel = document.getElementById('titel').value.trim();
    const beschrijving = document.getElementById('beschrijving').value.trim();
    const prijs = document.getElementById('prijs').value.trim();
  
    // Eenvoudige validatie
    if (!titel || !beschrijving|| !prijs) {
      alert('Vul alle velden in!');
      return;
    }
  
    // Voorbeeld: gegevens opslaan in localStorage
    const citaten = JSON.parse(localStorage.getItem('opgeslagenCitaten') || '[]');
    citaten.push({ titel, beschrijving, prijs });
    localStorage.setItem('opgeslagenCitaten', JSON.stringify(citaten));

  
    alert('Citaat toegevoegd!');
    // Optioneel: formulier resetten
    document.querySelector('form.add').reset();
    window.location.href = 'index.html';
  }

  function updateStatistieken() {
    const prijzen = alleCitaten.map(cit => parseFloat(cit.prijs));
  
    if (prijzen.length === 0) {
      document.getElementById('totaal').textContent = 'Aantal ijsjes: 0';
      document.getElementById('gemiddelde').textContent = 'Gemiddelde prijs: €0';
      document.getElementById('duurste').textContent = 'Duurste ijsje: €0';
      document.getElementById('goedkoopste').textContent = 'Goedkoopste ijsje: €0';
      return;
    }
  
    const totaal = prijzen.length;
    const som = prijzen.reduce((acc, curr) => acc + curr, 0);
    const gemiddelde = (som / totaal).toFixed(2);
    const duurste = Math.max(...prijzen);
    const goedkoopste = Math.min(...prijzen);
  
    document.getElementById('totaal').textContent = `Aantal ijsjes: ${totaal}`;
    document.getElementById('gemiddelde').textContent = `Gemiddelde prijs: €${gemiddelde}`;
    document.getElementById('duurste').textContent = `Duurste ijsje: €${duurste}`;
    document.getElementById('goedkoopste').textContent = `Goedkoopste ijsje: €${goedkoopste}`;
  }
  
  

 