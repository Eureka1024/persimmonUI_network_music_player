var ffi_rtc = require("ffi_rtc");

var rtc_obj = (function rtc() {
    var date_obj = new Date();
    this.getRtcTime = function() {
        var callback = 0;
        try {
            //判断callback是否存在
            if (arguments.length == 1 && typeof(arguments[0]) == 'function')
                callback = arguments[0];

            if (arguments.length > 1)
                throw new Error('the count of arguments is uncorrect');

            date_obj.setTime(ffi_rtc.rtc_getTime() * 1000);

            return date_obj;

        } catch (error) {
            //捕获到error后执行callback,传回err
            if (typeof(callback) == 'function')
                callback(err);
        }
    }

    this.setRtcDate = function() {
        var callback = 0;
        try {
            //判断callback是否存在
            if (arguments.length > 3 && typeof(arguments[3]) == 'function')
                callback = arguments[3];

            if (arguments.length < 3)
                throw new Error('the count of arguments is uncorrect');
            var i = 0;
            for (i = 0; i < 3; i++)
                if (typeof(arguments[i]) != 'number') {
                    throw new Error('the ' + (i + 1) + 'th of argument is not number');
                }

            var ret = ffi_rtc.rtc_setDate(arguments[0], arguments[1], arguments[2]);

            if (ret != 0)
                throw new Error('set rtc date failed');

            return false;

        } catch (error) {
            //捕获到error后执行callback,传回err
            if (typeof(callback) == 'function') {
                callback(error);
            }
        }
    }

    this.setRtcTime = function() {
        var callback = 0;
        try {
            //判断callback是否存在
            if (arguments.length > 3 && typeof(arguments[3]) == 'function')
                callback = arguments[3];

            if (arguments.length < 3)
                throw new Error('the count of arguments is uncorrect');

            for (var i = 0; i < 3; i++)
                if (typeof(arguments[i]) != 'number')
                    throw new Error('the ' + (i + 1) + 'th of argument is not number');

            var ret = ffi_rtc.rtc_setTime(arguments[0], arguments[1], arguments[2]);

            if (ret != 0)
                throw new Error('set rtc time failed');

            return true;
        } catch (error) {
            //捕获到error后执行callback,传回err
            if (typeof(callback) == 'function')
                callback(error);
        }
    }

    return {
        getRtcTime: getRtcTime,
        setRtcDate: setRtcDate,
        setRtcTime: setRtcTime
    }
})()

module.exports = rtc_obj;