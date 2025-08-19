from flask import Flask, request, send_file
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table
from reportlab.lib.styles import getSampleStyleSheet
import os

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_pdf():
    data = request.json
    filename = "sanierungsplan.pdf"
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Titel
    story.append(Paragraph("Individueller Sanierungsplan", styles['Title']))

    # Förderübersicht
    foerder_table = [
        ["Programm", "Art", "Höhe", "Maximaler Betrag"],
        ["KfW 455", "Zuschuss", "30%", "30.000 €"],
        ["BAFA-BEG-EM", "Zuschuss", "20%", "20.000 €"],
        ["Kommunalbonus", "Zuschuss", "10%", "5.000 €"]
    ]
    story.append(Table(foerder_table))

    # PDF speichern
    doc.build(story)
    return send_file(filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
