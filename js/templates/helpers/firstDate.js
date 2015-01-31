define('templates/helpers/firstDate', ['hbs/handlebars'], function(HandleBars){
    //this function outputs our custom way of abbreviating days
    Date.prototype.getDayAbbrev = function(){
        var days = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
        return days[this.getDay()];
    };

    //this function outputs our custom way of abbreviating month names
    Date.prototype.getMonthAbbrev = function(){
        var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        return months[this.getMonth()];
    };

    var firstDate = function(array) {
        if(array && array.length > 0 ) {
            var first = array[0];
            var date = new Date(first);
            return date.getDayAbbrev() + ", " + date.getMonthAbbrev() + " " + (date.getDate() +1 );
        }
        else {
            return '';
        }
    };
    HandleBars.registerHelper('firstDate', firstDate);
    return firstDate;
});



