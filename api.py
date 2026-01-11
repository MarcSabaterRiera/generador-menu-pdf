from flask import Flask
from handlers import register_middlewares, register_error_handlers
from controllers import register_controllers

app = Flask(__name__)

# Registrar middlewares
register_middlewares(app)

# Registrar manejadores de errores
register_error_handlers(app)

# Registrar controllers
register_controllers(app)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
