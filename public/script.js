let items = document.querySelectorAll('input.checkboxItem');
items.forEach(element => {
    element.addEventListener('click', hide);
});

function hide() {
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        if (element.checked) {
            document.getElementById('add').setAttribute('class', 'hide');
            document.getElementById('remove').setAttribute('class', 'show');
            document.getElementById('itemInput').classList.remove('showVis');
            document.getElementById('itemInput').classList.add('hideVis');
            
            // document.getElementById('itemInput').setAttribute('class', 'hide');
            break
        } else {
            document.getElementById('itemInput').classList.remove('hideVis');
            document.getElementById('itemInput').classList.add('showVis');
            document.getElementById('add').setAttribute('class', 'show');
            document.getElementById('remove').setAttribute('class', 'hide');
        }
    }
}