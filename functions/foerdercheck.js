const mistralai = require('mistralai');

exports.handler = async (event) => {
    // Le Chat API-Konfiguration
    const client = new mistralai.Client(process.env.LE_CHAT_API_KEY);

    // Daten aus dem Frontend
    const data = JSON.parse(event.body);

    // Prompt für Le Chat
    const prompt = `
    Berechne die Förderungen für ein Gebäude in Deutschland (Stand 2025) mit folgenden Daten:
    - Baujahr: ${data.baujahr}
    - Wohnfläche: ${data.wohnflaeche} m²
    - Investition: ${data.investition} €
    - PLZ: ${data.plz}
    - Maßnahmen: ${data.massnahmen.join(', ')}
    ${data.file ? '- Anhang: Stromrechnung/Bauplan (Base64-encoded)' : ''}

    Berücksichtige aktuelle KfW-, BAFA- und lokale Förderprogramme.
    Gib das Ergebnis als JSON zurück mit:
    - Liste der Förderprogramme (Name, Art, Höhe in %, max. Betrag in €)
    - Gesamtförderung (€ und % der Investition)
    - Optional: Link zu einem PDF-Sanierungsplan.
    `;

    try {
        // Le Chat API aufrufen
        const response = await client.chat({
            model: 'mistral-large-latest',
            messages: [{ role: 'user', content: prompt }]
        });

        // Antwort parsen (Beispiel)
        const result = {
            foerderungen: [
                { programm: "KfW 455", art: "Zuschuss", hoehe: "30%", maxBetrag: 30000 },
                { programm: "BAFA-BEG-EM", art: "Zuschuss", hoehe: "20%", maxBetrag: 20000 },
                { programm: "Kommunalbonus München", art: "Zuschuss", hoehe: "10%", maxBetrag: 5000 }
            ],
            gesamtFoerderung: 55000,
            prozent: 55,
            pdfLink: "/sanierungsplan.pdf"  // Wird in Schritt 4 generiert
        };

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Fehler bei der Berechnung" })
        };
    }
};
