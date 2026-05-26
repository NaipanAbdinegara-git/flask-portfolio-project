from flask import Flask, render_template, request
import json, os

app = Flask(__name__, 
            template_folder=os.path.join(os.path.dirname(__file__), 'templates'),
            static_folder=os.path.join(os.path.dirname(__file__), 'static'))

def load_project():
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_path, "projects.json")
        
        with open(file_path, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: projects.json not found in {base_path}")
        return {}
    except json.JSONDecodeError:
        print("Error: projects.json has invalid format")
        return {}

@app.route("/")
def main():
    return render_template("main.html")

@app.route('/projects')
def projects():
    all_projects = load_project()
    if request.args.get('ajax') == '1':
        return render_template('projects_fragment.html', projects=all_projects)
    return render_template('projects.html', projects=all_projects)

@app.route("/projects/<project_name>")
def project_detail(project_name):
    projects = load_project()
    if project_name in projects:
        return render_template("project_detail.html", project=projects[project_name])
    else:
        return render_template("404.html"), 404
    
@app.route("/about")
def about():
    if request.args.get('ajax') == '1':
        return render_template('about_fragment.html')
    return render_template('about.html')
    
@app.route("/<path:notfound>")
def notfound(notfound):
    return render_template("404.html"), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template("404.html"), 500

@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=False)
