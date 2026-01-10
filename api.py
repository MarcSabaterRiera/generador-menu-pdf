from flask import Flask, render_template, request, redirect, url_for
from services.menu_service import MenuService

app = Flask(__name__)
menu_service = MenuService()

# Middleware para simular PUT y DELETE desde POST
@app.before_request
def handle_method_override():
    if request.method == 'POST' and '_method' in request.form:
        method = request.form['_method'].upper()
        if method in ['PUT', 'DELETE']:
            request.environ['REQUEST_METHOD'] = method

# Render HTML Endpoints

# Render home page
@app.route("/", methods=["GET"])
def index():
    menus = menu_service.get_all_menus()
    return render_template("index.html", menus=menus)

# Render new-menu page
@app.route("/menu/new", methods=["GET"])
def get_menu_page():
    return render_template("menu_form.html", menu=None)

# Render menu view page
@app.route("/menu/view/<menu_name>", methods=["GET"])
def view_menu_page(menu_name):
    menu = menu_service.get_menu(menu_name)
    return render_template("menu_view.html", menu=menu)

# Render menu edit page
@app.route("/menu/edit/<menu_name>", methods=["GET"])
def edit_menu_page(menu_name):
    menu = menu_service.get_menu(menu_name)
    return render_template("menu_form.html", menu=menu)

# Create/Update data endpoints

# Create new menu
@app.route("/menu/new", methods=["POST"])
def create_menu():
    menu_service.create_menu(request.form)
    return redirect(url_for("index"))


# Update current menu
@app.route("/menu/edit/<menu_name>", methods=["POST", "PUT"])
def edit_menu(menu_name):
    menu_service.update_menu(menu_name, request.form)
    return redirect(url_for("index"))

# Delete data endpoints

# Delete menu
@app.route("/menu/delete/<menu_name>", methods=["POST", "DELETE"])
def delete_menu(menu_name):
    menu_service.delete_menu(menu_name)
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(port=5000, debug=True)