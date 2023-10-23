function form() {
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
        inputs = document.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    //Прописываем запрос. Обработчик вешаем на всю форму. Отслеживать нужно когда форма отправляется на сервер. Вешать на кнопку - ошибка.
    formMain.addEventListener('submit', function (event) {
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
}

module.exports = form;
