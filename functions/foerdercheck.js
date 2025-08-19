const axios = require('axios');

exports.handler = async (event) => {
  try {
    // Mock-Daten für Tests
    const mockResponse = {
      foerderungen: [
        { programm: "KfW 455", art: "Zuschuss", hoehe: "30%", maxBetrag: 30000 },
        { programm: "BAFA-BEG-EM", art: "Zuschuss", hoehe: "20%", maxBetrag: 20000 }
      ],
      gesamtFoerderung: 50000,
      prozent: 50
    };

    // Falls ein API-Key vorhanden ist, nutze die echte Mistral-API
    if (process.env.LE_CHAT_API_KEY) {
      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          model: 'mistral-tiny',
          messages: [{ role: 'user', content: 'Berechne Förderungen für ein Gebäude mit folgenden Daten: Baujahr: vor 1978, Wohnfläche: 100 m², Investition: 30000 €.' }]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.LE_CHAT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return {
        statusCode: 200,
        body: JSON.stringify(response.data)
      };
    } else {
      // Nutze Mock-Daten, falls kein API-Key vorhanden ist
      return {
        statusCode: 200,
        body: JSON.stringify(mockResponse)
      };
    }
  } catch (error) {
    console.error("Fehler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ein Fehler ist aufgetreten: " + error.message })
    };
  }
};
