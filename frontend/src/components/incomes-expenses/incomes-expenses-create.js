import { HttpUtils } from "../../utils/http-utils";
import { UrlUtils } from "../../utils/url-utils";

export class IncomesExpensesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const type = UrlUtils.getUrlParam('type');
        if (!type) {
            return this.openNewRoute('/');
        }

        this.findElements();

        document.getElementById('cancelButton').addEventListener('click', this.openNewRoute.bind(this, '/incomes-expenses'));
        document.getElementById('createButton').addEventListener('click', this.saveOperation.bind(this));

        this.getCategories(type);
    }

    findElements() {
        this.typeSelectElement = document.getElementById('typeSelect');
        this.categorySelectElement = document.getElementById('categorySelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
    }

    async getCategories(category) {
        const result = await HttpUtils.request('/categories/' + category);
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
            if (opt.value === category) {
                option.selected = true;
            }

            this.typeSelectElement.appendChild(option);
        });


        for (let i = 0; i < result.response.length; i++) {
            const option = document.createElement('option');
            option.value = result.response[i].id;
            option.innerText = result.response[i].title;
            this.categorySelectElement.appendChild(option);
        }
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

    async saveOperation(e) {
        e.preventDefault();
        if (this.validateFields()) {
            const createData = {
                type: this.typeSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: Number(this.categorySelectElement.value)
            }

            console.log(createData);

            const result = await HttpUtils.request('/operations', 'POST', true, createData);

            if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
                alert('Возникла ошибка при создании расхода. Обратитесь в поддержку.')
                if (result.redirect) {
                    this.openNewRoute('/login');
                }
            }

            this.openNewRoute('/incomes-expenses');
        }
    }
}