import json
import os
from werkzeug.exceptions import NotFound

DATA_PATH = "data"


class MenuRepository:
    def __init__(self):
        os.makedirs(DATA_PATH, exist_ok=True)

    def list_menus_with_metadata(self):
        """Lista todos los menús con sus metadatos básicos"""
        menus = []
        try:
            for file in os.listdir(DATA_PATH):
                if file.startswith("menu_") and file.endswith(".json"):
                    try:
                        with open(os.path.join(DATA_PATH, file), encoding="utf-8") as f:
                            data = json.load(f)
                            menus.append({
                                "name": data.get("name", "Sin nombre"),
                                "created_at": data.get("created_at", "Fecha desconocida")
                            })
                    except (json.JSONDecodeError, KeyError) as e:
                        # Si un archivo está corrupto, lo omitimos pero no rompemos todo
                        print(f"Error al leer {file}: {str(e)}")
                        continue
        except FileNotFoundError:
            # Si la carpeta no existe, devolver lista vacía
            pass
        
        return menus

    def load_menu(self, name):
        """Carga un menú específico por nombre"""
        path = self._path(name)
        
        if not os.path.exists(path):
            # Retornar None en lugar de lanzar excepción
            # La API decidirá si es un 404
            return None
        
        try:
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"El archivo del menú '{name}' está corrupto: {str(e)}")
        except Exception as e:
            raise IOError(f"Error al leer el menú '{name}': {str(e)}")

    def save_menu(self, name, data):
        """Guarda un menú en el sistema de archivos"""
        try:
            with open(self._path(name), "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
        except Exception as e:
            raise IOError(f"Error al guardar el menú '{name}': {str(e)}")

    def delete_menu(self, name):
        """Elimina un menú del sistema"""
        path = self._path(name)
        
        if not os.path.exists(path):
            raise NotFound(f"El menú '{name}' no existe y no se puede eliminar")
        
        try:
            os.remove(path)
        except Exception as e:
            raise IOError(f"Error al eliminar el menú '{name}': {str(e)}")

    def _path(self, name):
        """Genera la ruta del archivo para un menú dado"""
        # Sanitizar el nombre para evitar problemas de seguridad
        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_'))
        return os.path.join(DATA_PATH, f"menu_{safe_name}.json")