import { HttpUtils } from "../../utils/http-utils";
import { UrlUtils } from "../../utils/url-utils.js";

export class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeInput = document.getElementById('incomeInput');

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('cancelButton').addEventListener('click', this.openNewRoute.bind(this, '/incomes'));
        document.getElementById('updateButton').addEventListener('click', this.updateIncome.bind(this));

        this.getIncome(id);

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

    async getIncome(id) {
        const result = await HttpUtils.request('/categories/income/' + id);
        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            alert('Возникла ошибка при запросе расхода. Обратитесь в поддержку.')
            if (result.redirect) {
                this.openNewRoute('/login');
            }
        }

        this.incomeOriginalData = result.response;
        this.showIncome(result.response);
    }

    showIncome(income) {
        this.incomeInput.setAttribute('value', income.title);
    }

    async updateIncome(e) {
        e.preventDefault();
        if (this.validateFields()) {
            const changedData = {};
            if (this.incomeInput.value !== this.incomeOriginalData.title) {
                changedData.title = this.incomeInput.value;
            }

            if (Object.keys(changedData).length > 0) {

                const result = await HttpUtils.request('/categories/income/' + this.incomeOriginalData.id, 'PUT', true, changedData);

                if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
                    alert('Возникла ошибка при обновлении расхода. Обратитесь в поддержку.')
                    if (result.redirect) {
                        this.openNewRoute('/login');
                    }
                }
            }
            return this.openNewRoute('/incomes');
        }
    }


}