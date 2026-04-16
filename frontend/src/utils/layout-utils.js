import { AuthUtils } from "./auth-utils.js";
import { HttpUtils } from "./http-utils.js";

export class LayoutUtils {
    static setActiveMenuItem(currentPath) {
        this.initMenu();
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            link.classList.add('text-primary-emphasis');
        });


        let activeLink = Array.from(navLinks).find(link => link.getAttribute('href') === currentPath);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.classList.remove('text-primary-emphasis');
        } else {
            const submenuLinks = document.querySelectorAll('.submenu-link');
            submenuLinks.forEach(link => link.classList.remove('active'));
            const activeSub = Array.from(submenuLinks).find(link => link.getAttribute('href') === currentPath);
            if (activeSub) {
                activeSub.classList.add('active');
                const parentBtn = document.querySelector('#categoriesGroup .btn-toggle');
                if (parentBtn) parentBtn.classList.add('active');
            }
        }
    }

    static initMenu() {
        const toggleButton = document.querySelector('.btn-toggle');
        const collapseElement = document.querySelector('#home-collapse');
        const parentGroup = document.querySelector('#categoriesGroup');

        if (toggleButton && collapseElement && parentGroup) {
            collapseElement.addEventListener('shown.bs.collapse', function () {
                toggleButton.classList.add('active');
                parentGroup.classList.add('open');
            });
            collapseElement.addEventListener('hidden.bs.collapse', function () {
                toggleButton.classList.remove('active');
                parentGroup.classList.remove('open');
            });
            if (collapseElement.classList.contains('show')) {
                toggleButton.classList.add('active');
                parentGroup.classList.add('open');
            }
        }
        this.initPopup();
    }

    static initPopup() {

        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');
        const logoutBtn = document.getElementById('logout-btn');
        const cancelBtn = document.getElementById('cancelLogout');

        const openPopup = () => {
            overlay.style.display = 'block';
            popup.style.display = 'block';
            popup.classList.add('show');
            overlay.classList.add('show');
        };

        const closePopup = () => {
            overlay.style.display = 'none';
            popup.style.display = 'none';
            popup.classList.remove('show');
            overlay.classList.remove('show');
        };

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openPopup();
            });
        }

        overlay.addEventListener('click', closePopup);
        popup.addEventListener('click', (e) => e.stopPropagation());

        if (cancelBtn) cancelBtn.addEventListener('click', closePopup);
    }

    static async updateBalance(openNewRoute) {
        const balanceElement = document.getElementById('balance');
        const result = await HttpUtils.request('/balance');
        if (result.redirect) {
            await openNewRoute(result.redirect);
            return { redirected: true };
        }

        if (result.error || !result.response || !result.response.balance) {
            //alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку.');
            balanceElement.innerText = `0 $`;
            return { redirected: false };
        }

        balanceElement.innerText = `${result.response.balance}$`;
        return { redirected: false };
    }

    static updateUserInfo() {
        const userInfoElement = document.getElementById('user');
        if (!userInfoElement) return;
        userInfoElement.innerText = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey)).name;
    }

    static async initLayout(currentPath, openNewRoute) {
        const { redirected } = await this.updateBalance(openNewRoute);
        if (redirected) return;
        this.setActiveMenuItem(currentPath);
        this.updateUserInfo();
    }

}