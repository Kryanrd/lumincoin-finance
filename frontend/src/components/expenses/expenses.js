import { HttpUtils } from "../../utils/http-utils";

export class Expenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.currentDeleteId = null;
        this.getExpenses();
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

        const result = await HttpUtils.request('/categories/expense/' + this.currentDeleteId, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            alert('Возникла ошибка при удалении расхода. Обратитесь в поддержку.');
            if (result.redirect) {
                this.openNewRoute('/login');
            }
            this.hidePopup();
            return;
        }

        this.hidePopup();
        this.openNewRoute('/expenses');
    }

    cancelDelete() {
        this.hidePopup();
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            alert('Возникла ошибка при запросе расходов. Обратитесь в поддержку.')
            if (result.redirect) {
                this.openNewRoute('/login');
            }
        }

        this.showExpenses(result.response);
    }

    showExpenses(expenses) {
        const expensesRecords = document.getElementById('expenses-records');
        expensesRecords.innerHTML = '';
        for (let i = 0; i < expenses.length; i++) {
            const expensesRecord = document.createElement('div');
            expensesRecord.className = 'py-4 ps-4 border rounded income';
            const expenseTitle = document.createElement('h2');
            expenseTitle.className = 'text-primary-emphasis mb-3';
            expenseTitle.innerText = expenses[i].title;
            const expenseActions = document.createElement('div');
            expenseActions.className = 'd-flex gap-2';
            const expenseEdit = document.createElement('a');
            expenseEdit.className = 'btn btn-primary px-3 py-2';
            expenseEdit.href = '/expenses/edit?id=' + expenses[i].id;
            expenseEdit.innerText = 'Редактировать';
            const expenseDelete = document.createElement('button');
            expenseDelete.className = 'btn btn-danger px-3 py-2';
            expenseDelete.innerText = 'Удалить';
            expenseDelete.dataset.id = expenses[i].id;
            expenseDelete.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPopup(expenses[i].id);
            });
            expenseActions.appendChild(expenseEdit);
            expenseActions.appendChild(expenseDelete);
            expensesRecord.appendChild(expenseTitle);
            expensesRecord.appendChild(expenseActions);
            expensesRecords.appendChild(expensesRecord);
        }

        const createRecordElement = document.createElement('div');
        createRecordElement.className = 'py-4 ps-4 border rounded income d-flex justify-content-center align-items-center';
        const createRecordLink = document.createElement('a');
        createRecordLink.href = '/expenses/create';
        const createRecordIcon = document.createElement('i');
        createRecordIcon.className = 'bi bi-plus-lg text-secondary';
        createRecordLink.appendChild(createRecordIcon);
        createRecordElement.appendChild(createRecordLink);
        expensesRecords.appendChild(createRecordElement);
    }
}