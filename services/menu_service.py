from datetime import datetime
from repositories.menu_repository import MenuRepository


class MenuService:
    def __init__(self):
        self.repository = MenuRepository()

    def get_all_menus(self):
        return self.repository.list_menus_with_metadata()

    def get_menu(self, name):
        return self.repository.load_menu(name)

    def create_menu(self, form_data):
        menu = {
            "name": form_data["name"],
            "created_at": datetime.now().strftime("%d/%m/%y"),
            "sections": self._parse_sections(form_data)
        }
        self.repository.save_menu(menu["name"], menu)

    def update_menu(self, name, form_data):
        existing = self.repository.load_menu(name)
        existing["sections"] = self._parse_sections(form_data)
        self.repository.save_menu(name, existing)

    def delete_menu(self, name):
        self.repository.delete_menu(name)

    def _parse_sections(self, form_data):
        """
        Parse sections from form data.
        Sections are sent as section_name_{index} and section_items_{index}
        """
        sections = []
        index = 0

        while f"section_name_{index}" in form_data:
            section_name = form_data[f"section_name_{index}"].strip()
            section_items_raw = form_data.get(f"section_items_{index}", "")
            
            # Filter out empty lines and strip whitespace
            section_dishes = [
                item.strip() 
                for item in section_items_raw.splitlines() 
                if item.strip()
            ]
            
            # Only add section if it has a name
            if section_name:
                sections.append({
                    "name": section_name,
                    "dishes": section_dishes
                })
            
            index += 1

        return sections