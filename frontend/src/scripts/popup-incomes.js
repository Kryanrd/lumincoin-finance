const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const confirmBtn = document.getElementById('confirmDelete');
const cancelBtn = document.getElementById('cancelDelete');

const deleteButtons = document.querySelectorAll('.btn-danger');

function openPopup(rowElement) {
    currentRow = rowElement;
    overlay.style.display = 'block';
    popup.style.display = 'block';
}

function closePopup() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
    popup.classList.remove('show');
    overlay.classList.remove('show');
}

deleteButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault(); 
        const parentLink = this.closest('a');
        openPopup(parentLink);
    });
});

confirmBtn.addEventListener('click', closePopup);

cancelBtn.addEventListener('click', closePopup);

overlay.addEventListener('click', closePopup);