document.getElementById('signUp').addEventListener('click', validate);
let items = document.querySelectorAll('input#username, input[type=password]');

function validate(e) {
    let message = document.getElementById('message');
    items.forEach(element => {
        let length = element.value.length;
        if (length < 5) {
            element.previousElementSibling.classList.add('missing');
            message.textContent = 'Must be at least 5 char';
            e.preventDefault();
            e.stopPropagation();
        }
        if (length >= 5) {
            element.previousElementSibling.classList.remove('missing');
        }
    });

    let inputName = document.getElementById('name');
    let inputNameLength = inputName.value.length;
    let inputNameClass = inputName.previousElementSibling.classList;

    if (inputNameLength < 4) {
        message.textContent = 'Name must be at least 4 char';
        inputNameClass.add('missing');
        e.preventDefault();
        e.stopPropagation();
    } else if (inputNameLength >= 4) {
        inputNameClass.remove('missing');
    }
    if (!(items[1].value === items[2].value)) {
        message.textContent = 'Password does not match';
        items[1].previousElementSibling.classList.add('missing');
        items[2].previousElementSibling.classList.add('missing');
        e.preventDefault();
        e.stopPropagation();
    } else if (items[1].value === items[2].value && (items[1].value.length > 5)) {
        items[1].previousElementSibling.classList.remove('missing');
        items[2].previousElementSibling.classList.remove('missing');
    }
}