const moment = require('moment');
module.exports = {
    formatDate: function (date, targetFormat) {
        return moment(date).format(targetFormat);
    },

    radioCheck: function (value, radioValue) {
        // Write your codes here
        if (value === radioValue) {
            return "checked";
        } else {
            return "";
        }
    },

    replaceCommas: function (value) {
        var result = "none";
        if (value !== null && value !== "") {
            var a = value.toString();
            var regex = /,/gi; //To perform a case insensitive replacement, use the i option in the regex:
            result = a.replace(regex, ' | ');
        }
        return result;
    }
};