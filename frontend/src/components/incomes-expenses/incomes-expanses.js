import { HttpUtils } from "../../utils/http-utils";
import { LayoutUtils } from "../../utils/layout-utils";

export class IncomesExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.currentDeleteId = null;

        this.findElements();

        this.tableBody = document.querySelector('#incomes-expenses-table tbody');
        this.currentPeriod = 'today';

        if (this.dateFromInput && this.dateToInput) {
            this.dateFromInput.disabled = true;
            this.dateToInput.disabled = true;
        }

        this.initFilters();
        this.initPopup();
        this.loadOperations();
    }

    findElements() {
        this.filterButtons = document.querySelectorAll('.btn-filter');
        this.intervalBlock = document.getElementById('interval-dates');
        this.dateFromInput = document.getElementById('dateFrom');
        this.dateToInput = document.getElementById('dateTo');

        this.overlay = document.getElementById('overlay');
        this.popup = document.getElementById('popup');
        this.confirmBtn = document.getElementById('confirmDelete');
        this.cancelBtn = document.getElementById('cancelDelete');
    }

    initFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = btn.getAttribute('data-period');
                if (period === 'interval') {
                    this.currentPeriod = 'interval';
                    this.dateFromInput.disabled = false;
                    this.dateToInput.disabled = false;
                    this.setActiveFilter(btn);
                    if (this.dateFromInput.value && this.dateToInput.value) {
                        this.loadOperations('interval', this.dateFromInput.value, this.dateToInput.value);
                    }
                } else if (period === 'year') {
                    const currentYear = new Date().getFullYear();
                    const dateFrom = `${currentYear}-01-01`;
                    const dateTo = `${currentYear}-12-31`;
                    this.loadOperations('interval', dateFrom, dateTo);
                    this.setActiveFilter(btn);
                } else {
                    this.dateFromInput.disabled = true;
                    this.dateToInput.disabled = true;
                    this.currentPeriod = period;
                    this.setActiveFilter(btn);
                    this.loadOperations(period);
                }
            });
        });

        if (this.dateFromInput && this.dateToInput) {
            const onDateChange = () => {
                if (this.currentPeriod === 'interval' &&
                    this.dateFromInput.value &&
                    this.dateToInput.value) {
                    this.loadOperations('interval', this.dateFromInput.value, this.dateToInput.value);
                }
            };
            this.dateFromInput.addEventListener('change', onDateChange);
            this.dateToInput.addEventListener('change', onDateChange);
        }
    }

    setActiveFilter(activeBtn) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-outline-secondary');
        });
        activeBtn.classList.remove('btn-outline-secondary');
        activeBtn.classList.add('btn-secondary');
    }

    initPopup() {
        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', this.confirmDelete.bind(this));
        }
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', this.hidePopup.bind(this));
        }
    }

    showPopup(id) {
        this.currentDeleteId = id;
        if (this.overlay) this.overlay.style.display = 'block';
        if (this.popup) this.popup.style.display = 'block';
    }

    hidePopup() {
        this.currentDeleteId = null;
        if (this.overlay) this.overlay.style.display = 'none';
        if (this.popup) this.popup.style.display = 'none';
    }

    async confirmDelete() {
        if (!this.currentDeleteId) return;

        const result = await HttpUtils.request('/operations/' + this.currentDeleteId, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            alert('Ошибка при удалении операции');
            if (result.redirect) this.openNewRoute('/login');
            this.hidePopup();
            return;
        }

        this.hidePopup();

        await LayoutUtils.updateBalance(this.openNewRoute);

        if (this.currentPeriod === 'interval') {
            this.loadOperations('interval', this.dateFromInput.value, this.dateToInput.value);
        } else {
            this.loadOperations(this.currentPeriod);
        }
    }

    async loadOperations(period = null, dateFrom = null, dateTo = null) {
        let url = '/operations?';
        if (period && period !== 'interval') {
            url += `period=${period}`;
        } else if (period === 'interval' && dateFrom && dateTo) {
            url += `period=${period}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        } else if (!period) {
            url += `period=today`;
        } else {
            return;
        }

        const result = await HttpUtils.request(url);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            alert('Ошибка загрузки операций');
            if (result.redirect) this.openNewRoute('/login');
            return;
        }

        this.renderTable(result.response);
    }

    renderTable(operations) {
        if (!this.tableBody) return;
        this.tableBody.innerHTML = '';

        if (!operations || operations.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="6" class="text-center">Нет операций</td>';
            this.tableBody.appendChild(emptyRow);
            return;
        }

        operations.forEach((operation, index) => {
            const row = document.createElement('tr');
            row.className = 'text-center';

            const th = document.createElement('th');
            th.scope = 'row';
            th.className = 'p-3';
            th.innerText = operation.id
            row.appendChild(th);

            const typeCell = document.createElement('td');
            typeCell.className = operation.type === 'income' ? 'text-success p-3' : 'text-danger p-3';
            typeCell.innerText = operation.type === 'income' ? 'доход' : 'расход';
            row.appendChild(typeCell);

            const categoryCell = document.createElement('td');
            categoryCell.className = 'p-3';
            categoryCell.innerText = operation.category ? operation.category : 'Без категории';;
            row.appendChild(categoryCell);

            const amountCell = document.createElement('td');
            amountCell.className = 'p-3';
            amountCell.innerText = operation.amount ? operation.amount + '$' : '';
            row.appendChild(amountCell);

            const dateCell = document.createElement('td');
            dateCell.className = 'p-3';
            dateCell.innerText = new Date(operation.date).toLocaleDateString();
            row.appendChild(dateCell);


            const commentCell = document.createElement('td');
            commentCell.className = 'd-flex justify-content-end gap-2 p-3';
            commentCell.innerHTML = `
                <span class="me-auto">${operation.comment || ''}</span>
                <a href="#" class="delete-operation" data-id="${operation.id}">
                    <i class="bi bi-trash text-black"></i>
                </a>
                <a href="/incomes-expenses/edit?id=${operation.id}&type=${operation.type}">
                    <i class="bi bi-pencil text-black"></i>
                </a>
            `;
            row.appendChild(commentCell);

            this.tableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-operation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                if (id) this.showPopup(id);
            });
        });
    }
}