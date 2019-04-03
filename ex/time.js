let currentTime = new Date();
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = {
    getHour() {
        return currentTime.getHours();
    },
    getDayNum() {
        return currentTime.getDay();
    },
    getDay() {
        return days[this.getDayNum()];
    }
}