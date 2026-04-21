import { HttpUtils } from "../utils/http-utils";

export class MainPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.isIntervalMode = false;

        if (this.dateFromInput && this.dateToInput) {
            this.dateFromInput.disabled = true;
            this.dateToInput.disabled = true;
        }

        this.initCharts();

        this.initFilters();
        this.loadOperations();
    }

    findElements() {
        this.filterButtons = document.querySelectorAll('.btn-filter');
        this.intervalBlock = document.getElementById('interval-dates');
        this.dateFromInput = document.getElementById('dateFrom');
        this.dateToInput = document.getElementById('dateTo');
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
                    this.setActiveFilter(btn);
                    this.loadOperations('interval', dateFrom, dateTo);
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

        this.updateChartsWithOperations(result.response);
    }

    updateChartsWithOperations(operations) {
        const incomeMap = new Map();
        const expenseMap = new Map();

        for (const op of operations) {
            const category = op.category || 'Без категории';
            const amount = Number(op.amount) || 0;

            if (op.type === 'income') {
                incomeMap.set(category, (incomeMap.get(category) || 0) + amount);
            } else if (op.type === 'expense') {
                expenseMap.set(category, (expenseMap.get(category) || 0) + amount);
            }
        }

        const incomeCategories = Array.from(incomeMap.keys());
        const incomeAmounts = Array.from(incomeMap.values());
        const expenseCategories = Array.from(expenseMap.keys());
        const expenseAmounts = Array.from(expenseMap.values());

        const getColors = (count) => {
            const palette = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'aqua', 'pink'];
            return Array(count).fill().map((_, i) => palette[i % palette.length]);
        };

        this.incomeChart.data.labels = incomeCategories;
        this.incomeChart.data.datasets[0].data = incomeAmounts;
        this.incomeChart.data.datasets[0].backgroundColor = getColors(incomeCategories.length);
        this.incomeChart.update();

        this.expenseChart.data.labels = expenseCategories;
        this.expenseChart.data.datasets[0].data = expenseAmounts;
        this.expenseChart.data.datasets[0].backgroundColor = getColors(expenseCategories.length);
        this.expenseChart.update();
    }


    initCharts() {
        const incomeCtx = document.getElementById('incomeChart').getContext('2d');
        this.incomeChart = new Chart(incomeCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 35, font: { size: 12 }, color: 'black' } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} $` } }
                }
            }
        });

        const expenseCtx = document.getElementById('expenseChart').getContext('2d');
        this.expenseChart = new Chart(expenseCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 35, font: { size: 12 }, color: 'black' } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} $` } }
                }
            }
        });
    }
}