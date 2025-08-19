document.getElementById('sanierungsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "<p>Berechne Förderungen...</p>";

    // Daten sammeln
    const formData = {
        baujahr: document.getElementById('baujahr').value,
        wohnflaeche: document.getElementById('wohnflaeche').value,
        investition: document.getElementById('investition').value,
        plz: document.getElementById('plz').value,
        massnahmen: [
            ...document.querySelectorAll('input[type="checkbox"]:checked')
        ].map(el => el.value),
        file: document.getElementById('fileUpload').files[0]
    };

    // Datei hochladen (falls vorhanden)
    let fileData = null;
    if (formData.file) {
        fileData = await readFileAsBase64(formData.file);
    }

    // Daten an Netlify Function senden
    const response = await fetch('/.netlify/functions/foerdercheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, file: fileData })
    });
    const result = await response.json();

    // Ergebnisse anzeigen
    resultsDiv.innerHTML = `
        <h3>Ihre Fördermöglichkeiten (Stand 2025):</h3>
        <table>
            <tr><th>Programm</th><th>Förderart</th><th>Höhe</th><th>Maximaler Betrag</th></tr>
            ${result.foerderungen.map(f => `
                <tr>
                    <td>${f.programm}</td>
                    <td>${f.art}</td>
                    <td>${f.hoehe}</td>
                    <td>${f.maxBetrag} €</td>
                </tr>
            `).join('')}
        </table>
        <p><strong>Gesamtförderung:</strong> ${result.gesamtFoerderung} € (${result.prozent}% der Investition)</p>
        ${result.pdfLink ? `<a href="${result.pdfLink}" download class="button">Sanierungsplan herunterladen (PDF)</a>` : ''}
    `;
});

// Hilfsfunktion für Datei-Upload
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
