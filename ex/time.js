let currentTime = new Date();
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let funcs = {};

funcs.getHour = function () {
    return currentTime.getHours()-3;
}

funcs.getDay = function () {
    return days[currentTime.getDay()];
}

funcs.caps = function (str) {
    let last = str.slice(1, str.length);
    let first = str[0].toUpperCase();
    return first + last;
}

funcs.getDayOfMonth = function () {
    return currentTime.getDate();
}

funcs.getMonth = function () {
    return currentTime.getMonth();
}

funcs.getYear = function () {
    return currentTime.getFullYear();
}

funcs.lastDayOfPrevMonth = function (y, m) {
    return new Date(y, m, 0).getDate();
}

module.exports = funcs;