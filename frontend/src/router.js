import { Login } from "./components/auth/login.js";
import { Logout } from "./components/auth/logout.js";
import { SignUp } from "./components/auth/signup.js";
import { ExpensesEdit } from "./components/expenses/expenses-edit.js";
import { Expenses } from "./components/expenses/expenses.js";
import { ExpensesCreate } from "./components/expenses/expenses-create.js";
import { IncomesExpenses } from "./components/incomes-expenses/incomes-expanses.js";
import { IncomesExpensesCreate } from "./components/incomes-expenses/incomes-expenses-create.js"
import { IncomesExpensesEdit } from "./components/incomes-expenses/incomes-expenses-edit.js";
import { IncomeEdit } from "./components/incomes/income-edit.js";
import { IncomesCreate } from "./components/incomes/incomes-create.js";
import { Incomes } from "./components/incomes/incomes.js";
import { MainPage } from "./components/main-page.js";
import { FileUtils } from "./utils/file-utils.js";
import { LayoutUtils } from "./utils/layout-utils.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main-page.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new MainPage();
                },
                scripts: ['chart.umd.js']
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/incomes-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/incomes-expenses/incomes-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesExpenses();
                },
            },
            {
                route: '/incomes-expenses/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/incomes-expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesExpensesCreate();
                },
            },
            {
                route: '/incomes-expenses/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/incomes-expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesExpensesEdit();
                },
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes/incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes();
                },
            },
            {
                route: '/incomes/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/incomes/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesCreate();
                },
            },
            {
                route: '/incomes/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit();
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses();
                },
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEdit();
                },
            },
             {
                route: '/expenses/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreate();
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this))
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {

        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }

    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }

        }
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.adminLteStyleElemet);
                });
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }

            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

            if (newRoute.useLayout) {
                await LayoutUtils.initLayout(newRoute.route, this.openNewRoute.bind(this));
            }

        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }
}