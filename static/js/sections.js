
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