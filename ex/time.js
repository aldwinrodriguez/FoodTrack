let currentTime = new Date();
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let funcs = {};

funcs.getHour = function () {
    return currentTime.getHours();
}

funcs.getDayNum = function () {
    return currentTime.getDay();
}

funcs.getDay = function () {
    return days[this.getDayNum()];
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

funcs.lastDayOfPrevMonth = function (m) {
    let ex = new Date(currentTime.getFullYear, this.getMonth(), 0);
    console.log(ex);
    return ex;
}

module.exports = funcs;