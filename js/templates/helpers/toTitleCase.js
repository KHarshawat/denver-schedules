define('templates/helpers/toTitleCase', ['hbs/handlebars'], function(HandleBars){
    String.prototype.toTitleCase = function(){
        var str = this.toString();

        // \u00C0-\u00ff for a happy Latin-1
        return str.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
            return initial.toUpperCase();
        }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
            return match.toLowerCase();
        });
    };

    var toTitleCase = function(array) {
        if(array && array.length > 0 ) {
            return array.toTitleCase();
        }
        else {
            return '';
        }
    };

    HandleBars.registerHelper('toTitleCase', toTitleCase);

    return toTitleCase;
});