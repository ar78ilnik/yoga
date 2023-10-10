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

    let formMain = document.querySelector('.main-form'),
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

    /*----------Переписываем отправку формы с помощью промисов--------------------------*/

    formMain.addEventListener('submit', function (evt) {
        evt.preventDefault();

        console.log('done');
        this.appendChild(statusMessage);

        function sendFormData() {
            return new Promise(function (resolve, reject) {
                let request = new XMLHttpRequest(),
                    formData = new FormData(formMain);

                request.open('POST', 'server.php');
                request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                request.send(formData);
                request.addEventListener('readystatechange', function () {
                    if (request.readyState < 4) {
                        statusMessage.innerHTML = message.loading;
                    } else if (request.readyState === 4 && request.readyState === 200) {
                        resolve();
                    } else {
                        reject();
                    }
                });

            });
        }

        sendFormData().then(statusMessage.innerHTML = message.succes).catch(statusMessage.innerHTML = message.failure);
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

    /*Slider*/

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function () {
        plusSlides(-1);
    });

    next.addEventListener('click', function () {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function (evt) {
        for (let i = 0; i < dots.length + 1; i++) {
            if (evt.target.classList.contains('dot') && evt.target == dots[i - 1]) {
                currentSlide(i);
            }
        }
    });

    /* Calculator*/

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

    totalValue.innerHTML = 0;

    persons.addEventListener('change', function () {
        personsSum = +this.value;
        total = (daysSum + personsSum) * 4000;

        if (restDays.value == '') {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    restDays.addEventListener('change', function () {
        daysSum = +this.value;
        total = (daysSum + personsSum) * 4000;

        if (persons.value == '') {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    place.addEventListener('change', function () {
        if (restDays.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
        } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });

});
