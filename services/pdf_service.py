import asyncio
from flask import render_template, make_response
from playwright.async_api import async_playwright


class PDFService:

    def __init__(self):
        self.templates = {
            "modern": {
                "id": "modern", 
                "name": "Moderno Minimalista",
                "description": "Diseño limpio y contemporáneo"
            },
            "colorful": {
                "id": "colorful", 
                "name": "Colorido Vibrante",
                "description": "Lleno de vida y energía"
            },
            "rustic": {
                "id": "rustic", 
                "name": "Rústico Cálido",
                "description": "Estilo campestre y acogedor"
            },
            "elegant": {
                "id": "elegant", 
                "name": "Elegante Premium",
                "description": "Sofisticación y clase"
            },
            "luxury": {
                "id": "luxury", 
                "name": "Lujoso Dark",
                "description": "Exclusividad y distinción"
            },
        }

    def get_available_templates(self):
        return list(self.templates.values())

    def get_template(self, template_id):
        return self.templates.get(template_id)

    def generate_preview(self, menu, template_id):
        template_file = f"pdf_templates/{template_id}.html"
        return render_template(template_file, menu=menu, is_preview=True)

    def generate_pdf(self, menu, template_id):
        html = render_template(
            f"pdf_templates/{template_id}.html",
            menu=menu,
            is_preview=False
        )

        pdf_bytes = asyncio.run(self._html_to_pdf(html))

        response = make_response(pdf_bytes)
        response.headers["Content-Type"] = "application/pdf"
        response.headers["Content-Disposition"] = (
            f'attachment; filename=menu_{menu["name"]}.pdf'
        )
        return response

    async def _html_to_pdf(self, html_content: str) -> bytes:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            await page.set_content(html_content, wait_until="networkidle")

            pdf = await page.pdf(
                format="A4",
                margin={"top": "20mm", "bottom": "20mm"},
                print_background=True
            )

            await browser.close()
            return pdf
