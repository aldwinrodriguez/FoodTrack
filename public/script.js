let checkboxItem = document.querySelectorAll('input.checkboxItem');
let items = document.querySelectorAll('div.itemContainer');
items.forEach(element => {
    element.addEventListener('click', hides);
});

function hides() {
    let checkbox = this.firstChild.nextSibling.firstChild.nextSibling;
    !checkbox.checked ? checkbox.checked = true : checkbox.checked = false;
    this.classList.toggle('highlight');
    for (let i = 0; i < items.length; i++) {
        const element = checkboxItem[i];
        if (element.checked) {
            document.getElementById('add').setAttribute('class', 'hide');
            document.getElementById('remove').setAttribute('class', 'show');
            document.getElementById('itemInput').classList.add('hideVis');
            break
        } else {
            document.getElementById('itemInput').classList.remove('hideVis');
            document.getElementById('add').setAttribute('class', 'show');
            document.getElementById('remove').setAttribute('class', 'hide');
        }
    }
}