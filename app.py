from flask import Flask, render_template, request, jsonify
import os
import logging
from datetime import datetime

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = 'shopsouzza-secret-key-2024'

# Mapeamento de scrapers disponíveis
SCRAPERS = {
    'netshoes': {
        'name': 'Netshoes',
        'description': 'Extrai produtos individuais da Netshoes',
        'icon': '👟',
        'color': '#FF6B00'
    },
    'amazon': {
        'name': 'Amazon',
        'description': 'Extrai produtos por categoria da Amazon',
        'icon': '📦',
        'color': '#FF9900'
    },
    'boticario': {
        'name': 'O Boticário',
        'description': 'Extrai produtos do Boticário com ciclo',
        'icon': '💄',
        'color': '#E91E63'
    },
    'magalu': {
        'name': 'Magazine Luiza',
        'description': 'Extrai produtos do Magalu por seção',
        'icon': '🛍️',
        'color': '#00A859'
    },
    'mercadolivre': {
        'name': 'Mercado Livre',
        'description': 'Extrai produtos do Mercado Livre',
        'icon': '🛒',
        'color': '#FFF159'
    }
}

@app.route('/')
def index():
    return render_template('index.html', scrapers=SCRAPERS)

@app.route('/api/scrapers')
def get_scrapers():
    return jsonify(SCRAPERS)

@app.route('/api/execute', methods=['POST'])
def execute_scraper():
    data = request.json
    scraper_id = data.get('scraper_id')
    
    if not scraper_id or scraper_id not in SCRAPERS:
        return jsonify({'error': 'Scraper não encontrado'}), 404
    
    scraper_name = SCRAPERS[scraper_id]['name']
    
    return jsonify({
        'status': 'success',
        'message': f'✅ {scraper_name} iniciado! Em breve versão completa com extração real!',
        'progress': 100
    })

@app.route('/api/upload-scraper', methods=['POST'])
def upload_scraper():
    return jsonify({
        'success': True,
        'message': '✅ Sistema de upload preparado! Em breve versão completa.'
    })

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy', 
        'service': 'ShopsouzzaScraper',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    # Criar diretórios necessários
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('scrapers', exist_ok=True)
    os.makedirs('uploads', exist_ok=True)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
