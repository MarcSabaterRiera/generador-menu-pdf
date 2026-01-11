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