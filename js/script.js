window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // Timer

    let deadline = '2023-11-11';

    // Узнаем сколько времени между сейчас и deadline

    function getTimeRemainig(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60)));
        //days = Math.floor((t (1000*60*60*24) % 24));

        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemainig(endtime);
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('timer', deadline);

    // Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function () {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function () {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    // Form

    // Создаем объект состояний нашего запроса. Сейчас мы используем текстовый формат оповещения, но в дальнейшем это могут быть картинки и т.д.
    let message = {
        loading: 'Load...',
        succes: 'Thank you, soon we contact you',
        failure: 'Some tink was wrong...'
    };

    //Получаем элементы со страницы с которыми мы будем работать

    let form = document.querySelector('.main-form'),
        contactForm = document.querySelector('.contact-form'),
        inputs = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    //Прописываем запрос. Обработчик вешаем на всю форму. Отслеживать нужно когда форма отправляется на сервер. Вешать на кнопку - ошибка.
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // здесь мы должны оповестить пользователя как прошел наш запрос. Чтобы это вывести, нам нужно поместить один из элементов в нашу форму
        form.appendChild(statusMessage);
        // Создаем запрос
        let request = new XMLHttpRequest();
        // Настройка запроса (планируем идти в магазин)
        request.open('POST', 'server.php');
        // Настройка заголовков HTTP-запроса. Наш контент будет содержать данные, полученные из формы
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // Получаем данные, которые ввел пользователь. Используем встроенные объект formData. Чтобы правильно отправлять данные, нужно чтобы в input были поля name. Из этих атрибутов мы будем формировать ключ, а значение введет пользователь
        let formData = new FormData(form);

        // В случае, если необходимо отправить данные в формате json. И в отправке данных request.send(formData) (*) необходимо поменять на переменную json request.send(json);

        let obj = {};
        formData.forEach(function (value, key) {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        //GET получает данные, а POST их отправляет. У POST-запросов есть body
        /*--(*)--*/
        request.send(formData);
        request.addEventListener('readystatechange', function () {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.readyState === 200) {
                statusMessage.innerHTML = message.succes;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
    });

    /*--------------------------------------------------------*/

    //Прописываем запрос. Обработчик вешаем на всю форму. Отслеживать нужно когда форма отправляется на сервер. Вешать на кнопку - ошибка.
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // здесь мы должны оповестить пользователя как прошел наш запрос. Чтобы это вывести, нам нужно поместить один из элементов в нашу форму
        form.appendChild(statusMessage);
        // Создаем запрос
        let request = new XMLHttpRequest();
        // Настройка запроса (планируем идти в магазин)
        request.open('POST', 'server.php');
        // Настройка заголовков HTTP-запроса. Наш контент будет содержать данные, полученные из формы
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // Получаем данные, которые ввел пользователь. Используем встроенные объект formData. Чтобы правильно отправлять данные, нужно чтобы в input были поля name. Из этих атрибутов мы будем формировать ключ, а значение введет пользователь
        let formData = new FormData(form);


        //GET получает данные, а POST их отправляет. У POST-запросов есть body
        request.send(formData);
        request.addEventListener('readystatechange', function () {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.readyState === 200) {
                statusMessage.innerHTML = message.succes;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
    });
});
