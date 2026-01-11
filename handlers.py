import logging
import traceback
from flask import request, render_template

# Configurar logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)


def register_middlewares(app):
    @app.before_request
    def handle_method_override():
        if request.method == 'POST' and '_method' in request.form:
            method = request.form['_method'].upper()
            if method in ['PUT', 'DELETE']:
                request.environ['REQUEST_METHOD'] = method


def register_error_handlers(app):
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('error_404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        logger.error(f"Error 500: {str(error)}")
        logger.error(traceback.format_exc())

        error_details = None
        if app.debug:
            error_details = {
                'message': str(error),
                'traceback': traceback.format_exc()
            }

        return render_template('error_500.html', error_details=error_details), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        logger.error(f"Excepción no manejada: {str(error)}")
        logger.error(traceback.format_exc())

        code = error.code if hasattr(error, 'code') else 500

        error_details = None
        if app.debug:
            error_details = {
                'message': str(error),
                'type': type(error).__name__,
                'traceback': traceback.format_exc()
            }

        return render_template('error_500.html', error_details=error_details), code
