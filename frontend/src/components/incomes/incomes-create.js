import { HttpUtils } from "../../utils/http-utils";

export class IncomesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeInput = document.getElementById('incomeInput');

        document.getElementById('cancelButton').addEventListener('click', this.openNewRoute.bind(this, '/incomes'));
        document.getElementById('createButton').addEventListener('click', this.saveIncomes.bind(this));
    }

    validateFields() {
        let isValid = true;
        if (this.incomeInput.value) {
            this.incomeInput.classList.remove('is-invalid');
        } else {
            this.incomeInput.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async saveIncomes(e) {
        e.preventDefault();
        if (this.validateFields()) {
            const createData = {
                title: this.incomeInput.value
            }

            const result = await HttpUtils.request('/categories/income', 'POST', true, createData);

            if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
                alert('Возникла ошибка при создании расхода. Обратитесь в поддержку.')
                if (result.redirect) {
                    this.openNewRoute('/login');
                }
            }

            this.openNewRoute('/incomes');
        }
    }

}