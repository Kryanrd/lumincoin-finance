import { HttpUtils } from "../../utils/http-utils";

export class ExpensesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.expenseInput = document.getElementById('expenseInput');

        document.getElementById('cancelButton').addEventListener('click', this.openNewRoute.bind(this, '/expenses'));
        document.getElementById('createButton').addEventListener('click', this.saveExpenses.bind(this));
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

    async saveExpenses(e) {
        e.preventDefault();
        if (this.validateFields()) {
            const createData = {
                title: this.expenseInput.value
            }

            const result = await HttpUtils.request('/categories/expense', 'POST', true, createData);

            if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
                alert('Возникла ошибка при создании расхода. Обратитесь в поддержку.')
                if (result.redirect) {
                    this.openNewRoute('/login');
                }
            }

            this.openNewRoute('/expenses');
        }
    }

}