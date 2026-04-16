export class MainPage {
    constructor() {
        this.initChart();
    }

    initChart() {
        let IncomeCtx = document.getElementById('incomeChart').getContext('2d');
        let incomePieChart = new Chart(IncomeCtx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: 'Доходы (%)',
                    data: [40, 20, 15, 10, 15],
                    backgroundColor: [
                        'red',
                        'orange',
                        'yellow',
                        'green',
                        'blue'
                    ]
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            boxWidth: 35,
                            font: { size: 12 },
                            color: 'black',
                        },

                    },
                }
            }
        });

        let expenseCtx = document.getElementById('expenseChart').getContext('2d');
        let expensePieChart = new Chart(expenseCtx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: 'Доходы (%)',
                    data: [40, 20, 15, 10, 15],
                    backgroundColor: [
                        'red',
                        'orange',
                        'yellow',
                        'green',
                        'blue'
                    ]
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            boxWidth: 35,
                            font: { size: 12 },
                            color: 'black',
                        },

                    },
                }
            }
        });
    }
}