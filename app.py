from flask import Flask, render_template
import json

app = Flask(__name__)

def load_project():
    with open("projects.json", "r") as file:
        return json.load(file)

@app.route("/")
def main():
    return render_template("main.html")

@app.route('/projects')
def projects():
    all_projects = load_project()
    return render_template('projects.html', projects=all_projects)

# Ganti nama fungsi jadi project_detail biar gak BuildError
@app.route("/projects/<project_name>")
def project_detail(project_name):
    projects = load_project()
    if project_name in projects:
        # Kirim data project spesifik ke template
        return render_template("project_detail.html", project=projects[project_name])
    else:
        return render_template("404.html")
    
@app.route("/about")
def about():
    return render_template("about.html")
    
@app.route("/<path:notfound>")
def notfound(notfound):
    return render_template("404.html")

if __name__ == "__main__":
    app.run(debug=True)