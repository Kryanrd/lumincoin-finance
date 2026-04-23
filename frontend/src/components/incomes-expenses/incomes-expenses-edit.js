import { HttpUtils } from "../../utils/http-utils";
import { UrlUtils } from "../../utils/url-utils";

export class IncomesExpensesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        const type = UrlUtils.getUrlParam('type');
        if (!type) {
            return this.openNewRoute('/');
        }

        this.findElements();

        document.getElementById('cancelButton').addEventListener('click', this.openNewRoute.bind(this, '/incomes-expenses'));
        document.getElementById('createButton').addEventListener('click', this.updateOperation.bind(this));

        this.getCategories(type);
        this.getOperation(id);
    }

    findElements() {
        this.typeSelectElement = document.getElementById('typeSelect');
        this.categorySelectElement = document.getElementById('categorySelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
    }

    async getCategories(type) {
        const result = await HttpUtils.request('/categories/' + type);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            alert('Возникла ошибка при запросе категории. Обратитесь в поддержку.')
            if (result.redirect) {
                this.openNewRoute('/login');
            }
        }

        const typeOptions = [
            { value: 'income', text: 'Доход' },
            { value: 'expense', text: 'Расход' }
        ];

        typeOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.innerText = opt.text;
            if (opt.value === type) {
                option.selected = true;
            }

            this.typeSelectElement.appendChild(option);
            this.typeSelectElement.setAttribute('disabled', 'disabled');
        });


        for (let i = 0; i < result.response.length; i++) {
            const option = document.createElement('option');
            option.value = result.response[i].id;
            option.innerText = result.response[i].title;
            this.categorySelectElement.appendChild(option);
        }
    }

    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id);
        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.type || !result.response.amount || !result.response.date || !result.response.comment || !result.response.category))) {
            alert('Возникла ошибка при запросе расхода. Обратитесь в поддержку.')
            if (result.redirect) {
                this.openNewRoute('/login');
            }
        }

        this.operationOriginalData = result.response;
        console.log(this.operationOriginalData);
        this.showOperation(result.response);
    }

    showOperation(operation) {
        for (let i = 0; i < this.categorySelectElement.options.length; i++) {
            if (this.categorySelectElement.options[i].innerText === operation.category) {
                this.categorySelectElement.selectedIndex = i;
            }
        }

        this.amountInputElement.value = operation.amount;
        this.dateInputElement.value = operation.date;
        this.commentInputElement.value = operation.comment;
    }

    validateFields() {
        let isValid = true;
        if (this.amountInputElement.value && this.amountInputElement.value > 0) {
            this.amountInputElement.classList.remove('is-invalid');
        } else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.dateInputElement.value) {
            this.dateInputElement.classList.remove('is-invalid');
        } else {
            this.dateInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.commentInputElement.value) {
            this.commentInputElement.classList.remove('is-invalid');
        } else {
            this.commentInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async updateOperation(e) {
        e.preventDefault();
        if (this.validateFields()) {
            const createData = {
                type: this.typeSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: Number(this.categorySelectElement.value)
            };

            const result = await HttpUtils.request('/operations/' + this.operationOriginalData.id, 'PUT', true, createData);

            if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
                alert('Возникла ошибка при обновлении операции. Обратитесь в поддержку.')
                if (result.redirect) {
                    this.openNewRoute('/login');
                }
            }
        }

        return this.openNewRoute('/incomes-expenses');
    }
}