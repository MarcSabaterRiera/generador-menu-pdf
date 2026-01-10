import json
import os

DATA_PATH = "data"


class MenuRepository:
    def __init__(self):
        os.makedirs(DATA_PATH, exist_ok=True)

    def list_menus_with_metadata(self):
        menus = []
        for file in os.listdir(DATA_PATH):
            if file.startswith("menu_"):
                with open(os.path.join(DATA_PATH, file), encoding="utf-8") as f:
                    data = json.load(f)
                    menus.append({
                        "name": data["name"],
                        "created_at": data["created_at"]
                    })
        return menus

    def load_menu(self, name):
        with open(self._path(name), encoding="utf-8") as f:
            return json.load(f)

    def save_menu(self, name, data):
        with open(self._path(name), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    def delete_menu(self, name):
        path = self._path(name)
        if os.path.exists(path):
            os.remove(path)

    def _path(self, name):
        return os.path.join(DATA_PATH, f"menu_{name}.json")
