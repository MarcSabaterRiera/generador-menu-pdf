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
        // Agregar botones a las secciones existentes si es necesario
        existingSections.forEach((section, index) => {
            ensureSectionButtons(section, index);
        });
    }
});

// Agregar las secciones por defecto con subsecciones de ejemplo
function addDefaultSections() {
    const defaultSections = [
        { 
            name: 'Entrantes', 
            description: '',
            subsections: [
                { name: 'Bebida y Pica-Pica', description: '' },
                { name: 'Aguas Aromatizadas', description: '' }
            ]
        },
        { 
            name: 'Primeros', 
            description: '',
            subsections: [
                { name: 'Panes y Embutidos', description: '' },
                { name: 'Croquetas', description: '' }
            ]
        },
        { 
            name: 'Segundos', 
            description: '',
            subsections: [
                { name: 'Plato Principal', description: '' }
            ]
        },
        { 
            name: 'Postres', 
            description: '',
            subsections: [
                { name: 'Dulces', description: '' }
            ]
        }
    ];
    
    defaultSections.forEach(section => {
        addSection(section.name, section.description, section.subsections);
    });
}

// Agregar una nueva sección
function addSection(name = '', description = '', subsections = null, insertBeforeIndex = null) {
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
                   placeholder="Nombre de la sección (ej: Entrantes, Primeros...)"
                   class="section-name-input"
                   required>
            <div class="section-actions">
                <button type="button" class="btn-icon btn-up" onclick="moveSectionUp(${currentIndex})" title="Mover arriba">↑</button>
                <button type="button" class="btn-icon btn-down" onclick="moveSectionDown(${currentIndex})" title="Mover abajo">↓</button>
                <button type="button" class="btn-icon btn-add" onclick="insertSectionAfter(${currentIndex})" title="Insertar sección">+</button>
                <button type="button" class="btn-icon btn-remove" onclick="removeSection(${currentIndex})" title="Eliminar sección">×</button>
            </div>
        </div>
        
        <div class="section-description">
            <label>Descripción opcional de la sección</label>
            <textarea name="section_description_${currentIndex}" 
                      placeholder="Ej: Selección de aperitivos para comenzar la celebración"
                      rows="2">${escapeHtml(description)}</textarea>
        </div>

        <div class="subsections-header">
            <h3>Subsecciones</h3>
            <button type="button" onclick="addSubsection(${currentIndex})" class="btn-small">
                + Añadir subsección
            </button>
        </div>

        <div class="subsections-container" data-section-index="${currentIndex}">
        </div>
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
    
    // Agregar subsecciones si se proporcionaron
    if (subsections && subsections.length > 0) {
        subsections.forEach(sub => {
            addSubsection(currentIndex, sub.name, sub.description);
        });
    } else {
        // Agregar al menos una subsección vacía
        addSubsection(currentIndex);
    }
    
    return currentIndex;
}

// Asegurar que una sección existente tenga botones
function ensureSectionButtons(sectionElement, index) {
    const header = sectionElement.querySelector('.section-header');
    if (!header) return;
    
    const actionsDiv = header.querySelector('.section-actions');
    if (actionsDiv) return; // Ya tiene botones
    
    const actions = document.createElement('div');
    actions.className = 'section-actions';
    actions.innerHTML = `
        <button type="button" class="btn-icon btn-up" onclick="moveSectionUp(${index})" title="Mover arriba">↑</button>
        <button type="button" class="btn-icon btn-down" onclick="moveSectionDown(${index})" title="Mover abajo">↓</button>
        <button type="button" class="btn-icon btn-add" onclick="insertSectionAfter(${index})" title="Insertar sección">+</button>
        <button type="button" class="btn-icon btn-remove" onclick="removeSection(${index})" title="Eliminar sección">×</button>
    `;
    header.appendChild(actions);
}

// Agregar una subsección a una sección específica
function addSubsection(sectionIndex, name = '', description = '') {
    const subsectionsContainer = document.querySelector(`.subsections-container[data-section-index="${sectionIndex}"]`);
    if (!subsectionsContainer) return;
    
    const subsections = subsectionsContainer.querySelectorAll('.subsection-block');
    const subsectionIndex = subsections.length;
    
    const subsectionBlock = document.createElement('div');
    subsectionBlock.className = 'subsection-block';
    subsectionBlock.dataset.subsectionIndex = subsectionIndex;
    
    subsectionBlock.innerHTML = `
        <div class="subsection-header">
            <input type="text" 
                   name="subsection_name_${sectionIndex}_${subsectionIndex}" 
                   value="${escapeHtml(name)}" 
                   placeholder="Nombre de subsección (ej: Bebidas y Pica-Pica, Aguas Aromatizadas...)"
                   class="subsection-name-input"
                   required>
            <div class="subsection-actions">
                <button type="button" class="btn-icon-small btn-up" onclick="moveSubsectionUp(${sectionIndex}, ${subsectionIndex})" title="Mover arriba">↑</button>
                <button type="button" class="btn-icon-small btn-down" onclick="moveSubsectionDown(${sectionIndex}, ${subsectionIndex})" title="Mover abajo">↓</button>
                <button type="button" class="btn-icon-small btn-remove" onclick="removeSubsection(${sectionIndex}, ${subsectionIndex})" title="Eliminar">×</button>
            </div>
        </div>
        <div class="subsection-description">
            <textarea name="subsection_description_${sectionIndex}_${subsectionIndex}" 
                      placeholder="Descripción opcional de la subsección"
                      rows="2">${escapeHtml(description)}</textarea>
        </div>
    `;
    
    subsectionsContainer.appendChild(subsectionBlock);
    reindexSubsections(sectionIndex);
}

// Mover subsección hacia arriba
function moveSubsectionUp(sectionIndex, subsectionIndex) {
    const container = document.querySelector(`.subsections-container[data-section-index="${sectionIndex}"]`);
    const subsections = container.querySelectorAll('.subsection-block');
    const subsection = subsections[subsectionIndex];
    const prevSubsection = subsection.previousElementSibling;
    
    if (prevSubsection) {
        container.insertBefore(subsection, prevSubsection);
        reindexSubsections(sectionIndex);
    }
}

// Mover subsección hacia abajo
function moveSubsectionDown(sectionIndex, subsectionIndex) {
    const container = document.querySelector(`.subsections-container[data-section-index="${sectionIndex}"]`);
    const subsections = container.querySelectorAll('.subsection-block');
    const subsection = subsections[subsectionIndex];
    const nextSubsection = subsection.nextElementSibling;
    
    if (nextSubsection) {
        container.insertBefore(nextSubsection, subsection);
        reindexSubsections(sectionIndex);
    }
}

// Eliminar una subsección
function removeSubsection(sectionIndex, subsectionIndex) {
    const container = document.querySelector(`.subsections-container[data-section-index="${sectionIndex}"]`);
    const subsections = container.querySelectorAll('.subsection-block');
    
    // No permitir eliminar si solo hay una subsección
    if (subsections.length <= 1) {
        alert('Debe haber al menos una subsección en cada sección');
        return;
    }
    
    if (confirm('¿Estás seguro de eliminar esta subsección?')) {
        subsections[subsectionIndex].remove();
        reindexSubsections(sectionIndex);
    }
}

// Reindexar subsecciones de una sección específica
function reindexSubsections(sectionIndex) {
    const container = document.querySelector(`.subsections-container[data-section-index="${sectionIndex}"]`);
    const subsections = container.querySelectorAll('.subsection-block');
    
    subsections.forEach((subsection, newIndex) => {
        subsection.dataset.subsectionIndex = newIndex;
        
        const nameInput = subsection.querySelector('input[name^="subsection_name_"]');
        const descTextarea = subsection.querySelector('textarea[name^="subsection_description_"]');
        const buttons = subsection.querySelectorAll('button[onclick]');
        
        if (nameInput) {
            nameInput.name = `subsection_name_${sectionIndex}_${newIndex}`;
        }
        
        if (descTextarea) {
            descTextarea.name = `subsection_description_${sectionIndex}_${newIndex}`;
        }
        
        // Actualizar los onclick de los botones
        buttons.forEach(button => {
            const onclick = button.getAttribute('onclick');
            if (onclick) {
                const newOnclick = onclick.replace(/moveSubsectionUp\(\d+,\s*\d+\)/, `moveSubsectionUp(${sectionIndex}, ${newIndex})`)
                                          .replace(/moveSubsectionDown\(\d+,\s*\d+\)/, `moveSubsectionDown(${sectionIndex}, ${newIndex})`)
                                          .replace(/removeSubsection\(\d+,\s*\d+\)/, `removeSubsection(${sectionIndex}, ${newIndex})`);
                button.setAttribute('onclick', newOnclick);
            }
        });
    });
}

// Insertar una sección después de otra
function insertSectionAfter(index) {
    addSection('', '', [{ name: '', description: '' }], index);
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
    
    if (confirm('¿Estás seguro de eliminar esta sección y todas sus subsecciones?')) {
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
        const oldIndex = section.dataset.index;
        section.dataset.index = newIndex;
        
        // Actualizar inputs y textareas de la sección
        const nameInput = section.querySelector('input[name^="section_name_"]');
        const descTextarea = section.querySelector('textarea[name^="section_description_"]');
        const subsectionsContainer = section.querySelector('.subsections-container');
        const buttons = section.querySelectorAll('.section-header button[onclick]');
        
        if (nameInput) {
            nameInput.name = `section_name_${newIndex}`;
        }
        
        if (descTextarea) {
            descTextarea.name = `section_description_${newIndex}`;
        }
        
        if (subsectionsContainer) {
            subsectionsContainer.dataset.sectionIndex = newIndex;
            reindexSubsections(newIndex);
        }
        
        // Actualizar los onclick de los botones de sección
        buttons.forEach(button => {
            const onclick = button.getAttribute('onclick');
            if (onclick) {
                button.setAttribute('onclick', onclick.replace(/\d+/, newIndex));
            }
        });
    });
    
    sectionIndex = sections.length;
}

// Agregar nueva sección al final (botón principal)
function addNewSection() {
    addSection('', '', [{ name: '', description: '' }]);
    reindexSections();
    
    // Scroll a la nueva sección
    const container = document.getElementById('sections-container');
    const lastSection = container.lastElementChild;
    if (lastSection) {
        lastSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        lastSection.querySelector('input').focus();
    }
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}