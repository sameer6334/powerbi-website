from flask import Flask, render_template, jsonify, abort
import json
import os

app = Flask(__name__)

# Configuration
DASHBOARD_JSON_PATH = os.path.join('dashboards', 'dashboard.json')

def load_dashboards():
    """Load dashboard data from JSON file"""
    try:
        with open(DASHBOARD_JSON_PATH, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return data.get('dashboards', [])
    except FileNotFoundError:
        print(f"Error: {DASHBOARD_JSON_PATH} not found")
        return []
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {DASHBOARD_JSON_PATH}")
        return []

@app.route('/')
def index():
    """Homepage - Display all dashboards"""
    dashboards = load_dashboards()
    return render_template('index.html', dashboards=dashboards)

@app.route('/dashboard/<dashboard_id>')
def dashboard(dashboard_id):
    """Individual dashboard page"""
    dashboards = load_dashboards()
    
    # Find the specific dashboard by ID
    selected_dashboard = None
    for dash in dashboards:
        if dash.get('id') == dashboard_id:
            selected_dashboard = dash
            break
    
    if not selected_dashboard:
        abort(404)
    
    return render_template('dashboard.html', dashboard=selected_dashboard)

@app.route('/api/dashboards')
def api_dashboards():
    """API endpoint to get all dashboards (for future use)"""
    dashboards = load_dashboards()
    return jsonify(dashboards)

@app.errorhandler(404)
def page_not_found(e):
    """Custom 404 error page"""
    return render_template('index.html', dashboards=load_dashboards(), error="Dashboard not found"), 404

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)