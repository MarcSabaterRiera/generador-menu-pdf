from flask import render_template, request, redirect, url_for
from services.menu_service import MenuService
import logging

logger = logging.getLogger(__name__)
menu_service = MenuService()


def register_controllers(app):

    # ==========================================
    # RENDER HTML ENDPOINTS
    # ==========================================

    @app.route("/", methods=["GET"])
    def index():
        menus = menu_service.get_all_menus()
        return render_template("index.html", menus=menus)

    @app.route("/menu/new", methods=["GET"])
    def get_menu_page():
        return render_template("menu_form.html", menu=None)

    @app.route("/menu/view/<menu_name>", methods=["GET"])
    def view_menu_page(menu_name):
        menu = menu_service.get_menu(menu_name)
        if not menu:
            from werkzeug.exceptions import NotFound
            raise NotFound(f"El menú '{menu_name}' no existe")
        return render_template("menu_view.html", menu=menu)

    @app.route("/menu/edit/<menu_name>", methods=["GET"])
    def edit_menu_page(menu_name):
        menu = menu_service.get_menu(menu_name)
        if not menu:
            from werkzeug.exceptions import NotFound
            raise NotFound(f"El menú '{menu_name}' no existe")
        return render_template("menu_form.html", menu=menu)

    # ==========================================
    # CREATE / UPDATE DATA ENDPOINTS
    # ==========================================

    @app.route("/menu/new", methods=["POST"])
    def create_menu():
        try:
            menu_service.create_menu(request.form)
            return redirect(url_for("index"))
        except Exception as e:
            logger.error(f"Error al crear menú: {str(e)}")
            raise

    @app.route("/menu/edit/<menu_name>", methods=["POST", "PUT"])
    def edit_menu(menu_name):
        try:
            menu_service.update_menu(menu_name, request.form)
            return redirect(url_for("index"))
        except Exception as e:
            logger.error(f"Error al actualizar menú '{menu_name}': {str(e)}")
            raise

    # ==========================================
    # DELETE DATA ENDPOINTS
    # ==========================================

    @app.route("/menu/delete/<menu_name>", methods=["POST", "DELETE"])
    def delete_menu(menu_name):
        try:
            menu_service.delete_menu(menu_name)
            return redirect(url_for("index"))
        except Exception as e:
            logger.error(f"Error al eliminar menú '{menu_name}': {str(e)}")
            raise
