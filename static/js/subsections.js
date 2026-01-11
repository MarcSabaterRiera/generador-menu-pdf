
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
