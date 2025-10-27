from flask import Flask, render_template, jsonify, abort, send_from_directory
import json
import os

app = Flask(__name__)

# Configuration
DASHBOARD_JSON_PATH = os.path.join('dashboards', 'dashboard.json')
DATASETS_FOLDER = os.path.join('dashboards', 'datasets')
PBIX_FOLDER = os.path.join('dashboards', 'pbix_files')

# Create folders if they don't exist
os.makedirs(DATASETS_FOLDER, exist_ok=True)
os.makedirs(PBIX_FOLDER, exist_ok=True)

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

@app.route('/download/dataset/<dashboard_id>')
@app.route('/download/dataset/<dashboard_id>/<int:file_index>')
def download_dataset(dashboard_id, file_index=0):
    """Download dataset file for a specific dashboard"""
    dashboards = load_dashboards()
    
    # Find the dashboard
    dashboard = None
    for dash in dashboards:
        if dash.get('id') == dashboard_id:
            dashboard = dash
            break
    
    if not dashboard:
        abort(404)
    
    # Handle multiple dataset files
    if 'dataset_files' in dashboard:
        dataset_files = dashboard['dataset_files']
        if file_index >= len(dataset_files):
            abort(404)
        filepath = dataset_files[file_index]['file']
    elif 'dataset_file' in dashboard:
        # Backward compatibility with single file
        filepath = dashboard['dataset_file']
    else:
        abort(404)
    
    # Check if it's an absolute path
    if os.path.isabs(filepath):
        # Absolute path provided
        if not os.path.exists(filepath):
            abort(404)
        directory = os.path.dirname(filepath)
        filename = os.path.basename(filepath)
        return send_from_directory(directory, filename, as_attachment=True)
    else:
        # Relative path (filename only)
        file_path = os.path.join(DATASETS_FOLDER, filepath)
        if not os.path.exists(file_path):
            abort(404)
        return send_from_directory(DATASETS_FOLDER, filepath, as_attachment=True)

@app.route('/download/pbix/<dashboard_id>')
def download_pbix(dashboard_id):
    """Download PBIX file for a specific dashboard"""
    dashboards = load_dashboards()
    
    # Find the dashboard
    dashboard = None
    for dash in dashboards:
        if dash.get('id') == dashboard_id:
            dashboard = dash
            break
    
    if not dashboard or 'pbix_file' not in dashboard:
        abort(404)
    
    filepath = dashboard['pbix_file']
    
    # Check if it's an absolute path
    if os.path.isabs(filepath):
        # Absolute path provided
        if not os.path.exists(filepath):
            abort(404)
        directory = os.path.dirname(filepath)
        filename = os.path.basename(filepath)
        return send_from_directory(directory, filename, as_attachment=True)
    else:
        # Relative path (filename only)
        file_path = os.path.join(PBIX_FOLDER, filepath)
        if not os.path.exists(file_path):
            abort(404)
        return send_from_directory(PBIX_FOLDER, filepath, as_attachment=True)

@app.errorhandler(404)
def page_not_found(e):
    """Custom 404 error page"""
    return render_template('index.html', dashboards=load_dashboards(), error="Dashboard not found"), 404

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)