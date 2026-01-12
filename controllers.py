from flask import render_template, request, redirect, url_for, jsonify
from services.menu_service import MenuService
from services.pdf_service import PDFService
import logging

logger = logging.getLogger(__name__)
menu_service = MenuService()
pdf_service = PDFService()


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
    # PDF EXPORT ENDPOINTS
    # ==========================================

    @app.route("/menu/export/<menu_name>", methods=["GET"])
    def export_menu_page(menu_name):
        """Muestra la página de exportación con selector de plantilla"""
        menu = menu_service.get_menu(menu_name)
        if not menu:
            from werkzeug.exceptions import NotFound
            raise NotFound(f"El menú '{menu_name}' no existe")
        
        # Obtener lista de plantillas disponibles
        templates = pdf_service.get_available_templates()
        
        return render_template("menu_export.html", menu=menu, templates=templates)

    @app.route("/menu/preview/<menu_name>/<template_id>", methods=["GET"])
    def preview_pdf(menu_name, template_id):
        """Genera y devuelve la previsualización HTML del PDF"""
        try:
            menu = menu_service.get_menu(menu_name)
            if not menu:
                return jsonify({"error": "Menú no encontrado"}), 404
            
            # Generar HTML de previsualización
            preview_html = pdf_service.generate_preview(menu, template_id)
            
            return preview_html
        except Exception as e:
            logger.error(f"Error al generar previsualización: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route("/menu/generate-pdf/<menu_name>/<template_id>", methods=["POST"])
    def generate_pdf(menu_name, template_id):
        """Genera y descarga el PDF del menú"""
        try:
            menu = menu_service.get_menu(menu_name)
            if not menu:
                from werkzeug.exceptions import NotFound
                raise NotFound(f"El menú '{menu_name}' no existe")
            
            # Generar PDF
            pdf_file = pdf_service.generate_pdf(menu, template_id)
            
            return pdf_file
        except Exception as e:
            logger.error(f"Error al generar PDF: {str(e)}")
            raise

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