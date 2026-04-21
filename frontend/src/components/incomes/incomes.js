import { HttpUtils } from "../../utils/http-utils";

export class Incomes {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.currentDeleteId = null;
        this.getIncomes();
        this.initPopupHandlers();
    }

    initPopupHandlers() {
        this.overlayElement = document.getElementById('overlay');
        this.popupElement = document.getElementById('popup');
        this.confirmElement = document.getElementById('confirmDelete');
        this.cancelElement = document.getElementById('cancelDelete');

        if (this.confirmElement) {
            this.confirmElement.addEventListener('click', this.confirmDelete.bind(this));
        }
        if (this.cancelElement) {
            this.cancelElement.addEventListener('click', this.cancelDelete.bind(this));
        }
    }

    showPopup(id) {
        this.currentDeleteId = id;
        if (this.overlayElement) this.overlayElement.style.display = 'block';
        if (this.popupElement) this.popupElement.style.display = 'block';
    }

    hidePopup() {
        this.currentDeleteId = null;
        if (this.overlayElement) this.overlayElement.style.display = 'none';
        if (this.popupElement) this.popupElement.style.display = 'none';
    }

    async confirmDelete() {
        if (!this.currentDeleteId) return;

        const result = await HttpUtils.request('/categories/income/' + this.currentDeleteId, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            alert('Возникла ошибка при удалении расхода. Обратитесь в поддержку.');
            if (result.redirect) {
                this.openNewRoute('/login');
            }
            this.hidePopup();
            return;
        }

        this.hidePopup();
        this.openNewRoute('/incomes');
    }

    cancelDelete() {
        this.hidePopup();
    }

    async getIncomes() {
        const result = await HttpUtils.request('/categories/income');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            alert('Возникла ошибка при запросе расходов. Обратитесь в поддержку.')
            if (result.redirect) {
                this.openNewRoute('/login');
            }
        }

        this.showIncomes(result.response);
    }

    showIncomes(incomes) {
        const incomesRecords = document.getElementById('incomesRecords');
        incomes.innerHTML = '';
        for (let i = 0; i < incomes.length; i++) {
            const incomesRecord = document.createElement('div');
            incomesRecord.className = 'py-4 ps-4 border rounded income';
            const incomeTitle = document.createElement('h2');
            incomeTitle.className = 'text-primary-emphasis mb-3';
            incomeTitle.innerText = incomes[i].title;
            const incomeActions = document.createElement('div');
            incomeActions.className = 'd-flex gap-2';
            const incomeEdit = document.createElement('a');
            incomeEdit.className = 'btn btn-primary px-3 py-2';
            incomeEdit.href = '/incomes/edit?id=' + incomes[i].id;
            incomeEdit.innerText = 'Редактировать';
            const incomeDelete = document.createElement('button');
            incomeDelete.className = 'btn btn-danger px-3 py-2';
            incomeDelete.innerText = 'Удалить';
            incomeDelete.dataset.id = incomes[i].id;
            incomeDelete.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPopup(incomes[i].id);
            });
            incomeActions.appendChild(incomeEdit);
            incomeActions.appendChild(incomeDelete);
            incomesRecord.appendChild(incomeTitle);
            incomesRecord.appendChild(incomeActions);
            incomesRecords.appendChild(incomesRecord);
        }

        const createRecordElement = document.createElement('div');
        createRecordElement.className = 'py-4 ps-4 border rounded income d-flex justify-content-center align-items-center';
        const createRecordLink = document.createElement('a');
        createRecordLink.href = '/incomes/create';
        const createRecordIcon = document.createElement('i');
        createRecordIcon.className = 'bi bi-plus-lg text-secondary';
        createRecordLink.appendChild(createRecordIcon);
        createRecordElement.appendChild(createRecordLink);
        incomesRecords.appendChild(createRecordElement);
    }
}