let currentTime = new Date();
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

module.exports = {
    getHour() {
        return currentTime.getHours();
    },
    getDayNum() {
        return currentTime.getDay();
    },
    getDay() {
        return days[this.getDayNum()];
    },
    caps(str) {
        let last = str.slice(1, str.length);
        let first = str[0].toUpperCase();
        return first + last;
    }
}