let sectionIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('sections-container');

    const existingSections = container.querySelectorAll('.section-block');
    sectionIndex = existingSections.length;

    if (sectionIndex === 0) {
        addDefaultSections();
    } else {
        existingSections.forEach((section, index) => {
            ensureSectionButtons(section, index);
        });
    }
});
