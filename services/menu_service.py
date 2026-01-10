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
        Parse sections with subsections from form data.
        Structure:
        - section_name_{section_index}
        - section_description_{section_index}
        - subsection_name_{section_index}_{subsection_index}
        - subsection_description_{section_index}_{subsection_index}
        """
        sections = []
        section_index = 0

        while f"section_name_{section_index}" in form_data:
            section_name = form_data[f"section_name_{section_index}"].strip()
            section_description = form_data.get(f"section_description_{section_index}", "").strip()
            
            # Parse subsections for this section
            subsections = []
            subsection_index = 0
            
            while f"subsection_name_{section_index}_{subsection_index}" in form_data:
                subsection_name = form_data[f"subsection_name_{section_index}_{subsection_index}"].strip()
                subsection_description = form_data.get(f"subsection_description_{section_index}_{subsection_index}", "").strip()
                
                # Only add subsection if it has a name
                if subsection_name:
                    subsections.append({
                        "name": subsection_name,
                        "description": subsection_description
                    })
                
                subsection_index += 1
            
            # Only add section if it has a name
            if section_name:
                sections.append({
                    "name": section_name,
                    "description": section_description,
                    "subsections": subsections
                })
            
            section_index += 1

        return sections