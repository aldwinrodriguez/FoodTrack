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

module.exports = funcs;