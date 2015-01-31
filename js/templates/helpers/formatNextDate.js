define('templates/helpers/formatNextDate',['hbs/handlebars'], function(HandleBars){

    Date.prototype.getDayFull = function(){
        var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        return days[this.getDay()];
    };

    Date.prototype.getMonthFull = function(){
        var days = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        return days[this.getMonth()];
    };

    var formatNextDate = function(date) {
        if(date) {
            date = new Date(date);
            return date.getDayFull() + ", " + date.getMonthFull() + " " + (date.getDate() +1);
        }
        else
            window.nightly = true;
        return "nightly";
    };

    HandleBars.registerHelper('formatNextDate', formatNextDate);

    return formatNextDate;
});