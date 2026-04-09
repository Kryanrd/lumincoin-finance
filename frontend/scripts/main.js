document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.btn-toggle');
    const collapseElement = document.querySelector('#home-collapse');
    const parentGroup = document.querySelector('#categoriesGroup');

    if (toggleButton && collapseElement && parentGroup) {
        collapseElement.addEventListener('shown.bs.collapse', function () {
            toggleButton.classList.add('active');
            parentGroup.classList.add('open');
        });
        collapseElement.addEventListener('hidden.bs.collapse', function () {
            toggleButton.classList.remove('active');
            parentGroup.classList.remove('open');
        });
        if (collapseElement.classList.contains('show')) {
            toggleButton.classList.add('active');
            parentGroup.classList.add('open');
        }
    }
});


