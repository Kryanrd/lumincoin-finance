import { HttpUtils } from "../../utils/http-utils";
import { UrlUtils } from "../../utils/url-utils.js";

export class ExpensesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.expenseInput = document.getElementById('expenseInput');

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('cancelButton').addEventListener('click', this.openNewRoute.bind(this, '/expenses'));
        document.getElementById('updateButton').addEventListener('click', this.updateExpense.bind(this));

        this.getExpense(id);

    }

    validateFields() {
        let isValid = true;
        if (this.expenseInput.value) {
            this.expenseInput.classList.remove('is-invalid');
        } else {
            this.expenseInput.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async getExpense(id) {
        const result = await HttpUtils.request('/categories/expense/' + id);
        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            alert('Возникла ошибка при запросе расхода. Обратитесь в поддержку.')
            if (result.redirect) {
                this.openNewRoute('/login');
            }
        }

        this.expenseOriginalData = result.response;
        this.showExpense(result.response);
    }

    showExpense(expense) {
        this.expenseInput.setAttribute('value', expense.title);
    }

    async updateExpense(e) {
        e.preventDefault();
        if (this.validateFields()) {
            const changedData = {};
            if (this.expenseInput.value !== this.expenseOriginalData.title) {
                changedData.title = this.expenseInput.value;
            }

            if (Object.keys(changedData).length > 0) {

                const result = await HttpUtils.request('/categories/expense/' + this.expenseOriginalData.id, 'PUT', true, changedData);

                if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
                    alert('Возникла ошибка при обновлении расхода. Обратитесь в поддержку.')
                    if (result.redirect) {
                        this.openNewRoute('/login');
                    }
                }
            }
            return this.openNewRoute('/expenses');
        }
    }


}