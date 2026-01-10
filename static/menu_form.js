// Contador global para los índices de secciones
let sectionIndex = 0;

// Inicializar el formulario cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('sections-container');
    
    // Si ya hay secciones (modo edición), contarlas
    const existingSections = container.querySelectorAll('.section-block');
    sectionIndex = existingSections.length;
    
    // Si no hay secciones (modo creación), agregar las por defecto
    if (sectionIndex === 0) {
        addDefaultSections();
    } else {
        // Agregar botones a las secciones existentes
        existingSections.forEach((section, index) => {
            addSectionButtons(section, index);
        });
    }
});

// Agregar las secciones por defecto
function addDefaultSections() {
    const defaultSections = [
        { name: 'Entrantes', items: '' },
        { name: 'Primeros', items: '' },
        { name: 'Segundos', items: '' },
        { name: 'Postres', items: '' }
    ];
    
    defaultSections.forEach(section => {
        addSection(section.name, section.items);
    });
}

// Agregar una nueva sección
function addSection(name = '', items = '', insertBeforeIndex = null) {
    const container = document.getElementById('sections-container');
    const currentIndex = sectionIndex++;
    
    const sectionBlock = document.createElement('div');
    sectionBlock.className = 'section-block';
    sectionBlock.dataset.index = currentIndex;
    
    sectionBlock.innerHTML = `
        <div class="section-header">
            <input type="text" 
                   name="section_name_${currentIndex}" 
                   value="${escapeHtml(name)}" 
                   placeholder="Nombre de la sección"
                   class="section-name-input"
                   required>
            <div class="section-actions">
                <button type="button" class="btn-icon btn-up" onclick="moveSectionUp(${currentIndex})" title="Mover arriba">
                    ↑
                </button>
                <button type="button" class="btn-icon btn-down" onclick="moveSectionDown(${currentIndex})" title="Mover abajo">
                    ↓
                </button>
                <button type="button" class="btn-icon btn-add" onclick="insertSectionAfter(${currentIndex})" title="Insertar sección">
                    +
                </button>
                <button type="button" class="btn-icon btn-remove" onclick="removeSection(${currentIndex})" title="Eliminar sección">
                    ×
                </button>
            </div>
        </div>
        <textarea name="section_items_${currentIndex}" 
                  placeholder="Escribe cada plato en una línea nueva"
                  rows="5">${escapeHtml(items)}</textarea>
    `;
    
    if (insertBeforeIndex !== null) {
        const targetSection = container.querySelector(`[data-index="${insertBeforeIndex}"]`);
        if (targetSection && targetSection.nextSibling) {
            container.insertBefore(sectionBlock, targetSection.nextSibling);
        } else {
            container.appendChild(sectionBlock);
        }
    } else {
        container.appendChild(sectionBlock);
    }
    
    return currentIndex;
}

// Agregar botones a una sección existente (para modo edición)
function addSectionButtons(sectionElement, index) {
    const header = sectionElement.querySelector('.section-header');
    if (!header) return;
    
    const actionsDiv = header.querySelector('.section-actions');
    if (actionsDiv) return; // Ya tiene botones
    
    const actions = document.createElement('div');
    actions.className = 'section-actions';
    actions.innerHTML = `
        <button type="button" class="btn-icon btn-up" onclick="moveSectionUp(${index})" title="Mover arriba">
            ↑
        </button>
        <button type="button" class="btn-icon btn-down" onclick="moveSectionDown(${index})" title="Mover abajo">
            ↓
        </button>
        <button type="button" class="btn-icon btn-add" onclick="insertSectionAfter(${index})" title="Insertar sección">
            +
        </button>
        <button type="button" class="btn-icon btn-remove" onclick="removeSection(${index})" title="Eliminar sección">
            ×
        </button>
    `;
    header.appendChild(actions);
}

// Insertar una sección después de otra
function insertSectionAfter(index) {
    addSection('', '', index);
    reindexSections();
}

// Mover sección hacia arriba
function moveSectionUp(index) {
    const container = document.getElementById('sections-container');
    const section = container.querySelector(`[data-index="${index}"]`);
    const prevSection = section.previousElementSibling;
    
    if (prevSection) {
        container.insertBefore(section, prevSection);
        reindexSections();
    }
}

// Mover sección hacia abajo
function moveSectionDown(index) {
    const container = document.getElementById('sections-container');
    const section = container.querySelector(`[data-index="${index}"]`);
    const nextSection = section.nextElementSibling;
    
    if (nextSection) {
        container.insertBefore(nextSection, section);
        reindexSections();
    }
}

// Eliminar una sección
function removeSection(index) {
    const container = document.getElementById('sections-container');
    const sections = container.querySelectorAll('.section-block');
    
    // No permitir eliminar si solo hay una sección
    if (sections.length <= 1) {
        alert('Debe haber al menos una sección en el menú');
        return;
    }
    
    if (confirm('¿Estás seguro de eliminar esta sección?')) {
        const section = container.querySelector(`[data-index="${index}"]`);
        section.remove();
        reindexSections();
    }
}

// Reindexar todas las secciones después de mover/eliminar
function reindexSections() {
    const container = document.getElementById('sections-container');
    const sections = container.querySelectorAll('.section-block');
    
    sections.forEach((section, newIndex) => {
        section.dataset.index = newIndex;
        
        const nameInput = section.querySelector('input[name^="section_name_"]');
        const itemsTextarea = section.querySelector('textarea[name^="section_items_"]');
        const buttons = section.querySelectorAll('button[onclick]');
        
        if (nameInput) {
            nameInput.name = `section_name_${newIndex}`;
        }
        
        if (itemsTextarea) {
            itemsTextarea.name = `section_items_${newIndex}`;
        }
        
        // Actualizar los onclick de los botones
        buttons.forEach(button => {
            const onclick = button.getAttribute('onclick');
            if (onclick) {
                button.setAttribute('onclick', onclick.replace(/\d+/, newIndex));
            }
        });
    });
    
    sectionIndex = sections.length;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Agregar nueva sección al final (botón principal)
function addNewSection() {
    addSection();
    reindexSections();
    
    // Scroll a la nueva sección
    const container = document.getElementById('sections-container');
    const lastSection = container.lastElementChild;
    if (lastSection) {
        lastSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        lastSection.querySelector('input').focus();
    }
}