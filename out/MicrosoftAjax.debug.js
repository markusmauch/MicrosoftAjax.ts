function $create(type, properties, events, references, element) {
    var component;
    if (type.inheritsFrom(Sys.UI.Control) || type.inheritsFrom(Sys.UI.Behavior)) {
        if (element === null) {
            throw Error.argument("element", Sys.Res.createComponentOnDom);
        }
        component = new type(element);
    }
    else {
        component = new Sys.Component();
    }
    component.beginUpdate();
    if (properties !== null) {
        Sys.Component._setProperties(component, properties);
    }
    if (events !== null) {
        for (var name_1 in events) {
            if (!(component["add_" + name_1] instanceof Function)) {
                throw Error.invalidOperation(String.format(Sys.Res.undefinedEvent, name_1));
            }
            if (!(events[name_1] instanceof Function)) {
                throw Error.invalidOperation(Sys.Res.eventHandlerNotFunction);
            }
            component["add_" + name_1](events[name_1]);
        }
    }
    // if ( component.get_id() !== undefined )
    // {
    //     Sys.Application.addComponent( component );
    // }
    // let creatingComponents = Sys.Application.get_isCreatingComponents();
    // if ( creatingComponents === true )
    // {
    //     Sys.Application._createdComponents.push( component );
    //     if ( references )
    //     {
    //         Sys.Application._addComponentToSecondPass( component, references );
    //     }
    //     else
    //     {
    //         component.endUpdate();
    //     }
    // }
    // else
    // {
    //     if (references)
    //     {
    //         Sys.Component._setReferences( component, references );
    //     }
    //     component.endUpdate();
    // }
    component.endUpdate();
    return component;
}
function $find(id, parent) {
    return null; //Sys.Application.findComponent( id, parent );
}
/**
 * Provides a shortcut to the {@link getElementById} method of the {@link Sys.UI.DomElement} class.
 * This member is static and can be invoked without creating an instance of the class.
 * @param id
 *      The ID of the DOM element to find.
 * @param element
 *      The parent element to search. The default is the document element.
 */
function $get(id, element) {
    return Sys.UI.DomElement.getElementById(id, element);
}
Array.add = function (array, item) {
    array[array.length] = item;
};
Array.addRange = function (array, items) {
    array.push.apply(array, items);
};
Array.clear = function (array) {
    array.length = 0;
};
Array.clone = function (array) {
    if (array.length === 1) {
        return [array[0]];
    }
    else {
        return Array.apply(null, array);
    }
};
Array.contains = function (array, item) {
    return array.indexOf(item) !== -1;
};
Array.dequeue = function (array) {
    return array.shift();
};
Array.enqueue = Array.add;
Array.forEach = function (array, callback, context) {
    for (var i = 0, l = array.length; i < l; i++) {
        var elt = array[i];
        if (elt !== undefined)
            callback.apply(context, [elt, i, array]);
    }
};
Array.indexOf = function (array, item, startIndex) {
    if (startIndex === void 0) { startIndex = 0; }
    var rest = array.slice(startIndex);
    return rest.indexOf(item);
};
Array.insert = function (array, index, item) {
    array.splice(index, 0, item);
};
Array.parse = function (value) {
    if (value === undefined)
        return [];
    var v = eval(value);
    if (!Array.isInstanceOfType(v))
        throw Error.argument("value", Sys.Res.arrayParseBadFormat);
    return v;
};
Array.remove = function (array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return (index >= 0);
};
Array.removeAt = function (array, index) {
    array.splice(index, 1);
};
Boolean.parse = function (value) {
    var v = value.trim().toLowerCase();
    if (v === "false")
        return false;
    if (v === "true")
        return true;
    throw Error.argumentOutOfRange("value", value, Sys.Res.boolTrueOrFalse);
};
Date.prototype.format = function (format) {
    return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
};
Date.prototype.localeFormat = function (format) {
    return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
};
Date.prototype._toFormattedString = function (format, cultureInfo) {
    var dtf = cultureInfo.dateTimeFormat;
    //let convert = dtf.Calendar.convert;
    if (!format || !format.length || (format === 'i')) {
        if (cultureInfo && cultureInfo.name.length) {
            var eraDate = new Date(this.getTime());
            var era = Date._getEra(this, dtf.eras);
            eraDate.setFullYear(Date._getEraYear(this, dtf, era));
            return eraDate.toLocaleString();
        }
        else {
            return this.toString();
        }
    }
    var eras = dtf.eras, sortable = (format === "s");
    format = Date._expandFormat(dtf, format);
    var ret = new Sys.StringBuilder();
    var hour;
    function addLeadingZero(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num.toString();
    }
    function addLeadingZeros(num) {
        if (num < 10) {
            return '00' + num;
        }
        if (num < 100) {
            return '0' + num;
        }
        return num.toString();
    }
    function padYear(year) {
        if (year < 10) {
            return '000' + year;
        }
        else if (year < 100) {
            return '00' + year;
        }
        else if (year < 1000) {
            return '0' + year;
        }
        return year.toString();
    }
    var foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g;
    function hasDay() {
        if (foundDay || checkedDay) {
            return foundDay;
        }
        foundDay = dayPartRegExp.test(format);
        checkedDay = true;
        return foundDay;
    }
    var quoteCount = 0, tokenRegExp = Date._getTokenRegExp(), converted;
    for (;;) {
        var index = tokenRegExp.lastIndex;
        var ar = tokenRegExp.exec(format);
        var preMatch = format.slice(index, ar ? ar.index : format.length);
        quoteCount += Date._appendPreOrPostMatch(preMatch, ret);
        if (!ar)
            break;
        if ((quoteCount % 2) === 1) {
            ret.append(ar[0]);
            continue;
        }
        var getPart = function (date, part) {
            if (converted) {
                return converted[part];
            }
            switch (part) {
                case 0:
                    return date.getFullYear();
                case 1:
                    return date.getMonth();
                case 2:
                    return date.getDate();
            }
        };
        switch (ar[0]) {
            case "dddd":
                ret.append(dtf.DayNames[this.getDay()]);
                break;
            case "ddd":
                ret.append(dtf.AbbreviatedDayNames[this.getDay()]);
                break;
            case "dd":
                foundDay = true;
                ret.append(addLeadingZero(getPart(this, 2)));
                break;
            case "d":
                foundDay = true;
                ret.append(getPart(this, 2));
                break;
            case "MMMM":
                ret.append((dtf.MonthGenitiveNames && hasDay()) ?
                    dtf.MonthGenitiveNames[getPart(this, 1)] :
                    dtf.MonthNames[getPart(this, 1)]);
                break;
            case "MMM":
                ret.append((dtf.AbbreviatedMonthGenitiveNames && hasDay()) ?
                    dtf.AbbreviatedMonthGenitiveNames[getPart(this, 1)] :
                    dtf.AbbreviatedMonthNames[getPart(this, 1)]);
                break;
            case "MM":
                ret.append(addLeadingZero(getPart(this, 1) + 1));
                break;
            case "M":
                ret.append(getPart(this, 1) + 1);
                break;
            case "yyyy":
                ret.append(padYear(converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)));
                break;
            case "yy":
                ret.append(addLeadingZero((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100));
                break;
            case "y":
                ret.append(((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100).toString());
                break;
            case "hh":
                hour = this.getHours() % 12;
                if (hour === 0)
                    hour = 12;
                ret.append(addLeadingZero(hour));
                break;
            case "h":
                hour = this.getHours() % 12;
                if (hour === 0)
                    hour = 12;
                ret.append(hour);
                break;
            case "HH":
                ret.append(addLeadingZero(this.getHours()));
                break;
            case "H":
                ret.append(this.getHours());
                break;
            case "mm":
                ret.append(addLeadingZero(this.getMinutes()));
                break;
            case "m":
                ret.append(this.getMinutes());
                break;
            case "ss":
                ret.append(addLeadingZero(this.getSeconds()));
                break;
            case "s":
                ret.append(this.getSeconds());
                break;
            case "tt":
                ret.append((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator);
                break;
            case "t":
                ret.append(((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator).charAt(0));
                break;
            case "f":
                ret.append(addLeadingZeros(this.getMilliseconds()).charAt(0));
                break;
            case "ff":
                ret.append(addLeadingZeros(this.getMilliseconds()).substr(0, 2));
                break;
            case "fff":
                ret.append(addLeadingZeros(this.getMilliseconds()));
                break;
            case "z":
                hour = this.getTimezoneOffset() / 60;
                ret.append(((hour <= 0) ? '+' : '-') + Math.floor(Math.abs(hour)));
                break;
            case "zz":
                hour = this.getTimezoneOffset() / 60;
                ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))));
                break;
            case "zzz":
                hour = this.getTimezoneOffset() / 60;
                ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))) +
                    ":" + addLeadingZero(Math.abs(this.getTimezoneOffset() % 60)));
                break;
            case "g":
            case "gg":
                if (dtf.eras) {
                    ret.append(dtf.eras[Date._getEra(this, eras) + 1]);
                }
                break;
            case "/":
                ret.append(dtf.DateSeparator);
                break;
        }
    }
    return ret.toString();
};
Date.parseLocal = function (value) {
    var formats = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        formats[_i - 1] = arguments[_i];
    }
    return Date._parse(value, Sys.CultureInfo.CurrentCulture, arguments);
};
Date.parseInvariant = function (value) {
    var formats = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        formats[_i - 1] = arguments[_i];
    }
    return Date._parse(value, Sys.CultureInfo.InvariantCulture, arguments);
};
Date._parse = function (value, cultureInfo, args) {
    var i, l, date, format, formats, custom = false;
    for (i = 1, l = args.length; i < l; i++) {
        format = args[i];
        if (format) {
            custom = true;
            date = Date._parseExact(value, format, cultureInfo);
            if (date)
                return date;
        }
    }
    if (!custom) {
        formats = cultureInfo._getDateTimeFormats();
        for (i = 0, l = formats.length; i < l; i++) {
            date = Date._parseExact(value, formats[i], cultureInfo);
            if (date)
                return date;
        }
    }
    return null;
};
Date._parseExact = function (value, format, cultureInfo) {
    value = value.trim();
    var dtf = cultureInfo.dateTimeFormat;
    var parseInfo = Date._getParseRegExp(dtf, format);
    var match = new RegExp(parseInfo.regExp).exec(value);
    if (match === null)
        return null;
    var groups = parseInfo.groups;
    var era = null;
    var year = null;
    var month = null;
    var date = null;
    var weekDay = null;
    var hour = 0;
    var hourOffset, min = 0;
    var sec = 0;
    var msec = 0;
    var tzMinOffset = null;
    var pmHour = false;
    for (var j = 0, jl = groups.length; j < jl; j++) {
        var matchGroup = match[j + 1];
        if (matchGroup) {
            switch (groups[j]) {
                case 'dd':
                case 'd':
                    date = parseInt(matchGroup, 10);
                    if ((date < 1) || (date > 31))
                        return null;
                    break;
                case 'MMMM':
                    month = cultureInfo._getMonthIndex(matchGroup);
                    if ((month < 0) || (month > 11))
                        return null;
                    break;
                case 'MMM':
                    month = cultureInfo._getAbbrMonthIndex(matchGroup);
                    if ((month < 0) || (month > 11))
                        return null;
                    break;
                case 'M':
                case 'MM':
                    month = parseInt(matchGroup, 10) - 1;
                    if ((month < 0) || (month > 11))
                        return null;
                    break;
                case 'y':
                case 'yy':
                    year = Date._expandYear(dtf, parseInt(matchGroup, 10));
                    if ((year < 0) || (year > 9999))
                        return null;
                    break;
                case 'yyyy':
                    year = parseInt(matchGroup, 10);
                    if ((year < 0) || (year > 9999))
                        return null;
                    break;
                case 'h':
                case 'hh':
                    hour = parseInt(matchGroup, 10);
                    if (hour === 12)
                        hour = 0;
                    if ((hour < 0) || (hour > 11))
                        return null;
                    break;
                case 'H':
                case 'HH':
                    hour = parseInt(matchGroup, 10);
                    if ((hour < 0) || (hour > 23))
                        return null;
                    break;
                case 'm':
                case 'mm':
                    min = parseInt(matchGroup, 10);
                    if ((min < 0) || (min > 59))
                        return null;
                    break;
                case 's':
                case 'ss':
                    sec = parseInt(matchGroup, 10);
                    if ((sec < 0) || (sec > 59))
                        return null;
                    break;
                case 'tt':
                case 't':
                    var upperToken = matchGroup.toUpperCase();
                    pmHour = (upperToken === dtf.PMDesignator.toUpperCase());
                    if (!pmHour && (upperToken !== dtf.AMDesignator.toUpperCase()))
                        return null;
                    break;
                case 'f':
                    msec = parseInt(matchGroup, 10) * 100;
                    if ((msec < 0) || (msec > 999))
                        return null;
                    break;
                case 'ff':
                    msec = parseInt(matchGroup, 10) * 10;
                    if ((msec < 0) || (msec > 999))
                        return null;
                    break;
                case 'fff':
                    msec = parseInt(matchGroup, 10);
                    if ((msec < 0) || (msec > 999))
                        return null;
                    break;
                case 'dddd':
                    weekDay = cultureInfo._getDayIndex(matchGroup);
                    if ((weekDay < 0) || (weekDay > 6))
                        return null;
                    break;
                case 'ddd':
                    weekDay = cultureInfo._getAbbrDayIndex(matchGroup);
                    if ((weekDay < 0) || (weekDay > 6))
                        return null;
                    break;
                case 'zzz':
                    var offsets = matchGroup.split(/:/);
                    if (offsets.length !== 2)
                        return null;
                    hourOffset = parseInt(offsets[0], 10);
                    if ((hourOffset < -12) || (hourOffset > 13))
                        return null;
                    var minOffset = parseInt(offsets[1], 10);
                    if ((minOffset < 0) || (minOffset > 59))
                        return null;
                    tzMinOffset = (hourOffset * 60) + (matchGroup.startsWith('-') ? -minOffset : minOffset);
                    break;
                case 'z':
                case 'zz':
                    hourOffset = parseInt(matchGroup, 10);
                    if ((hourOffset < -12) || (hourOffset > 13))
                        return null;
                    tzMinOffset = hourOffset * 60;
                    break;
                case 'g':
                case 'gg':
                    var eraName = matchGroup;
                    if (!eraName || !dtf.eras)
                        return null;
                    eraName = eraName.toLowerCase().trim();
                    for (var i = 0, l = dtf.eras.length; i < l; i += 4) {
                        if (eraName === dtf.eras[i + 1].toLowerCase()) {
                            era = i;
                            break;
                        }
                    }
                    if (era === null)
                        return null;
                    break;
            }
        }
    }
    var result = new Date();
    var defaultYear = result.getFullYear();
    if (year === null) {
        year = defaultYear;
    }
    else if (dtf.eras) {
        year += dtf.eras[(era || 0) + 3];
    }
    if (month === null) {
        month = 0;
    }
    if (date === null) {
        date = 1;
    }
    result.setFullYear(year, month, date);
    if (result.getDate() !== date)
        return null;
    if ((weekDay !== null) && (result.getDay() !== weekDay)) {
        return null;
    }
    if (pmHour && (hour < 12)) {
        hour += 12;
    }
    result.setHours(hour, min, sec, msec);
    if (tzMinOffset !== null) {
        var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
        result.setHours(result.getHours() + parseInt((adjustedMin / 60).toString(), 10), adjustedMin % 60);
    }
    return result;
};
Date._getParseRegExp = function (dtf, format) {
    if (!dtf._parseRegExp) {
        dtf._parseRegExp = {};
    }
    else if (dtf._parseRegExp[format]) {
        return dtf._parseRegExp[format];
    }
    var expFormat = Date._expandFormat(dtf, format);
    expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");
    var regexp = new Sys.StringBuilder("^");
    var groups = [];
    var index = 0;
    var quoteCount = 0;
    var tokenRegExp = Date._getTokenRegExp();
    var match;
    while ((match = tokenRegExp.exec(expFormat)) !== null) {
        var preMatch = expFormat.slice(index, match.index);
        index = tokenRegExp.lastIndex;
        quoteCount += Date._appendPreOrPostMatch(preMatch, regexp);
        if ((quoteCount % 2) === 1) {
            regexp.append(match[0]);
            continue;
        }
        switch (match[0]) {
            case 'dddd':
            case 'ddd':
            case 'MMMM':
            case 'MMM':
            case 'gg':
            case 'g':
                regexp.append("(\\D+)");
                break;
            case 'tt':
            case 't':
                regexp.append("(\\D*)");
                break;
            case 'yyyy':
                regexp.append("(\\d{4})");
                break;
            case 'fff':
                regexp.append("(\\d{3})");
                break;
            case 'ff':
                regexp.append("(\\d{2})");
                break;
            case 'f':
                regexp.append("(\\d)");
                break;
            case 'dd':
            case 'd':
            case 'MM':
            case 'M':
            case 'yy':
            case 'y':
            case 'HH':
            case 'H':
            case 'hh':
            case 'h':
            case 'mm':
            case 'm':
            case 'ss':
            case 's':
                regexp.append("(\\d\\d?)");
                break;
            case 'zzz':
                regexp.append("([+-]?\\d\\d?:\\d{2})");
                break;
            case 'zz':
            case 'z':
                regexp.append("([+-]?\\d\\d?)");
                break;
            case '/':
                regexp.append("(\\" + dtf.DateSeparator + ")");
                break;
        }
        Array.add(groups, match[0]);
    }
    Date._appendPreOrPostMatch(expFormat.slice(index), regexp);
    regexp.append("$");
    var regexpStr = regexp.toString().replace(/\s+/g, "\\s+");
    var parseRegExp = { regExp: regexpStr, groups: groups };
    dtf._parseRegExp[format] = parseRegExp;
    return parseRegExp;
};
Date._getTokenRegExp = function () {
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};
Date._appendPreOrPostMatch = function (preMatch, strBuilder) {
    var quoteCount = 0;
    var escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
        var c = preMatch.charAt(i);
        switch (c) {
            case '\'':
                if (escaped)
                    strBuilder.append("'");
                else
                    quoteCount++;
                escaped = false;
                break;
            case '\\':
                if (escaped)
                    strBuilder.append("\\");
                escaped = !escaped;
                break;
            default:
                strBuilder.append(c);
                escaped = false;
                break;
        }
    }
    return quoteCount;
};
Date._expandYear = function (dtf, year) {
    var now = new Date(), era = Date._getEra(now);
    if (year < 100) {
        var curr = Date._getEraYear(now, dtf, era);
        year += curr - (curr % 100);
        if (year > dtf.Calendar.TwoDigitYearMax) {
            year -= 100;
        }
    }
    return year;
};
Date._getEra = function (date, eras) {
    if (!eras)
        return 0;
    var start, ticks = date.getTime();
    for (var i = 0, l = eras.length; i < l; i += 4) {
        start = eras[i + 2];
        if ((start === null) || (ticks >= start)) {
            return i;
        }
    }
    return 0;
};
Date._getEraYear = function (date, dtf, era, sortable) {
    var year = date.getFullYear();
    if (!sortable && dtf.eras) {
        year -= dtf.eras[era + 3];
    }
    return year;
};
Date._expandFormat = function (dtf, format) {
    if (!format) {
        format = "F";
    }
    var len = format.length;
    if (len === 1) {
        switch (format) {
            case "d":
                return dtf.ShortDatePattern;
            case "D":
                return dtf.LongDatePattern;
            case "t":
                return dtf.ShortTimePattern;
            case "T":
                return dtf.LongTimePattern;
            case "f":
                return dtf.LongDatePattern + " " + dtf.ShortTimePattern;
            case "F":
                return dtf.FullDateTimePattern;
            case "M":
            case "m":
                return dtf.MonthDayPattern;
            case "s":
                return dtf.SortableDateTimePattern;
            case "Y":
            case "y":
                return dtf.YearMonthPattern;
            default:
                throw Error.format(Sys.Res.formatInvalidString);
        }
    }
    else if ((len === 2) && (format.charAt(0) === "%")) {
        format = format.charAt(1);
    }
    return format;
};
var _this = this;
Error.argument = function (paramName, message) {
    var displayMessage = "Sys.ArgumentException: " + (message ? message : Sys.Res.argument);
    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }
    var err = Error.create(displayMessage, { name: "Sys.ArgumentException", paramName: paramName });
    err.popStackFrame();
    return err;
};
Error.argumentNull = function (paramName, message) {
    var displayMessage = "Sys.ArgumentNullException: " + (message ? message : Sys.Res.argumentNull);
    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }
    var err = Error.create(displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName || "" });
    err.popStackFrame();
    return err;
};
Error.argumentOutOfRange = function (paramName, actualValue, message) {
    var displayMessage = "Sys.ArgumentOutOfRangeException: " + (message ? message : Sys.Res.argumentOutOfRange);
    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }
    if (typeof (actualValue) !== "undefined" && actualValue !== null) {
        displayMessage += "\n" + String.format(Sys.Res.actualValue, actualValue);
    }
    var err = Error.create(displayMessage, {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: paramName || "",
        actualValue: actualValue || ""
    });
    err.popStackFrame();
    return err;
};
Error.create = function (message, errorInfo) {
    message = message || "";
    var err = new Error(message);
    err.message = message;
    if (errorInfo !== undefined) {
        for (var v in errorInfo) {
            err[v] = errorInfo[v];
        }
    }
    err.popStackFrame();
    return err;
};
Error.format = function (message) {
    var displayMessage = "Sys.InvalidOperationException: " + (message ? message : Sys.Res.invalidOperation);
    var err = Error.create(displayMessage, { name: 'Sys.InvalidOperationException' });
    err.popStackFrame();
    return err;
};
Error.invalidOperation = function (message) {
    var displayMessage = "Sys.InvalidOperationException: " + (message ? message : Sys.Res.invalidOperation);
    var err = Error.create(displayMessage, { name: 'Sys.InvalidOperationException' });
    err.popStackFrame();
    return err;
};
Error.notImplemented = function (message) {
    var displayMessage = "Sys.NotImplementedException: " + (message ? message : Sys.Res.notImplemented);
    var err = Error.create(displayMessage, { name: 'Sys.NotImplementedException' });
    err.popStackFrame();
    return err;
};
Error.prototype.popStackFrame = function () {
    if (typeof (_this.stack) === "undefined" || _this.stack === null ||
        typeof (_this.fileName) === "undefined" || _this.fileName === null ||
        typeof (_this.lineNumber) === "undefined" || _this.lineNumber === null) {
        return;
    }
    var stackFrames = _this.stack.split("\n");
    var currentFrame = stackFrames[0];
    var pattern = _this.fileName + ":" + _this.lineNumber;
    while (typeof (currentFrame) !== "undefined" &&
        currentFrame !== null &&
        currentFrame.indexOf(pattern) === -1) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }
    var nextFrame = stackFrames[1];
    if (typeof (nextFrame) === "undefined" || nextFrame === null) {
        return;
    }
    var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
    if (typeof (nextFrameParts) === "undefined" || nextFrameParts === null) {
        return;
    }
    _this.fileName = nextFrameParts[1];
    _this.lineNumber = parseInt(nextFrameParts[2]);
    stackFrames.shift();
    _this.stack = stackFrames.join("\n");
};
Function.createDelegate = function (instance, method) {
    return function () {
        return method.apply(instance, arguments);
    };
};
Function.emptyMethod = function () { };
Function.prototype.getName = function () {
    return Object.getTypeName(this);
};
Function.prototype.isInstanceOfType = function (instance) {
    return instance instanceof this;
};
Function.prototype.implementsInterface = function (interfaceType) {
    return this instanceof interfaceType;
};
Function.prototype.inheritsFrom = function (parentType) {
    return this.prototype instanceof parentType;
};
var Type = Function;
Number.prototype.format = function (format) {
    return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
};
Number.prototype.localeFormat = function (format) {
    return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
};
Number.prototype._toFormattedString = function (format, cultureInfo) {
    if (!format || (format.length === 0) || (format === 'i')) {
        if (cultureInfo && (cultureInfo.name.length > 0)) {
            return this.toLocaleString();
        }
        else {
            return this.toString();
        }
    }
    var _percentPositivePattern = ["n %", "n%", "%n"];
    var _percentNegativePattern = ["-n %", "-n%", "-%n"];
    var _numberNegativePattern = ["(n)", "-n", "- n", "n-", "n -"];
    var _currencyPositivePattern = ["$n", "n$", "$ n", "n $"];
    var _currencyNegativePattern = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];
    function zeroPad(str, count, left) {
        for (var l = str.length; l < count; l++) {
            str = (left ? ('0' + str) : (str + '0'));
        }
        return str;
    }
    var expandNumber = function (number, precision, groupSizes, sep, decimalChar) {
        var curSize = groupSizes[0];
        var curGroupIndex = 1;
        var factor = Math.pow(10, precision);
        var rounded = (Math.round(number * factor) / factor);
        if (!isFinite(rounded)) {
            rounded = number;
        }
        number = rounded;
        var numberString = number.toString();
        var right = "";
        var exponent;
        var split = numberString.split(/e/i);
        numberString = split[0];
        exponent = (split.length > 1 ? parseInt(split[1]) : 0);
        split = numberString.split('.');
        numberString = split[0];
        right = split.length > 1 ? split[1] : "";
        var l;
        if (exponent > 0) {
            right = zeroPad(right, exponent, false);
            numberString += right.slice(0, exponent);
            right = right.substr(exponent);
        }
        else if (exponent < 0) {
            exponent = -exponent;
            numberString = zeroPad(numberString, exponent + 1, true);
            right = numberString.slice(-exponent, numberString.length) + right;
            numberString = numberString.slice(0, -exponent);
        }
        if (precision > 0) {
            if (right.length > precision) {
                right = right.slice(0, precision);
            }
            else {
                right = zeroPad(right, precision, false);
            }
            right = decimalChar + right;
        }
        else {
            right = "";
        }
        var stringIndex = numberString.length - 1;
        var ret = "";
        while (stringIndex >= 0) {
            if (curSize === 0 || curSize > stringIndex) {
                if (ret.length > 0) {
                    return parseInt(numberString.slice(0, stringIndex + 1) + sep + ret + right);
                }
                else {
                    return parseInt(numberString.slice(0, stringIndex + 1) + right);
                }
            }
            if (ret.length > 0)
                ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + sep + ret;
            else
                ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1);
            stringIndex -= curSize;
            if (curGroupIndex < groupSizes.length) {
                curSize = groupSizes[curGroupIndex];
                curGroupIndex++;
            }
        }
        return parseInt(numberString.slice(0, stringIndex + 1) + sep + ret + right);
    };
    var nf = cultureInfo.numberFormat;
    var number = Math.abs(this);
    if (!format)
        format = "D";
    var precision = -1;
    if (format.length > 1)
        precision = parseInt(format.slice(1), 10);
    var pattern;
    switch (format.charAt(0)) {
        case "d":
        case "D":
            pattern = 'n';
            if (precision !== -1) {
                number = zeroPad("" + number, precision, true);
            }
            if (this < 0)
                number = -number;
            break;
        case "c":
        case "C":
            if (this < 0)
                pattern = _currencyNegativePattern[nf.CurrencyNegativePattern];
            else
                pattern = _currencyPositivePattern[nf.CurrencyPositivePattern];
            if (precision === -1)
                precision = nf.CurrencyDecimalDigits;
            number = expandNumber(Math.abs(this), precision, nf.CurrencyGroupSizes, nf.CurrencyGroupSeparator, nf.CurrencyDecimalSeparator);
            break;
        case "n":
        case "N":
            if (this < 0)
                pattern = _numberNegativePattern[nf.NumberNegativePattern];
            else
                pattern = 'n';
            if (precision === -1)
                precision = nf.NumberDecimalDigits;
            number = expandNumber(Math.abs(this), precision, nf.NumberGroupSizes, nf.NumberGroupSeparator, nf.NumberDecimalSeparator);
            break;
        case "p":
        case "P":
            if (this < 0)
                pattern = _percentNegativePattern[nf.PercentNegativePattern];
            else
                pattern = _percentPositivePattern[nf.PercentPositivePattern];
            if (precision === -1)
                precision = nf.PercentDecimalDigits;
            number = expandNumber(Math.abs(this) * 100, precision, nf.PercentGroupSizes, nf.PercentGroupSeparator, nf.PercentDecimalSeparator);
            break;
        default:
            throw Error.format(Sys.Res.formatBadFormatSpecifier);
    }
    var regex = /n|\$|-|%/g;
    var ret = "";
    for (;;) {
        var index = regex.lastIndex;
        var ar = regex.exec(pattern);
        ret += pattern.slice(index, ar ? ar.index : pattern.length);
        if (!ar)
            break;
        switch (ar[0]) {
            case "n":
                ret += number;
                break;
            case "$":
                ret += nf.CurrencySymbol;
                break;
            case "-":
                if (/[1-9]/.test(number.toString())) {
                    ret += nf.NegativeSign;
                }
                break;
            case "%":
                ret += nf.PercentSymbol;
                break;
        }
    }
    return ret;
};
Number.parseLocale = function (value) {
    return Number._parse(value, Sys.CultureInfo.CurrentCulture);
};
Number.parseInvariant = function (value) {
    return Number._parse(value, Sys.CultureInfo.InvariantCulture);
};
Number._parse = function (value, cultureInfo) {
    value = value.trim();
    if (value.match(/^[+-]?infinity$/i)) {
        return parseFloat(value);
    }
    if (value.match(/^0x[a-f0-9]+$/i)) {
        return parseInt(value);
    }
    var numFormat = cultureInfo.numberFormat;
    var signInfo = Number._parseNumberNegativePattern(value, numFormat, numFormat.NumberNegativePattern);
    var sign = signInfo[0];
    var num = signInfo[1];
    if ((sign === '') && (numFormat.NumberNegativePattern !== 1)) {
        signInfo = Number._parseNumberNegativePattern(value, numFormat, 1);
        sign = signInfo[0];
        num = signInfo[1];
    }
    if (sign === '')
        sign = '+';
    var exponent;
    var intAndFraction;
    var exponentPos = num.indexOf('e');
    if (exponentPos < 0)
        exponentPos = num.indexOf('E');
    if (exponentPos < 0) {
        intAndFraction = num;
        exponent = null;
    }
    else {
        intAndFraction = num.substr(0, exponentPos);
        exponent = num.substr(exponentPos + 1);
    }
    var integer;
    var fraction;
    var decimalPos = intAndFraction.indexOf(numFormat.NumberDecimalSeparator);
    if (decimalPos < 0) {
        integer = intAndFraction;
        fraction = null;
    }
    else {
        integer = intAndFraction.substr(0, decimalPos);
        fraction = intAndFraction.substr(decimalPos + numFormat.NumberDecimalSeparator.length);
    }
    integer = integer.split(numFormat.NumberGroupSeparator).join('');
    var altNumGroupSeparator = numFormat.NumberGroupSeparator.replace(/\u00A0/g, " ");
    if (numFormat.NumberGroupSeparator !== altNumGroupSeparator) {
        integer = integer.split(altNumGroupSeparator).join('');
    }
    var p = sign + integer;
    if (fraction !== null) {
        p += '.' + fraction;
    }
    if (exponent !== null) {
        var expSignInfo = Number._parseNumberNegativePattern(exponent, numFormat, 1);
        if (expSignInfo[0] === '') {
            expSignInfo[0] = '+';
        }
        p += 'e' + expSignInfo[0] + expSignInfo[1];
    }
    if (p.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) {
        return parseFloat(p);
    }
    return Number.NaN;
};
Number._parseNumberNegativePattern = function (value, numFormat, numberNegativePattern) {
    var neg = numFormat.NegativeSign;
    var pos = numFormat.PositiveSign;
    switch (numberNegativePattern) {
        case 4:
            neg = ' ' + neg;
            pos = ' ' + pos;
        case 3:
            if (value.endsWith(neg)) {
                return ['-', value.substr(0, value.length - neg.length)];
            }
            else if (value.endsWith(pos)) {
                return ['+', value.substr(0, value.length - pos.length)];
            }
            break;
        case 2:
            neg += ' ';
            pos += ' ';
        case 1:
            if (value.startsWith(neg)) {
                return ['-', value.substr(neg.length)];
            }
            else if (value.startsWith(pos)) {
                return ['+', value.substr(pos.length)];
            }
            break;
        case 0:
            if (value.startsWith('(') && value.endsWith(')')) {
                return ['-', value.substr(1, value.length - 2)];
            }
            break;
    }
    return ['', value];
};
Object.getType = function (instance) {
    var ctor = instance.constructor;
    if (!ctor || (typeof (ctor) !== "function")) {
        return Object;
    }
    return ctor;
};
Object.getTypeName = function (instance) {
    var constructorString = instance.constructor.toString();
    return constructorString.match(/\w+/g)[1];
};
String.prototype.startsWith = function (prefix) {
    return (this.substr(0, prefix.length) === prefix);
};
String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
};
String.prototype.trimEnd = function () {
    return this.trimRight();
};
String.prototype.trimStart = function () {
    return this.trimLeft();
};
String.format = function (format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return String._toFormattedString(false, format, args);
};
String.localeFormat = function (format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return String._toFormattedString(true, format, args);
};
String._toFormattedString = function (useLocale, format, args) {
    var result = "";
    for (var i = 0;;) {
        var open = format.indexOf('{', i);
        var close = format.indexOf('}', i);
        if ((open < 0) && (close < 0)) {
            result += format.slice(i);
            break;
        }
        if ((close > 0) && ((close < open) || (open < 0))) {
            if (format.charAt(close + 1) !== '}') {
                throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
            }
            result += format.slice(i, close + 1);
            i = close + 2;
            continue;
        }
        result += format.slice(i, open);
        i = open + 1;
        if (format.charAt(i) === '{') {
            result += '{';
            i++;
            continue;
        }
        if (close < 0) {
            throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
        }
        var brace = format.substring(i, close);
        var colonIndex = brace.indexOf(":");
        var argNumber = parseInt((colonIndex < 0)
            ? brace
            : brace.substring(0, colonIndex), 10);
        if (isNaN(argNumber))
            throw Error.argument("format", Sys.Res.stringFormatInvalid);
        var argFormat = (colonIndex < 0)
            ? ''
            : brace.substring(colonIndex + 1);
        var arg = args[argNumber];
        if (arg === undefined || arg === null) {
            arg = "";
        }
        if (arg.toFormattedString) {
            result += arg.toFormattedString(argFormat);
        }
        else if (useLocale && arg.localeFormat) {
            result += arg.localeFormat(argFormat);
        }
        else if (arg.format) {
            result += arg.format(argFormat);
        }
        else {
            result += arg.toString();
        }
        i = close + 1;
    }
    return result;
};
var Sys;
(function (Sys) {
    /**
     * Creates a dictionary of client events for a component, with event names as keys and the associated handlers as values.
     */
    var EventHandlerList = (function () {
        function EventHandlerList() {
            this._list = {};
        }
        /**
         * Attaches a handler to an event in an {@link Sys.EventHandlerList} instance and adds the event to the list if it is not already present.
         * @param id
         *      A string that specifies the event.
         * @param handler
         *      The name of the method to handle the event.
         */
        EventHandlerList.prototype.addHandler = function (id, handler) {
            var list = this._getEvent(id, true);
            if (list !== null) {
                Array.add(list, handler);
            }
        };
        /**
         * Returns a single method that can be invoked to call all handlers sequentially for the specified event.
         * @param id
         *      The ID for the specified event.
         * @returns
         *      A single method that can be invoked to call all handlers sequentially for the specified event.
         */
        EventHandlerList.prototype.getHandler = function (id) {
            var evt = this._getEvent(id);
            if (!evt || (evt.length === 0))
                return null;
            var clone = Array.clone(evt) || [];
            return function (sender, args) {
                //if ( args === undefined )
                //{
                //args = {};
                //}
                for (var i = 0, l = clone.length; i < l; i++) {
                    clone[i](sender, args);
                }
            };
        };
        /**
         * Removes an event handler from an event in an {@libnk Sys.EventHandlerList} instance.
         * @param id
         *      The ID for the event.
         * @param handler
         *      The handler to remove from the event.
         */
        EventHandlerList.prototype.removeHandler = function (id, handler) {
            var list = this._getEvent(id, true);
            if (list !== null) {
                Array.remove(list, handler);
            }
        };
        EventHandlerList.prototype._getEvent = function (id, create) {
            if (create === void 0) { create = false; }
            if (this._list[id] === undefined) {
                if (create === false)
                    return null;
                this._list[id] = [];
            }
            return this._list[id];
        };
        return EventHandlerList;
    }());
    Sys.EventHandlerList = EventHandlerList;
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    ;
    ;
    /**
     * Provides the base class for the Control and Behavior classes, and for any other object whose lifetime should be managed by the ASP.NET AJAX client library.
     */
    var Component = (function () {
        /**
         * When overridden in a derived class, initializes an instance of that class and registers it with the application as a disposable object.
         */
        function Component() {
            this._initialized = false;
            this._disposed = false;
            this._updating = false;
            this._events = new Sys.EventHandlerList();
            if (window["Application"] !== undefined)
                window["Application"].registerDisposableObject(this);
        }
        Component.prototype.get_events = function () {
            return this._events;
        };
        /**
         * Gets the ID of the current Component object.
         * @returns
         *      A string that contains the ID of the component.
         */
        Component.prototype.get_id = function () {
            return this._id;
        };
        /**
         * Sets the ID of the current Component object.
         * @param id
         *      A string that contains the ID of the component.
         */
        Component.prototype.set_id = function (id) {
            this._id = id;
        };
        /**
         * Gets a value indicating whether the current Component object is initialized.
         * @returns
         *      true if the current Component is initialized; otherwise, false.
         */
        Component.prototype.get_isInitialized = function () {
            return this._initialized;
        };
        /**
         * Gets a value indicating whether the current Component object is updating.
         * @returns
         *      true if the current Component object is updating; otherwise, false.
         */
        Component.prototype.get_isUpdating = function () {
            return this._updating;
        };
        /**
         * Raised when the dispose method is called for a component.
         * @param handler
         *      The event handler function to add or remove.
         */
        Component.prototype.add_disposing = function (handler) {
            this.get_events().addHandler("disposing", handler);
        };
        /**
         * Raised when the dispose method is called for a component.
         * @param handler
         *      The event handler function to add or remove.
         */
        Component.prototype.remove_disposing = function (handler) {
            this.get_events().removeHandler("disposing", handler);
        };
        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        Component.prototype.add_propertyChanged = function (handler) {
            this.get_events().addHandler("propertyChanged", handler);
        };
        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        Component.prototype.remove_propertyChanged = function (handler) {
            this.get_events().removeHandler("propertyChanged", handler);
        };
        /**
         * Called by the create method to indicate that the process of setting properties of a component instance has begun.
         */
        Component.prototype.beginUpdate = function () {
            this._updating = true;
        };
        Component.prototype.dispose = function () {
            if (this._disposed === false) {
                // do dispose
                this._disposed = true;
            }
        };
        /**
         * Called by the create method to indicate that the process of setting properties of a component instance has finished.
         */
        Component.prototype.endUpdate = function () {
            this._updating = false;
            if (!this._initialized)
                this.initialize();
            this.updated();
        };
        Component.prototype.initialize = function () {
            this._initialized = true;
        };
        Component.prototype.updated = function () { };
        Component._setReferences = function (component, references) {
            for (var name_2 in references) {
                var setter = component["set_" + name_2];
                var reference = references[name_2]; // $find( name ); // TODO
                if (typeof (setter) !== "function") {
                    throw Error.invalidOperation(String.format(Sys.Res.propertyNotWritable, name_2));
                }
                if (!reference) {
                    throw Error.invalidOperation(String.format(Sys.Res.referenceNotFound, name_2));
                }
                setter.apply(component, [reference]);
            }
        };
        Component._setProperties = function (target, properties) {
            var current;
            var targetType = Object.getType(target);
            var isObject = (targetType === Object) || (targetType === Sys.UI.DomElement);
            var isComponent = Component.isInstanceOfType(target) && !target.get_isUpdating();
            for (var name_3 in properties) {
                var val = properties[name_3];
                var getter = isObject ? null : target["get_" + name_3];
                if (isObject || typeof (getter) !== 'function') {
                    var targetVal = target[name_3];
                    if (!isObject && typeof (targetVal) === 'undefined')
                        throw Error.invalidOperation(String.format(Sys.Res.propertyUndefined, name_3));
                    if (!val || (typeof (val) !== 'object') || (isObject && !targetVal)) {
                        target[name_3] = val;
                    }
                    else {
                        Component._setProperties(targetVal, val);
                    }
                }
                else {
                    var setter = target["set_" + name_3];
                    if (typeof (setter) === 'function') {
                        setter.apply(target, [val]);
                    }
                    else if (val instanceof Array) {
                        current = getter.apply(target);
                        if (!(current instanceof Array)) {
                            throw Error.invalidOperation(String.format(Sys.Res.propertyNotAnArray, name_3));
                        }
                        for (var i = 0, j = current.length, l = val.length; i < l; i++, j++) {
                            current[j] = val[i];
                        }
                    }
                    else if ((typeof (val) === 'object') && (Object.getType(val) === Object)) {
                        current = getter.apply(target);
                        if ((typeof (current) === 'undefined') || (current === null)) {
                            throw Error.invalidOperation(String.format(Sys.Res.propertyNullOrUndefined, name_3));
                        }
                        Component._setProperties(current, val);
                    }
                    else {
                        throw Error.invalidOperation(String.format(Sys.Res.propertyNotWritable, name_3));
                    }
                }
            }
        };
        return Component;
    }());
    Sys.Component = Component;
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var EventArgs = (function () {
        function EventArgs() {
        }
        /**
         * A static object of type EventArgs that is used as a convenient way to specify an empty EventArgs instance.
         */
        EventArgs.Empty = new EventArgs();
        return EventArgs;
    }());
    Sys.EventArgs = EventArgs;
})(Sys || (Sys = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Sys;
(function (Sys) {
    var ApplicationLoadEventArgs = (function (_super) {
        __extends(ApplicationLoadEventArgs, _super);
        function ApplicationLoadEventArgs(components, isPartialLoad) {
            var _this = _super.call(this) || this;
            _this._components = [];
            _this._isPartialLoad = false;
            _this._components = components;
            _this._isPartialLoad = isPartialLoad;
            return _this;
        }
        ApplicationLoadEventArgs.prototype.get_components = function () {
            return this._components;
        };
        ApplicationLoadEventArgs.prototype.get_isPartialLoad = function () {
            return this._isPartialLoad;
        };
        return ApplicationLoadEventArgs;
    }(Sys.EventArgs));
    Sys.ApplicationLoadEventArgs = ApplicationLoadEventArgs;
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Browser;
    (function (Browser) {
        Browser[Browser["InternetExplorer"] = 0] = "InternetExplorer";
        Browser[Browser["FireFox"] = 1] = "FireFox";
        Browser[Browser["Safari"] = 2] = "Safari";
        Browser[Browser["Opera"] = 3] = "Opera";
        // TODO Chrome
    })(Browser = Sys.Browser || (Sys.Browser = {}));
    (function (Browser) {
        Browser.hasDebuggerStatement = false;
        Browser.name = navigator.appName;
        Browser.version = parseFloat(navigator.appVersion);
        Browser.documentMode = 0;
        function _init() {
            if (navigator.userAgent.indexOf(' MSIE ') > -1) {
                Browser.agent = Browser.InternetExplorer;
                var match = navigator.userAgent.match(/MSIE (\d+\.\d+)/);
                if (match !== null) {
                    Browser.version = parseFloat(match[1]);
                    if (Browser.version >= 8) {
                        var documentMode_1 = document["documentMode"];
                        if (documentMode_1 !== undefined && documentMode_1 >= 7) {
                            Browser.documentMode = documentMode_1;
                        }
                    }
                }
                Browser.hasDebuggerStatement = true;
            }
            else if (navigator.userAgent.indexOf(' Firefox/') > -1) {
                Browser.agent = Browser.FireFox;
                var match = navigator.userAgent.match(/ Firefox\/(\d+\.\d+)/);
                if (match !== null) {
                    Browser.version = parseFloat(match[1]);
                    Browser.name = "Firefox";
                }
                Browser.hasDebuggerStatement = true;
            }
            else if (navigator.userAgent.indexOf(' AppleWebKit/') > -1) {
                Browser.agent = Browser.Safari;
                var match = navigator.userAgent.match(/ AppleWebKit\/(\d+(\.\d+)?)/);
                if (match !== null) {
                    Browser.version = parseFloat(match[1]);
                    Browser.name = 'Safari';
                }
            }
            else if (navigator.userAgent.indexOf('Opera/') > -1) {
                Browser.agent = Browser.Opera;
            }
        }
        _init();
    })(Browser = Sys.Browser || (Sys.Browser = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    /**
     * Provides the base class for events that can be canceled.
     */
    var CancelEventArgs = (function () {
        function CancelEventArgs() {
            this._cancel = false;
        }
        /**
         * Gets value that specifies whether the event source should cancel the operation that caused the event.
         */
        CancelEventArgs.prototype.get_cancel = function () {
            return this._cancel;
        };
        /**
         * Sets a value that specifies whether the event source should cancel the operation that caused the event.
         */
        CancelEventArgs.prototype.set_cancel = function (value) {
            this._cancel = value;
        };
        return CancelEventArgs;
    }());
    Sys.CancelEventArgs = CancelEventArgs;
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    /**
     * Represents a culture definition that can be applied to objects that accept a culture-related setting.
     * @see {@link http://msdn.microsoft.com/en-us/library/bb384004(v=vs.100).aspx}
     */
    var CultureInfo = (function () {
        /**
         * Initializes a new instance of the CultureInfo class.
         * @param name
         *      The culture value (locale) that represents a language and region.
         * @param numberFormat
         *      A culture-sensitive numeric formatting string.
         * @param dateTimeFormat
         *      A culture-sensitive date formatting string.
         */
        function CultureInfo(name, numberFormat, dateTimeFormat) {
            this.name = name;
            this.numberFormat = numberFormat;
            this.dateTimeFormat = dateTimeFormat;
        }
        CultureInfo.prototype._getDateTimeFormats = function () {
            if (this._dateTimeFormats === undefined) {
                var dtf = this.dateTimeFormat;
                this._dateTimeFormats = [dtf.MonthDayPattern,
                    dtf.YearMonthPattern,
                    dtf.ShortDatePattern,
                    dtf.ShortTimePattern,
                    dtf.LongDatePattern,
                    dtf.LongTimePattern,
                    dtf.FullDateTimePattern,
                    dtf.RFC1123Pattern,
                    dtf.SortableDateTimePattern,
                    dtf.UniversalSortableDateTimePattern
                ];
            }
            return this._dateTimeFormats;
        };
        CultureInfo.prototype._getIndex = function (value, a1, a2) {
            var upper = this._toUpper(value), i = Array.indexOf(a1, upper);
            if (i === -1) {
                i = Array.indexOf(a2, upper);
            }
            return i;
        };
        CultureInfo.prototype._getMonthIndex = function (value) {
            if (!this._upperMonths) {
                this._upperMonths = this._toUpperArray(this.dateTimeFormat.MonthNames);
                this._upperMonthsGenitive = this._toUpperArray(this.dateTimeFormat.MonthGenitiveNames);
            }
            return this._getIndex(value, this._upperMonths, this._upperMonthsGenitive);
        };
        CultureInfo.prototype._getAbbrMonthIndex = function (value) {
            if (!this._upperAbbrMonths) {
                this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames);
                this._upperAbbrMonthsGenitive = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthGenitiveNames);
            }
            return this._getIndex(value, this._upperAbbrMonths, this._upperAbbrMonthsGenitive);
        };
        CultureInfo.prototype._getDayIndex = function (value) {
            if (!this._upperDays) {
                this._upperDays = this._toUpperArray(this.dateTimeFormat.DayNames);
            }
            return Array.indexOf(this._upperDays, this._toUpper(value));
        };
        CultureInfo.prototype._getAbbrDayIndex = function (value) {
            if (!this._upperAbbrDays) {
                this._upperAbbrDays = this._toUpperArray(this.dateTimeFormat.AbbreviatedDayNames);
            }
            return Array.indexOf(this._upperAbbrDays, this._toUpper(value));
        };
        CultureInfo.prototype._toUpperArray = function (arr) {
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                result.push(this._toUpper(arr[i]));
            }
            return result;
        };
        CultureInfo.prototype._toUpper = function (value) {
            return value.split("\u00A0").join(' ').toUpperCase();
        };
        Object.defineProperty(CultureInfo, "InvariantCulture", {
            /**
             * Gets the globalization values of the invariant culture as sent by the server. This member is static and can be invoked without creating an instance of the class.
             * The InvariantCulture field contains the following fields associated with the invariant (culture-independent) culture: name, dateTimeFormat, and numberFormat.
             * @returns
             *      A CultureInfo object.
             */
            get: function () {
                return CultureInfo._parse({
                    name: "",
                    numberFormat: {
                        CurrencyDecimalDigits: 2,
                        CurrencyDecimalSeparator: ".",
                        IsReadOnly: true,
                        CurrencyGroupSizes: [3],
                        NumberGroupSizes: [3],
                        PercentGroupSizes: [3],
                        CurrencyGroupSeparator: ",",
                        CurrencySymbol: "\u00A4",
                        NaNSymbol: "NaN",
                        CurrencyNegativePattern: 0,
                        NumberNegativePattern: 1,
                        PercentPositivePattern: 0,
                        PercentNegativePattern: 0,
                        NegativeInfinitySymbol: "-Infinity",
                        NegativeSign: "-",
                        NumberDecimalDigits: 2,
                        NumberDecimalSeparator: ".",
                        NumberGroupSeparator: ",",
                        CurrencyPositivePattern: 0,
                        PositiveInfinitySymbol: "Infinity",
                        PositiveSign: "+",
                        PercentDecimalDigits: 2,
                        PercentDecimalSeparator: ".",
                        PercentGroupSeparator: ",",
                        PercentSymbol: "%",
                        PerMilleSymbol: "\u2030",
                        NativeDigits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                        DigitSubstitution: 1
                    },
                    dateTimeFormat: {
                        AMDesignator: "AM",
                        Calendar: {
                            MinSupportedDateTime: "@-62135568000000@",
                            MaxSupportedDateTime: "@253402300799999@",
                            AlgorithmType: 1,
                            CalendarType: 1,
                            Eras: [1],
                            TwoDigitYearMax: 2029,
                            IsReadOnly: true
                        },
                        DateSeparator: "/",
                        FirstDayOfWeek: 0,
                        CalendarWeekRule: 0,
                        FullDateTimePattern: "dddd, dd MMMM yyyy HH:mm:ss",
                        LongDatePattern: "dddd, dd MMMM yyyy",
                        LongTimePattern: "HH:mm:ss",
                        MonthDayPattern: "MMMM dd",
                        PMDesignator: "PM",
                        RFC1123Pattern: "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'",
                        ShortDatePattern: "MM/dd/yyyy",
                        ShortTimePattern: "HH:mm",
                        SortableDateTimePattern: "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss",
                        TimeSeparator: ":",
                        UniversalSortableDateTimePattern: "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'",
                        YearMonthPattern: "yyyy MMMM",
                        AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        ShortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                        DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                        MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                        IsReadOnly: true,
                        NativeCalendarName: "Gregorian Calendar",
                        AbbreviatedMonthGenitiveNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                        MonthGenitiveNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                        eras: [1, "A.D.", null, 0]
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CultureInfo, "CurrentCulture", {
            /**
             * Gets the globalization values of the current culture as sent by the server. This member is static and can be invoked without creating an instance of the class.
             * The CurrentCulture field contains the following fields associated with the current culture: name, dateTimeFormat, and numberFormat.
             * @returns
             *      A CultureInfo object.
             */
            get: function () {
                if (CultureInfo._currentCulture === undefined) {
                    var ci = window["__cultureInfo"];
                    if (ci !== undefined) {
                        CultureInfo._currentCulture = CultureInfo._parse(ci);
                        delete window["__cultureInfo"];
                    }
                    else {
                        CultureInfo._currentCulture = CultureInfo._parse({
                            name: "en-US",
                            numberFormat: {
                                CurrencyDecimalDigits: 2,
                                CurrencyDecimalSeparator: ".",
                                IsReadOnly: false,
                                CurrencyGroupSizes: [3],
                                NumberGroupSizes: [3],
                                PercentGroupSizes: [3],
                                CurrencyGroupSeparator: ",",
                                CurrencySymbol: "$",
                                NaNSymbol: "NaN",
                                CurrencyNegativePattern: 0,
                                NumberNegativePattern: 1,
                                PercentPositivePattern: 0,
                                PercentNegativePattern: 0,
                                NegativeInfinitySymbol: "-Infinity",
                                NegativeSign: "-",
                                NumberDecimalDigits: 2,
                                NumberDecimalSeparator: ".",
                                NumberGroupSeparator: ",",
                                CurrencyPositivePattern: 0,
                                PositiveInfinitySymbol: "Infinity",
                                PositiveSign: "+",
                                PercentDecimalDigits: 2,
                                PercentDecimalSeparator: ".",
                                PercentGroupSeparator: ",",
                                PercentSymbol: "%",
                                PerMilleSymbol: "\u2030",
                                NativeDigits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                                DigitSubstitution: 1
                            },
                            dateTimeFormat: {
                                AMDesignator: "AM",
                                Calendar: {
                                    MinSupportedDateTime: "@-62135568000000@",
                                    MaxSupportedDateTime: "@253402300799999@",
                                    AlgorithmType: 1,
                                    CalendarType: 1,
                                    Eras: [1],
                                    TwoDigitYearMax: 2029,
                                    IsReadOnly: false
                                },
                                DateSeparator: "/",
                                FirstDayOfWeek: 0,
                                CalendarWeekRule: 0,
                                FullDateTimePattern: "dddd, MMMM dd, yyyy h:mm:ss tt",
                                LongDatePattern: "dddd, MMMM dd, yyyy",
                                LongTimePattern: "h:mm:ss tt",
                                MonthDayPattern: "MMMM dd",
                                PMDesignator: "PM",
                                RFC1123Pattern: "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'",
                                ShortDatePattern: "M/d/yyyy",
                                ShortTimePattern: "h:mm tt",
                                SortableDateTimePattern: "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss",
                                TimeSeparator: ":",
                                UniversalSortableDateTimePattern: "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'",
                                YearMonthPattern: "MMMM, yyyy",
                                AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                                ShortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                                DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                                MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                                IsReadOnly: false,
                                NativeCalendarName: "Gregorian Calendar",
                                AbbreviatedMonthGenitiveNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                                MonthGenitiveNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                                eras: [1, "A.D.", null, 0]
                            }
                        });
                    }
                }
                return CultureInfo._currentCulture;
            },
            enumerable: true,
            configurable: true
        });
        CultureInfo._parse = function (value) {
            return new CultureInfo(value.name, value.numberFormat, value.dateTimeFormat);
        };
        return CultureInfo;
    }());
    Sys.CultureInfo = CultureInfo;
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var HistoryEventArgs = (function (_super) {
        __extends(HistoryEventArgs, _super);
        function HistoryEventArgs(state) {
            return _super.call(this) || this;
        }
        HistoryEventArgs.prototype.get_state = function () {
            return this._state;
        };
        return HistoryEventArgs;
    }(Sys.EventArgs));
    Sys.HistoryEventArgs = HistoryEventArgs;
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    /**
     * Provides static, culture-neutral exception messages that are used by the Microsoft Ajax Library framework.
     */
    Sys.Res = {
        'argumentTypeName': 'Value is not the name of an existing type.',
        'cantBeCalledAfterDispose': 'Can\'t be called after dispose.',
        'componentCantSetIdAfterAddedToApp': 'The id property of a component can\'t be set after it\'s been added to the Appli' +
            'cation object.',
        'behaviorDuplicateName': 'A behavior with name \'{0}\' already exists or it is the name of an existing pro' +
            'perty on the target element.',
        'notATypeName': 'Value is not a valid type name.',
        'elementNotFound': 'An element with id \'{0}\' could not be found.',
        'stateMustBeStringDictionary': 'The state object can only have null and string fields.',
        'boolTrueOrFalse': 'Value must be \'true\' or \'false\'.',
        'scriptLoadFailedNoHead': 'ScriptLoader requires pages to contain a <head> element.',
        'stringFormatInvalid': 'The format string is invalid.',
        'referenceNotFound': 'Component \'{0}\' was not found.',
        'enumReservedName': '\'{0}\' is a reserved name that can\'t be used as an enum value name.',
        'circularParentChain': 'The chain of control parents can\'t have circular references.',
        'namespaceContainsNonObject': 'Object {0} already exists and is not an object.',
        'undefinedEvent': '\'{0}\' is not an event.',
        'propertyUndefined': '\'{0}\' is not a property or an existing field.',
        'observableConflict': 'Object already contains a member with the name \'{0}\'.',
        'historyCannotEnableHistory': 'Cannot set enableHistory after initialization.',
        'eventHandlerInvalid': 'Handler was not added through the Sys.UI.DomEvent.addHandler method.',
        'scriptLoadFailedDebug': 'The script \'{0}\' failed to load. Check for:\r\n Inaccessible path.\r\n Script ' +
            'errors. (IE) Enable \'Display a notification about every script error\' under ad' +
            'vanced settings.',
        'propertyNotWritable': '\'{0}\' is not a writable property.',
        'enumInvalidValueName': '\'{0}\' is not a valid name for an enum value.',
        'controlAlreadyDefined': 'A control is already associated with the element.',
        'addHandlerCantBeUsedForError': 'Can\'t add a handler for the error event using this method. Please set the windo' +
            'w.onerror property instead.',
        'cantAddNonFunctionhandler': 'Can\'t add a handler that is not a function.',
        'invalidNameSpace': 'Value is not a valid namespace identifier.',
        'notAnInterface': 'Value is not a valid interface.',
        'eventHandlerNotFunction': 'Handler must be a function.',
        'propertyNotAnArray': '\'{0}\' is not an Array property.',
        'namespaceContainsClass': 'Object {0} already exists as a class, enum, or interface.',
        'typeRegisteredTwice': 'Type {0} has already been registered. The type may be defined multiple times or ' +
            'the script file that defines it may have already been loaded. A possible cause i' +
            's a change of settings during a partial update.',
        'cantSetNameAfterInit': 'The name property can\'t be set on this object after initialization.',
        'historyMissingFrame': 'For the history feature to work in IE, the page must have an iFrame element with' +
            ' id \'__historyFrame\' pointed to a page that gets its title from the \'title\' ' +
            'query string parameter and calls Sys.Application._onIFrameLoad() on the parent w' +
            'indow. This can be done by setting EnableHistory to true on ScriptManager.',
        'appDuplicateComponent': 'Two components with the same id \'{0}\' can\'t be added to the application.',
        'historyCannotAddHistoryPointWithHistoryDisabled': 'A history point can only be added if enableHistory is set to true.',
        'baseNotAClass': 'Value is not a class.',
        'expectedElementOrId': 'Value must be a DOM element or DOM element Id.',
        'methodNotFound': 'No method found with name \'{0}\'.',
        'arrayParseBadFormat': 'Value must be a valid string representation for an array. It must start with a ' +
            '\'[\' and end with a \']\'.',
        'stateFieldNameInvalid': 'State field names must not contain any \'=\' characters.',
        'cantSetId': 'The id property can\'t be set on this object.',
        'stringFormatBraceMismatch': 'The format string contains an unmatched opening or closing brace.',
        'enumValueNotInteger': 'An enumeration definition can only contain integer values.',
        'propertyNullOrUndefined': 'Cannot set the properties of \'{0}\' because it returned a null value.',
        'argumentDomNode': 'Value must be a DOM element or a text node.',
        'componentCantSetIdTwice': 'The id property of a component can\'t be set more than once.',
        'createComponentOnDom': 'Value must be null for Components that are not Controls or Behaviors.',
        'createNotComponent': '{0} does not derive from Sys.Component.',
        'createNoDom': 'Value must not be null for Controls and Behaviors.',
        'cantAddWithoutId': 'Can\'t add a component that doesn\'t have an id.',
        'urlTooLong': 'The history state must be small enough to not make the url larger than {0} chara' +
            'cters.',
        'notObservable': 'Instances of type \'{0}\' cannot be observed.',
        'badTypeName': 'Value is not the name of the type being registered or the name is a reserved wor' +
            'd.',
        'argumentInteger': 'Value must be an integer.',
        'invokeCalledTwice': 'Cannot call invoke more than once.',
        'webServiceFailed': 'The server method \'{0}\' failed with the following error: {1}',
        'argumentType': 'Object cannot be converted to the required type.',
        'argumentNull': 'Value cannot be null.',
        'scriptAlreadyLoaded': 'The script \'{0}\' has been referenced multiple times. If referencing Microsoft ' +
            'AJAX scripts explicitly, set the MicrosoftAjaxMode property of the ScriptManager' +
            ' to Explicit.',
        'scriptDependencyNotFound': 'The script \'{0}\' failed to load because it is dependent on script \'{1}\'.',
        'formatBadFormatSpecifier': 'Format specifier was invalid.',
        'requiredScriptReferenceNotIncluded': '\'{0}\' requires that you have included a script reference to \'{1}\'.',
        'webServiceFailedNoMsg': 'The server method \'{0}\' failed.',
        'argumentDomElement': 'Value must be a DOM element.',
        'invalidExecutorType': 'Could not create a valid Sys.Net.WebRequestExecutor from: {0}.',
        'cannotCallBeforeResponse': 'Cannot call {0} when responseAvailable is false.',
        'actualValue': 'Actual value was {0}.',
        'enumInvalidValue': '\'{0}\' is not a valid value for enum {1}.',
        'scriptLoadFailed': 'The script \'{0}\' could not be loaded.',
        'parameterCount': 'Parameter count mismatch.',
        'cannotDeserializeEmptyString': 'Cannot deserialize empty string.',
        'formatInvalidString': 'Input string was not in a correct format.',
        'invalidTimeout': 'Value must be greater than or equal to zero.',
        'cannotAbortBeforeStart': 'Cannot abort when executor has not started.',
        'argument': 'Value does not fall within the expected range.',
        'cannotDeserializeInvalidJson': 'Cannot deserialize. The data does not correspond to valid JSON.',
        'invalidHttpVerb': 'httpVerb cannot be set to an empty or null string.',
        'nullWebRequest': 'Cannot call executeRequest with a null webRequest.',
        'cannotSerializeNonFiniteNumbers': 'Cannot serialize non finite numbers.',
        'argumentUndefined': 'Value cannot be undefined.',
        'webServiceInvalidReturnType': 'The server method \'{0}\' returned an invalid type. Expected type: {1}',
        'servicePathNotSet': 'The path to the web service has not been set.',
        'argumentTypeWithTypes': 'Object of type \'{0}\' cannot be converted to type \'{1}\'.',
        'cannotCallOnceStarted': 'Cannot call {0} once started.',
        'badBaseUrl1': 'Base URL does not contain ://.',
        'badBaseUrl2': 'Base URL does not contain another /.',
        'badBaseUrl3': 'Cannot find last / in base URL.',
        'setExecutorAfterActive': 'Cannot set executor after it has become active.',
        'paramName': 'Parameter name: {0}',
        'nullReferenceInPath': 'Null reference while evaluating data path: \'{0}\'.',
        'cannotCallOutsideHandler': 'Cannot call {0} outside of a completed event handler.',
        'cannotSerializeObjectWithCycle': 'Cannot serialize object with cyclic reference within child properties.',
        'format': 'One of the identified items was in an invalid format.',
        'assertFailedCaller': 'Assertion Failed: {0}\r\nat {1}',
        'argumentOutOfRange': 'Specified argument was out of the range of valid values.',
        'webServiceTimedOut': 'The server method \'{0}\' timed out.',
        'notImplemented': 'The method or operation is not implemented.',
        'assertFailed': 'Assertion Failed: {0}',
        'invalidOperation': 'Operation is not valid due to the current state of the object.',
        'breakIntoDebugger': '{0}\r\n\r\nBreak into debugger?'
    };
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var StringBuilder = (function () {
        /**
         * Creates a new instance of StringBuilder and optionally accepts initial text to concatenate.
         * @param initialText
         *      (Optional) The string that is used to initialize the value of the instance.
         *      If the value is null, the new StringBuilder instance will contain an empty string ("").
         */
        function StringBuilder(initialText) {
            this._parts =
                (initialText !== undefined && initialText !== null && initialText !== "") ?
                    [initialText.toString()] :
                    [];
            this._value = {};
            this._len = 0;
        }
        /**
         * Appends a copy of a specified string to the end of the {@link Sys.StringBuilder} instance.
         * @param text
         *      The string to append to the end of the StringBuilder instance.
         */
        StringBuilder.prototype.append = function (text) {
            this._parts[this._parts.length] = text;
        };
        /**
         * Appends a string with a line terminator to the end of the {@link Sys.StringBuilder} instance.
         * @param text
         *      (Optional) The string to append with a line terminator to the end of the StringBuilder instance.
         */
        StringBuilder.prototype.appendLine = function (text) {
            this._parts[this._parts.length] = (text === undefined || text === null || text === "") ?
                "\r\n" :
                text + "\r\n";
        };
        /**
         * Clears the contents of the Sys.StringBuilder instance.
         */
        StringBuilder.prototype.clear = function () {
            this._parts = [];
            this._value = {};
            this._len = 0;
        };
        /**
         * Determines whether the {@link Sys.StringBuilder} object has content.
         * @returns
         *      true if the StringBuilder instance contains no elements; otherwise, false.
         */
        StringBuilder.prototype.isEmpty = function () {
            if (this._parts.length === 0)
                return true;
            return this.toString() === "";
        };
        /**
         * Creates a string from the contents of a {@link Sys.StringBuilder} instance, and optionally inserts a delimiter between each element of the created string.
         * @param separator
         *      (Optional) A string to append between each element of the string that is returned.
         * @returns
         *      A string representation of the StringBuilder instance. If separator is specified, the delimiter string is inserted between each element of the returned string.
         */
        StringBuilder.prototype.toString = function (separator) {
            separator = separator || "";
            var parts = this._parts;
            if (this._len !== parts.length) {
                this._value = {};
                this._len = parts.length;
            }
            var val = this._value;
            if (val[separator] === undefined) {
                if (separator !== '') {
                    for (var i = 0; i < parts.length;) {
                        if ((parts[i] === undefined) || (parts[i] === '') || (parts[i] === null)) {
                            parts.splice(i, 1);
                        }
                        else {
                            i++;
                        }
                    }
                }
                val[separator] = this._parts.join(separator);
            }
            return val[separator];
        };
        return StringBuilder;
    }());
    Sys.StringBuilder = StringBuilder;
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Serialization;
    (function (Serialization) {
        var JavaScriptSerializer;
        (function (JavaScriptSerializer) {
            var _charsToEscapeRegExs = [];
            var _charsToEscape = [];
            var _dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', 'g');
            var _escapeChars = {};
            var _escapeRegEx = new RegExp('["\\\\\\x00-\\x1F]', 'i');
            var _escapeRegExGlobal = new RegExp('["\\\\\\x00-\\x1F]', 'g');
            var _jsonRegEx = new RegExp('[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]', 'g');
            var _jsonStringRegEx = new RegExp('"(\\\\.|[^"\\\\])*"', 'g');
            var _serverTypeFieldName = "__type";
            function _init() {
                var replaceChars = [
                    '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007',
                    '\\b', '\\t', '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011',
                    '\\u0012', '\\u0013', '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019',
                    '\\u001a', '\\u001b', '\\u001c', '\\u001d', '\\u001e', '\\u001f'
                ];
                _charsToEscape[0] = '\\';
                _charsToEscapeRegExs['\\'] = new RegExp('\\\\', 'g');
                _escapeChars['\\'] = '\\\\';
                _charsToEscape[1] = '"';
                _charsToEscapeRegExs['"'] = new RegExp('"', 'g');
                _escapeChars['"'] = '\\"';
                for (var i = 0; i < 32; i++) {
                    var c = String.fromCharCode(i);
                    _charsToEscape[i + 2] = c;
                    _charsToEscapeRegExs[c] = new RegExp(c, 'g');
                    _escapeChars[c] = replaceChars[i];
                }
            }
            _init();
            /**
             * Converts an ECMAScript (JavaScript) object graph into a JSON string. This member is static and can be invoked without creating an instance of the class.
             * @param object
             *      The JavaScript object graph to serialize.
             */
            function serialize(object) {
                var stringBuilder = new Sys.StringBuilder();
                _serializeWithBuilder(object, stringBuilder, false);
                return stringBuilder.toString();
            }
            JavaScriptSerializer.serialize = serialize;
            /**
             * Converts a JSON string into an ECMAScript (JavaScript) object graph. This member is static and can be invoked without creating an instance of the class.
             * @param value
             *      The JSON string to deserialize.
             */
            function deserialize(data, secure) {
                if (data.length === 0)
                    throw Error.argument('data', Sys.Res.cannotDeserializeEmptyString);
                try {
                    var exp = data.replace(_dateRegEx, "$1new Date($2)");
                    if (secure && _jsonRegEx.test(exp.replace(_jsonStringRegEx, '')))
                        throw null;
                    return eval('(' + exp + ')');
                }
                catch (e) {
                    throw Error.argument('data', Sys.Res.cannotDeserializeInvalidJson);
                }
            }
            JavaScriptSerializer.deserialize = deserialize;
            function _serializeBooleanWithBuilder(object, stringBuilder) {
                stringBuilder.append(object.toString());
            }
            function _serializeNumberWithBuilder(object, stringBuilder) {
                if (isFinite(object)) {
                    stringBuilder.append(String(object));
                }
                else {
                    throw Error.invalidOperation(Sys.Res.cannotSerializeNonFiniteNumbers);
                }
            }
            function _serializeStringWithBuilder(string, stringBuilder) {
                stringBuilder.append('"');
                if (_escapeRegEx.test(string)) {
                    if (_charsToEscape.length === 0) {
                        _init();
                    }
                    if (string.length < 128) {
                        string = string.replace(_escapeRegExGlobal, function (x) {
                            return _escapeChars[x];
                        });
                    }
                    else {
                        for (var i = 0; i < 34; i++) {
                            var c = _charsToEscape[i];
                            if (string.indexOf(c) !== -1) {
                                if (Sys.Browser.agent === Sys.Browser.Opera || Sys.Browser.agent === Sys.Browser.FireFox) {
                                    string = string.split(c).join(_escapeChars[c]);
                                }
                                else {
                                    string = string.replace(_charsToEscapeRegExs[c], _escapeChars[c]);
                                }
                            }
                        }
                    }
                }
                stringBuilder.append(string);
                stringBuilder.append('"');
            }
            function _serializeWithBuilder(object, stringBuilder, sort, prevObjects) {
                var i;
                switch (typeof object) {
                    case 'object':
                        if (object) {
                            if (prevObjects) {
                                for (var j = 0; j < prevObjects.length; j++) {
                                    if (prevObjects[j] === object) {
                                        throw Error.invalidOperation(Sys.Res.cannotSerializeObjectWithCycle);
                                    }
                                }
                            }
                            else {
                                prevObjects = [];
                            }
                            try {
                                Array.add(prevObjects, object);
                                if (Number.isInstanceOfType(object)) {
                                    _serializeNumberWithBuilder(object, stringBuilder);
                                }
                                else if (Boolean.isInstanceOfType(object)) {
                                    _serializeBooleanWithBuilder(object, stringBuilder);
                                }
                                else if (String.isInstanceOfType(object)) {
                                    _serializeStringWithBuilder(object, stringBuilder);
                                }
                                else if (Array.isInstanceOfType(object)) {
                                    stringBuilder.append('[');
                                    for (i = 0; i < object.length; ++i) {
                                        if (i > 0) {
                                            stringBuilder.append(',');
                                        }
                                        _serializeWithBuilder(object[i], stringBuilder, false, prevObjects);
                                    }
                                    stringBuilder.append(']');
                                }
                                else {
                                    if (Date.isInstanceOfType(object)) {
                                        stringBuilder.append('"\\/Date(');
                                        stringBuilder.append(object.getTime());
                                        stringBuilder.append(')\\/"');
                                        break;
                                    }
                                    var properties = [];
                                    var propertyCount = 0;
                                    for (var name in object) {
                                        if (name.startsWith('$')) {
                                            continue;
                                        }
                                        if (name === _serverTypeFieldName && propertyCount !== 0) {
                                            properties[propertyCount++] = properties[0];
                                            properties[0] = name;
                                        }
                                        else {
                                            properties[propertyCount++] = name;
                                        }
                                    }
                                    if (sort)
                                        properties.sort();
                                    stringBuilder.append('{');
                                    var needComma = false;
                                    for (i = 0; i < propertyCount; i++) {
                                        var value = object[properties[i]];
                                        if (typeof value !== 'undefined' && typeof value !== 'function') {
                                            if (needComma) {
                                                stringBuilder.append(',');
                                            }
                                            else {
                                                needComma = true;
                                            }
                                            _serializeWithBuilder(properties[i], stringBuilder, sort, prevObjects);
                                            stringBuilder.append(':');
                                            _serializeWithBuilder(value, stringBuilder, sort, prevObjects);
                                        }
                                    }
                                    stringBuilder.append('}');
                                }
                            }
                            finally {
                                Array.removeAt(prevObjects, prevObjects.length - 1);
                            }
                        }
                        else {
                            stringBuilder.append('null');
                        }
                        break;
                    case 'number':
                        _serializeNumberWithBuilder(object, stringBuilder);
                        break;
                    case 'string':
                        _serializeStringWithBuilder(object, stringBuilder);
                        break;
                    case 'boolean':
                        _serializeBooleanWithBuilder(object, stringBuilder);
                        break;
                    default:
                        stringBuilder.append('null');
                        break;
                }
            }
        })(JavaScriptSerializer = Serialization.JavaScriptSerializer || (Serialization.JavaScriptSerializer = {}));
    })(Serialization = Sys.Serialization || (Sys.Serialization = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        var Behavior = (function (_super) {
            __extends(Behavior, _super);
            function Behavior(element) {
                var _this = _super.call(this) || this;
                _this._element = element;
                return _this;
            }
            Behavior.prototype.get_element = function () {
                return this._element;
            };
            return Behavior;
        }(Sys.Component));
        UI.Behavior = Behavior;
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        var Bounds = (function () {
            /**
             * Initializes a new instance of the Sys.UI.Bounds class.
             * @param x
             *      The number of pixels between the location and the left edge of the parent frame.
             * @param y
             *    The number of pixels between the location and the top edge of the parent frame.
             * @param width
             *    The width in pixels.
             * @param height
             *    The height in pixels.
             */
            function Bounds(x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            return Bounds;
        }());
        UI.Bounds = Bounds;
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        var Control = (function (_super) {
            __extends(Control, _super);
            function Control(element) {
                var _this = _super.call(this) || this;
                _this._element = element;
                return _this;
            }
            Control.prototype.get_element = function () {
                return this._element;
            };
            return Control;
        }(Sys.Component));
        UI.Control = Control;
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        var DomElement = (function () {
            function DomElement() {
            }
            /**
             * Adds a CSS class to a DOM element if the class is not already part of the DOM element.
             * This member is static and can be invoked without creating an instance of the class.
             * @param element
             *      The {HTMLElement} object to add the CSS class to.
             * @param className
             *      The name of the CSS class to add.
             */
            DomElement.addCssClass = function (element, className) {
                if (!DomElement.containsCssClass(element, className)) {
                    if (element.className === "") {
                        element.className = className;
                    }
                    else {
                        element.className += ' ' + className;
                    }
                }
            };
            /**
             * Gets a value that indicates whether the DOM element contains the specified CSS class.
             * This member is static and can be invoked without creating an instance of the class.
             * @param element
             *      The {@link HTMLElement} object to test for the CSS class.
             * @param className
             *      The name of the CSS class to test for.
             * @returns
             *      true if the element contains the specified CSS class; otherwise, false.
             */
            DomElement.containsCssClass = function (element, className) {
                return Array.contains(element.className.split(" "), className);
            };
            /**
             * Gets a set of integer coordinates that represent the position, width, and height of a DOM element.
             * This member is static and can be invoked without creating an instance of the class.
             * @param element
             *      The Sys.UI.DomElement instance to get the coordinates of.
             * @returns
             *      An object of the JavaScript type Object that contains the x-coordinate and y-coordinate of the upper-left corner, the width, and the height of the element in pixels.
             */
            DomElement.getBounds = function (element) {
                var rect = element.getBoundingClientRect();
                return new Sys.UI.Bounds(rect.left, rect.top, rect.width, rect.height);
            };
            /**
             * Gets a DOM element that has the specified id attribute.
             * This member is static and can be invoked without creating an instance of the class.
             * @param id
             *      The ID of the element to find.
             * @param element
             *      The parent element to search in. The default is the document element.
             * @returns
             *      The {@link HTMLElement} object with the specified ID.
             */
            DomElement.getElementById = function (id, element) {
                return (element || document).querySelector("#" + id);
            };
            /**
             * Gets the absolute position of a DOM element relative to the upper-left corner of the owner frame or window.
             * This member is static and can be invoked without creating an instance of the class.
             * @param element
             *      The target element.
             * @returns
             *      An object of the JavaScript type Object that contains the x-coordinate and y-coordinate of the element in pixels.
             */
            DomElement.getLocation = function (element) {
                var rect = element.getBoundingClientRect();
                return new Sys.UI.Point(rect.left, rect.top);
            };
            /**
             * Returns a value that represents the layout characteristics of a DOM element when it is hidden by invoking the {@link Sys.UI.DomElement.setVisible} method.
             * This member is static and can be invoked without creating an instance of the class.
             * @param element
             *      The target DOM element.
             * @returns
             *      A {@link Sys.UI.VisibilityMode} enumeration value that indicates the layout characteristics of element when it is hidden by invoking the setVisible method.
             */
            DomElement.getVisibilityMode = function (element) {
                return (true) ?
                    Sys.UI.VisibilityMode.hide :
                    Sys.UI.VisibilityMode.collapse;
            };
            return DomElement;
        }());
        UI.DomElement = DomElement;
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        var DomEvent = (function () {
            /**
             * Initializes a new instance of the Sys.UI.DomEvent class and associates it with the specified HTMLElement object.
             * @param domElement
             *           The HTMLElement object to associate with the event.
             */
            function DomEvent(domElement) {
            }
            /**
             * Provides a method to add a DOM event handler to the DOM element that exposes the event. This member is static and can be invoked without creating an instance of the class.
             * Use the addHandler method to add a DOM event handler to the element that exposes the event. The eventName parameter should not include the "on" prefix. For example, specify "click" instead of "onclick".
             * This method can be accessed through the $addHandler shortcut method.
             *
             * @param element
             *          The element that exposes the event.
             * @param eventName
             *          The name of the event.
             * @param handler
             *          The client function that is called when the event occurs.
             * @param autoRemove
             *          (Optional) A boolean value that determines whether the handler should be removed automatically when the element is disposed.
             */
            DomEvent.addHandler = function (element, eventName, handler, autoRemove) {
                var wrapper = function (ev) {
                    handler(new DomEvent(element));
                };
                element.addEventListener(eventName, wrapper);
            };
            /**
             * Adds a list of DOM event handlers to the DOM element that exposes the events. This member is static and can be invoked without creating an instance of the class.
             * Use the addHandlers method to add a list of DOM event handlers to the element that exposes the event.
             * The events parameter takes a comma-separated list of name/value pairs in the format name:value, where name is the name of the DOM event and value is the name of the handler function.
             * If there is more than one name/value pair, the list must be enclosed in braces ({}) to identify it as a single parameter. Multiple name/value pairs are separated with commas.
             * Event names should not include the "on" prefix. For example, specify "click" instead of "onclick".
             * If handlerOwner is specified, delegates are created for each handler. These delegates are attached to the specified object instance, and the this pointer from the delegate handler will refer to the handlerOwner object.
             * This method can be accessed through the $addHandlers shortcut method.
             *
             * @param element
             *          The DOM element that exposes the events.
             * @param events
             *          A dictionary of event handlers.
             * @param handlerOwner
             *          (Optional) The object instance that is the context for the delegates that should be created from the handlers.
             * @param autoRemove
             *          (Optional) A boolean value that determines whether the handler should be removed automatically when the element is disposed.
             *
             * @throws Error.invalidOperation - (Debug) One of the handlers specified in events is not a function.
             *
             */
            DomEvent.addHandlers = function (element, events, handlerOwner, autoRemove) { };
            /**
             * Removes all DOM event handlers from a DOM element that were added through the Sys.UI.DomEvent addHandler or the Sys.UI.DomEvent addHandlers methods.
             * This member is static and can be invoked without creating an instance of the class.
             * This method can be accessed through the $clearHandlers shortcut method.
             *
             * @param element
             *          The element that exposes the events.
             */
            DomEvent.clearHandlers = function (element) { };
            /**
             * Removes a DOM event handler from the DOM element that exposes the event. This member is static and can be invoked without creating an instance of the class.
             *
             * @param element
             *          The element that exposes the event.
             * @param eventName
             *          The name of the event.
             * @param handler
             *          The event handler to remove.
             */
            DomEvent.removeHandler = function (element, eventName, handler) { };
            /**
             * Prevents the default DOM event action from happening.
             * Use the preventDefault method to prevent the default event action for the browser from occurring.
             * For example, if you prevent the keydown event of an input element from occurring, the character typed by the user is not automatically appended to the input element's value.
             */
            DomEvent.prototype.preventDefault = function () { };
            /**
             * Prevents an event from being propagated (bubbled) to parent elements.
             * By default, event notification is bubbled from a child object to parent objects until it reaches the document object.
             * The event notification stops if the event is handled during the propagation process.
             * Use the stopPropagation method to prevent an event from being propagated to parent elements.
             */
            DomEvent.prototype.stopPropagation = function () { };
            return DomEvent;
        }());
        UI.DomEvent = DomEvent;
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        /**
         * Describes key codes.
         * The values correspond to values in the Document Object Model (DOM).
         */
        var Key;
        (function (Key) {
            /**
             * Represents the BACKSPACE key.
             */
            Key[Key["backspace"] = 0] = "backspace";
            /*
                * Represents the TAB key.
                */
            Key[Key["tab"] = 1] = "tab";
            /**
             * Represents the ENTER key.
             */
            Key[Key["enter"] = 2] = "enter";
            /**
             * Represents the ESC key.
             */
            Key[Key["esc"] = 3] = "esc";
            /*
                * Represents the SPACEBAR key.
                */
            Key[Key["space"] = 4] = "space";
            /**
             * Represents the PAGE UP key.
             */
            Key[Key["pageUp"] = 5] = "pageUp";
            /**
             * Represents the PAGE DOWN key.
             */
            Key[Key["pageDown"] = 6] = "pageDown";
            /**
             * Represents the END key.
             */
            Key[Key["end"] = 7] = "end";
            /**
             * Represents the HOME key.
             */
            Key[Key["home"] = 8] = "home";
            /**
             * Represents the LEFT ARROW key.
             */
            Key[Key["left"] = 9] = "left";
            /**
             * Represents the UP ARROW key.
             */
            Key[Key["up"] = 10] = "up";
            /**
             * Represents the RIGHT ARROW key.
             */
            Key[Key["right"] = 11] = "right";
            /**
             * Represents the DOWN ARROW key.
             */
            Key[Key["down"] = 12] = "down";
            /**
             * Represents DELETE key.
             */
            Key[Key["del"] = 13] = "del";
        })(Key = UI.Key || (UI.Key = {}));
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        /**
         * Describes mouse button locations.
         */
        var MouseButton;
        (function (MouseButton) {
            /**
             * Represents the left mouse button.
             */
            MouseButton[MouseButton["leftButton"] = 0] = "leftButton";
            /**
             * Represents the middle mouse button.
             */
            MouseButton[MouseButton["middleButton"] = 1] = "middleButton";
            /**
             * Represents the right mouse button.
             */
            MouseButton[MouseButton["rightButton"] = 2] = "rightButton";
        })(MouseButton = UI.MouseButton || (UI.MouseButton = {}));
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        var Point = (function () {
            /**
             * Creates an object that contains a set of integer coordinates that represent a position.
             * @param x
             *      Gets the x-coordinate of the Point object in pixels. This property is read-only.
             * @param y
             *      Gets the y-coordinate of the Point object in pixels. This property is read-only.
             */
            function Point(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            }
            return Point;
        }());
        UI.Point = Point;
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var UI;
    (function (UI) {
        /**
         * Describes the layout of a DOM element in the page when the element's visible property is set to false.
         */
        var VisibilityMode;
        (function (VisibilityMode) {
            /**
             * The element is not visible, but it occupies space on the page.
             */
            VisibilityMode[VisibilityMode["hide"] = 0] = "hide";
            /**
             * The element is not visible, and the space it occupies is collapsed.
             */
            VisibilityMode[VisibilityMode["collapse"] = 1] = "collapse";
        })(VisibilityMode = UI.VisibilityMode || (UI.VisibilityMode = {}));
    })(UI = Sys.UI || (Sys.UI = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        /**
         * Contains information about a Web request that is ready to be sent to the current Sys.Net.WebRequestExecutor instance.
         */
        var NetworkRequestEventArgs = (function (_super) {
            __extends(NetworkRequestEventArgs, _super);
            /**
             * Initializes a new instance of the {@link Sys.Net.NetworkRequestEventArgs} class.
             */
            function NetworkRequestEventArgs(webRequest) {
                var _this = _super.call(this) || this;
                _this._webRequest = webRequest;
                return _this;
            }
            /**
             * Gets the Web request to be routed to the current Sys.Net.WebRequestExecutor instance.
             */
            NetworkRequestEventArgs.prototype.get_webRequest = function () {
                return this._webRequest;
            };
            return NetworkRequestEventArgs;
        }(Sys.CancelEventArgs));
        Net.NetworkRequestEventArgs = NetworkRequestEventArgs;
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        var WebRequest = (function () {
            function WebRequest() {
                this._url = "";
                this._headers = {};
                this._invokeCalled = false;
                this._timeout = 0;
                this._events = new Sys.EventHandlerList();
            }
            /**
             * Registers a handler for the completed request event of the Web request.
             * @param handler
             * 		The function registered to handle the completed request event.
             */
            WebRequest.prototype.add_completed = function (handler) {
                this._get_eventHandlerList().addHandler("completed", handler);
            };
            /**
             * Removes the event handler associated with the Web request instance.
             * @param handler
             * 		The function registered to handle the completed request event.
             */
            WebRequest.prototype.remove_completed = function (handler) {
                this._get_eventHandlerList().removeHandler("completed", handler);
            };
            /**
             * Raises the completed event for the associated WebRequest instance.
             * @param eventArgs
             * 		The value to pass to the Web request completed event handler.
             */
            WebRequest.prototype.completed = function (eventArgs) {
                var handler = Sys.Net.WebRequestManager._get_eventHandlerList().getHandler("completedRequest");
                if (handler) {
                    handler(this._executor, eventArgs);
                }
                handler = this._get_eventHandlerList().getHandler("completed");
                if (handler) {
                    handler(this._executor, eventArgs);
                }
            };
            WebRequest.prototype._get_eventHandlerList = function () {
                if (!this._events) {
                    this._events = new Sys.EventHandlerList();
                }
                return this._events;
            };
            /**
             * Gets the URL of the {@link WebRequest} instance.
             * @returns
             * 		A string that represents the URL that the Web request is directed to.
             */
            WebRequest.prototype.get_url = function () {
                return this._url;
            };
            /**
             * Sets the URL of the {@link WebRequest} instance.
             * @param value
             * 		A string that represents the URL that the Web request is directed to.
             */
            WebRequest.prototype.set_url = function (value) {
                this._url = value;
            };
            /**
             * Gets the HTTP headers for the WebRequest instance.
             * @returns
             * 		A dictionary of name/value pairs that contains the HTTP headers that are sent with the Web request.
             */
            WebRequest.prototype.get_headers = function () {
                return this._headers;
            };
            /**
             * Gets or sets the HTTP verb that was used by the {@link WebRequest} class to issue the Web request.
             * @returns
             * 		A string that contains the HTTP verb for the Web request. value must be an HTTP verb that is recognized by the Web server, such as "GET" or "POST".
             */
            WebRequest.prototype.get_httpVerb = function () {
                if (this._httpVerb === undefined) {
                    if (this._body === undefined) {
                        return "GET";
                    }
                    return "POST";
                }
                return this._httpVerb;
            };
            /**
             * Sets the HTTP verb that was used by the {@link WebRequest} class to issue the Web request.
             * @param value
             * 		A string that contains the HTTP verb for the Web request. value must be an HTTP verb that is recognized by the Web server, such as "GET" or "POST".
             */
            WebRequest.prototype.set_httpVerb = function (value) {
                this._httpVerb = value;
            };
            /**
             * Gets the HTTP body of the WebRequest instance.
             * @returns
             * 		The HTTP body to assign to the Web request.
             */
            WebRequest.prototype.get_body = function () {
                return this._body;
            };
            /**
             * Sets the HTTP body of the WebRequest instance.
             * @param value
             * 		The HTTP body to assign to the Web request.
             */
            WebRequest.prototype.set_body = function (value) {
                this._body = value;
            };
            /**
             * Gets the user context associated with the WebRequest instance.
             * @returns
             * 		The user context information that is associated with the request. value can be null or any primitive type or JavaScript object.
             */
            WebRequest.prototype.get_userContext = function () {
                return this._userContext;
            };
            /**
             * Sets the user context associated with the WebRequest instance.
             * @param value
             * 		The user context information that is associated with the request. value can be null or any primitive type or JavaScript object.
             */
            WebRequest.prototype.set_userContext = function (value) {
                this._userContext = value;
            };
            /**
             * Gets the executor of the associated WebRequest instance.
             * @returns
             * 		An instance of a class that is derived from {@link WebRequestExecutor}.
             */
            WebRequest.prototype.get_executor = function () {
                return this._executor;
            };
            /**
             * Sets the executor of the associated WebRequest instance.
             * @param value
             * 		An instance of a class that is derived from {@link WebRequestExecutor}.
             */
            WebRequest.prototype.set_executor = function (value) {
                if (this._executor !== undefined && this._executor.get_started()) {
                    throw Error.invalidOperation(Sys.Res.setExecutorAfterActive);
                }
                this._executor = value;
                this._executor._set_webRequest(this);
            };
            /**
             * Gets or sets the time-out value for the WebRequest instance.
             * @returns
             * 		The time interval in milliseconds.
             */
            WebRequest.prototype.get_timeout = function () {
                if (this._timeout === 0) {
                    return Sys.Net.WebRequestManager.get_defaultTimeout();
                }
                return this._timeout;
            };
            /**
             * Sets the time-out value for the WebRequest instance.
             * @param value
             * 		The time interval in milliseconds.
             */
            WebRequest.prototype.set_timeout = function (value) {
                if (value < 0) {
                    throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
                }
                this._timeout = value;
            };
            /**
             * Gets the resolved URL of the {@link WebRequest} instance.
             * @returns
             * 		A string that represents the URL that the Web request is directed to.
             */
            WebRequest.prototype.getResolvedUrl = function () {
                return this._resolveUrl(this._url);
            };
            /**
             * Executes a Web request.
             */
            WebRequest.prototype.invoke = function () {
                if (this._invokeCalled) {
                    throw Error.invalidOperation(Sys.Res.invokeCalledTwice);
                }
                Sys.Net.WebRequestManager.executeRequest(this);
                this._invokeCalled = true;
            };
            WebRequest.prototype._resolveUrl = function (url, baseUrl) {
                if (url && url.indexOf('://') !== -1) {
                    return url;
                }
                if (!baseUrl || baseUrl.length === 0) {
                    var baseElement = document.getElementsByTagName('base')[0];
                    if (baseElement && baseElement.href && baseElement.href.length > 0) {
                        baseUrl = baseElement.href;
                    }
                    else {
                        baseUrl = document.URL;
                    }
                }
                var qsStart = baseUrl.indexOf('?');
                if (qsStart !== -1) {
                    baseUrl = baseUrl.substr(0, qsStart);
                }
                qsStart = baseUrl.indexOf('#');
                if (qsStart !== -1) {
                    baseUrl = baseUrl.substr(0, qsStart);
                }
                baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1);
                if (!url || url.length === 0) {
                    return baseUrl;
                }
                if (url.charAt(0) === '/') {
                    var slashslash = baseUrl.indexOf('://');
                    if (slashslash === -1) {
                        throw Error.argument("baseUrl", Sys.Res.badBaseUrl1);
                    }
                    var nextSlash = baseUrl.indexOf('/', slashslash + 3);
                    if (nextSlash === -1) {
                        throw Error.argument("baseUrl", Sys.Res.badBaseUrl2);
                    }
                    return baseUrl.substr(0, nextSlash) + url;
                }
                else {
                    var lastSlash = baseUrl.lastIndexOf('/');
                    if (lastSlash === -1) {
                        throw Error.argument("baseUrl", Sys.Res.badBaseUrl3);
                    }
                    return baseUrl.substr(0, lastSlash + 1) + url;
                }
            };
            /**
             * @param queryString
             *      (Optional) An object containing key value pairs to be serialized as query string.
             * @param encodeMethod
             *      (Optional) The method to be used for the encoding. If not specified, the browser's encodeURIComponent method is used.
             * @param addParams
             *      (Optiona) Additional parameters; already encoded as url string.
             */
            WebRequest._createQueryString = function (queryString, encodeMethod, addParams) {
                queryString = queryString || {};
                encodeMethod = encodeMethod || encodeURIComponent;
                var i = 0;
                var sb = new Sys.StringBuilder();
                for (var arg in queryString) {
                    var obj = queryString[arg];
                    if (typeof (obj) === "function")
                        continue;
                    var val = Sys.Serialization.JavaScriptSerializer.serialize(obj);
                    if (i++) {
                        sb.append('&');
                    }
                    sb.append(arg);
                    sb.append('=');
                    sb.append(encodeMethod(val));
                }
                if (addParams !== undefined) {
                    if (i) {
                        sb.append('&');
                    }
                    sb.append(addParams);
                }
                return sb.toString();
            };
            WebRequest._createUrl = function (url, queryString, addParams) {
                if (!queryString && !addParams) {
                    return url;
                }
                var qs = WebRequest._createQueryString(queryString, null, addParams);
                return qs.length ?
                    url + ((url && url.indexOf('?') >= 0) ? "&" : "?") + qs :
                    url;
            };
            return WebRequest;
        }());
        Net.WebRequest = WebRequest;
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        /**
         * Provides the abstract base class from which network executors derive.
         * @see {@link http://msdn.microsoft.com/en-us/library/bb397434(v=vs.100).aspx}
         */
        var WebRequestExecutor = (function () {
            function WebRequestExecutor() {
            }
            /**
             * Gets the WebRequest object associated with the executor.
             * @returns
             * 		The WebRequest object associated with the current executor instance.
             */
            WebRequestExecutor.prototype.get_webRequest = function () {
                return this._webRequest;
            };
            /**
             * Sets the WebRequest object associated with the executor.
             * @param value
             * 		The WebRequest object associated with the current executor instance.
             */
            WebRequestExecutor.prototype._set_webRequest = function (value) {
                this._webRequest = value;
            };
            /**
             * Gets the JSON-evaluated object from the response.
             * @returns
             * 		The JSON-evaluated response object.
             */
            WebRequestExecutor.prototype.get_object = function () {
                if (!this._resultObject) {
                    this._resultObject = Sys.Serialization.JavaScriptSerializer.deserialize(this.get_responseData());
                }
                return this._resultObject;
            };
            return WebRequestExecutor;
        }());
        Net.WebRequestExecutor = WebRequestExecutor;
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        /**
         * Manages the flow of the Web requests issued by the {@link WebRequest} object to the associated executor object.
         * The default executor associated with a WebRequest object is an instance of the XmlHttpExecutor class. The executor is responsible for making the actual network requests.
         * The WebRequestManager class defines the default behavior for all Web requests so that you do not have to specify low-level network configuration settings for each request.
         * Each page contains only one WebRequestManager instance. However, you might have several instances of the WebRequest class and related executor.
         */
        var _WebRequestManager = (function () {
            function _WebRequestManager() {
                this._defaultTimeout = 0;
                this._defaultExecutorType = Sys.Net.XMLHttpExecutor;
                this._events = new Sys.EventHandlerList();
            }
            /**
             * Registers a handler for processing the invoking request event of the WebRequestManager.
             * @param handler
             *      The function registered to handle the invoking request event.
             */
            _WebRequestManager.prototype.add_invokingRequest = function (handler) {
                this._get_eventHandlerList().addHandler("invokingRequest", handler);
            };
            /**
             * Removes the event handler set by the add_invokingRequest method.
             * Use the remove_invokingRequest method to remove the event handler you set using the add_invokingRequest method.
             * @param handler
             *          The function that handles the invoking request event.
             */
            _WebRequestManager.prototype.remove_invokingRequest = function (handler) {
                this._get_eventHandlerList().removeHandler("invokingRequest", handler);
            };
            /**
             * Registers a handler for the completed request event of the WebRequestManager.
             * @param handler
             * 		The function registered to handle the completed request event.
             */
            _WebRequestManager.prototype.add_completedRequest = function (handler) {
                this._get_eventHandlerList().addHandler("completedRequest", handler);
            };
            /**
             * Removes the event handler set by the add_completedRequest method.
             * Use the remove_ completedRequest method to remove the event handler you set using the add_ completedRequest method.
             * @param handler
             *      The function that handles the completed request event.
             */
            _WebRequestManager.prototype.remove_completedRequest = function (handler) {
                this._get_eventHandlerList().removeHandler("completedRequest", handler);
            };
            _WebRequestManager.prototype._get_eventHandlerList = function () {
                return this._events;
            };
            /**
             * Gets or sets the time-out for the default network executor.
             * @returns
             *      An integer value that indicates the current time-out for the default executor.
             */
            _WebRequestManager.prototype.get_defaultTimeout = function () {
                return this._defaultTimeout;
            };
            /**
             * Gets or sets the time-out for the default network executor.
             * @throws {@link ArgumentOutOfRangeException} An invalid parameter was passed.
             * @param value
             *          The time in milliseconds that the default executor should wait before timing out a Web request. This value must be 0 or a positive integer.
             */
            _WebRequestManager.prototype.set_defaultTimeout = function (value) {
                if (value < 0) {
                    throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
                }
                this._defaultTimeout = value;
            };
            /**
             * Gets or sets the default network executor type that is used to make network requests.
             * @return
             *      The object that represents the default Web request executor.
             */
            _WebRequestManager.prototype.get_defaultExecutorType = function () {
                return this._defaultExecutorType;
            };
            /**
             * Gets or sets the default network executor type that is used to make network requests.
             * @param value
             *          A reference to an implementation of the WebRequestExecutor class.
             */
            _WebRequestManager.prototype.set_defaultExecutorType = function (value) {
                this._defaultExecutorType = value;
            };
            /**
             * Sends Web requests to the default network executor.
             * @param webRequest
             * 		An instance of the {@link WebRequest} class.
             */
            _WebRequestManager.prototype.executeRequest = function (webRequest) {
                var executor = webRequest.get_executor();
                if (!executor) {
                    var failed = false;
                    try {
                        executor = new this._defaultExecutorType();
                    }
                    catch (e) {
                        failed = true;
                    }
                    if (failed || !Sys.Net.WebRequestExecutor.isInstanceOfType(executor) || !executor) {
                        throw Error.argument("defaultExecutorType", String.format(Sys.Res.invalidExecutorType, this._defaultExecutorType.toString()));
                    }
                    webRequest.set_executor(executor);
                }
                if (executor.get_aborted()) {
                    return;
                }
                var evArgs = new Sys.Net.NetworkRequestEventArgs(webRequest);
                var handler = this._get_eventHandlerList().getHandler("invokingRequest");
                if (handler) {
                    handler(this, evArgs);
                }
                if (!evArgs.get_cancel()) {
                    executor.executeRequest();
                }
            };
            return _WebRequestManager;
        }());
        Net.WebRequestManager = new _WebRequestManager();
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        var WebServiceError = (function () {
            function WebServiceError(timedOut, message, stackTrace, exceptionType, errorObject) {
                this._statusCode = -1;
                this._timedOut = timedOut;
                this._message = message;
                this._stackTrace = stackTrace;
                this._exceptionType = exceptionType;
                this._errorObject = errorObject;
                this._statusCode = -1;
            }
            WebServiceError.prototype.get_timedOut = function () {
                return this._timedOut;
            };
            WebServiceError.prototype.get_statusCode = function () {
                return this._statusCode;
            };
            WebServiceError.prototype.get_message = function () {
                return this._message;
            };
            WebServiceError.prototype.get_stackTrace = function () {
                return this._stackTrace || "";
            };
            WebServiceError.prototype.get_exceptionType = function () {
                return this._exceptionType || "";
            };
            WebServiceError.prototype.get_errorObject = function () {
                return this._errorObject || null;
            };
            return WebServiceError;
        }());
        Net.WebServiceError = WebServiceError;
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        var _jsonp = 0;
        ;
        /**
         * Provides a way to call a method of a specified Web service asynchronously.
         */
        var WebServiceProxy = (function () {
            function WebServiceProxy() {
                this._succeeded = function (result, userContext, methodName) { };
                this._failed = function (result, userContext, methodName) { };
                this._enableJsonp = false;
                this._callbackParameter = "Callback";
            }
            /**
             * Gets the timeout, in milliseconds, for the service.
             * @returns
             *      The timeout, in milliseconds, for the service.
             */
            WebServiceProxy.prototype.get_timeout = function () {
                return this._timeout || 0;
            };
            /**
             * Sets the timeout, in milliseconds, for the service.
             * @param value
             *      The timeout, in milliseconds, for the service.
             */
            WebServiceProxy.prototype.set_timeout = function (value) {
                if (value < 0) {
                    throw Error.argumentOutOfRange('value', value, Sys.Res.invalidTimeout);
                }
                this._timeout = value;
            };
            /**
             * Gets the default user context for the service.
             * @returns
             *      A reference to the user context for the service.
             */
            WebServiceProxy.prototype.get_defaultUserContext = function () {
                return this._userContext;
            };
            /**
             * Sets the default user context for the service.
             * @param value
             *      A reference to the user context for the service.
             */
            WebServiceProxy.prototype.set_defaultUserContext = function (value) {
                this._userContext = value;
            };
            /**
             * Gets the default succeeded callback function for the service.
             * @returns
             *      A reference to the succeeded callback function for the service.
             */
            WebServiceProxy.prototype.get_defaultSucceededCallback = function () {
                return this._succeeded || null;
            };
            /**
             * Sets the default succeeded callback function for the service.
             * @param value
             *      A reference to the succeeded callback function for the service.
             */
            WebServiceProxy.prototype.set_defaultSucceededCallback = function (value) {
                this._succeeded = value;
            };
            /**
             * Gets the default failed callback function for the service.
             * @returns
             *      A reference to the failed callback function for the service.
             */
            WebServiceProxy.prototype.get_defaultFailedCallback = function () {
                return this._failed || null;
            };
            /**
             * Sets the default failed callback function for the service.
             * @param value
             *      A reference to the failed callback function for the service.
             */
            WebServiceProxy.prototype.set_defaultFailedCallback = function (value) {
                this._failed = value;
            };
            /**
             * Gets a value that indicates whether the service supports JSONP for cross-domain calls.
             * @returns
             *      true if the Web service supports JSONP for cross-domain calls; otherwise, false.
             */
            WebServiceProxy.prototype.get_enableJsonp = function () {
                return this._enableJsonp;
            };
            /**
             * Sets a value that indicates whether the service supports JSONP for cross-domain calls.
             * @param value
             *      true if the Web service supports JSONP for cross-domain calls; otherwise, false.
             */
            WebServiceProxy.prototype.set_enableJsonp = function (value) {
                this._enableJsonp = value;
            };
            /**
             * Gets the path of the service.
             * @returns
             *      The full path of the service.
             */
            WebServiceProxy.prototype.get_path = function () {
                return this._path || null;
            };
            /**
             * Sets the path of the service.
             * @param
             *      The full path of the service.
             */
            WebServiceProxy.prototype.set_path = function (value) {
                this._path = value;
            };
            /**
             * Gets a value that specifies the callback function name for a JSONP request.
             * @returns
             *      A string that contains the name of the callback function for a JSONP request.
             */
            WebServiceProxy.prototype.get_jsonpCallbackParameter = function () {
                return this._callbackParameter;
            };
            /**
             * Sets a value that specifies the callback function name for a JSONP request.
             * @param value
             *      A string that contains the name of the callback function for a JSONP request.
             */
            WebServiceProxy.prototype.set_jsonpCallbackParameter = function (value) {
                this._callbackParameter = value;
            };
            /**
             * Called by the service-generated proxy classes.
             *
             * @param servicePath
             *      A string that contains the Web service URL. ServicePath can be set to a fully qualified URL (http://www.mySite.com/myService.asmx),
             *      to an absolute URL without the host name or the fully qualified domain name (FQDN) (/myService.asmx), or to a relative URL (../myService.asmx).
             *      The Sys.Net.WebRequest class makes sure that the URL is converted into a form that is usable by network executors.
             * @param methodName
             *      A string that contains the name of the Web service method to invoke.
             * @param useGet
             *      (Optional) false to set the Web request HTTP verb to POST; otherwise, true. The default is false.
             * @param params
             *      (Optional) A JavaScript dictionary that contains named properties (fields) that correspond to the parameters of the method to call.
             * @param onSuccess
             *      (Optional) The function that is invoked as a callback if the Web service method call returns successfully.
             *      onSuccess can be set to null if you do not need it and if you must specify a value for the remaining parameters.
             *      If no callback function is provided, no action is taken when the Web service method finishes successfully.
             * @param onFailure
             *      (Optional) The function that is invoked as a callback if the Web service method call fails.
             *      onFailure can be set to null if you do not need it and if you must specify a value for the remaining parameters.
             *      If no callback function is provided, no action is taken if an error occurs during the Web service method call.
             * @param userContext
             *      (Optional) Any user-specific information. userContext can be any JavaScript primitive type, array, or object.
             *      The contents of userContext are passed to the callback functions (if any). If userContext is not provided, null is passed to the callback function.
             */
            WebServiceProxy.prototype._invoke = function (servicePath, methodName, useGet, params, onSuccess, onFailure, userContext) {
                onSuccess = onSuccess || this.get_defaultSucceededCallback();
                onFailure = onFailure || this.get_defaultFailedCallback();
                if (userContext === null || undefined) {
                    userContext = this.get_defaultUserContext();
                }
                return WebServiceProxy.invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, this.get_timeout(), this.get_enableJsonp(), this.get_jsonpCallbackParameter());
            };
            /**
             * Invokes the specified Web service method.
             * @param servicePath
             *      A string that contains the Web service URL. ServicePath can be set to a fully qualified URL (http://www.mySite.com/myService.asmx),
             *      to an absolute URL without the host name or the fully qualified domain name (FQDN) (/myService.asmx), or to a relative URL (../myService.asmx).
             *      The WebRequest class makes sure that the URL is converted into a form that is usable by network executors.
             * @param methodName
             *      A string that contains the name of the Web service method to invoke.
             * @param useGet
             *      (Optional) false to set the Web request HTTP verb to POST; otherwise, true. The default is false.
             * @param params
             *      (Optional) A JavaScript dictionary that contains named properties (fields) that correspond to the parameters of the method to call.
             * @param onSuccess
             *      (Optional) The function that is invoked as a callback if the Web service method call returns successfully.
             *      onSuccess can be set to null if you do not need it and if you must specify a value for the remaining parameters.
             *      If no callback function is provided, no action is taken when the Web service method finishes successfully.
             * @param onFailure
             *      (Optional) The function that is invoked as a callback if the Web service method call fails.
             *      onFailure can be set to null if you do not need it and if you must specify a value for the remaining parameters.
             *      If no callback function is provided, no action is taken if an error occurs during the Web service method call.
             * @param userContext
             *      (Optional) Any user-specific information. userContext can be any JavaScript primitive type, array, or object.
             *      The contents of userContext are passed to the callback functions (if any). If userContext is not provided, null is passed to the callback function.
             * @param timeout
             *      (Optional) The time in milliseconds that the network executor must wait before timing out the Web request.
             *      timeout can be an integer or null. By defining a time-out interval, you can control the time that the application must wait for the callback to finish.
             * @param enableJsonp
             *      (Optional) true to indicate that the service supports JSONP for cross-domain calls; otherwise, false.
             * @param jsonpCallbackParameter
             *      (Optional) The name of the callback parameter for the JSONP request. The default is "callback".
             * @returns
             *      The {@link WebRequest} instance that is used to call the method. This instance can be used to stop the call.
             */
            WebServiceProxy.invoke = function (servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, timeout, enableJsonp, jsonpCallbackParameter) {
                if (useGet === void 0) { useGet = true; }
                var schemeHost = (enableJsonp !== false) ? WebServiceProxy._xdomain.exec(servicePath) : null;
                var tempCallback;
                var jsonp = schemeHost && (schemeHost.length === 3) && ((schemeHost[1] !== location.protocol) || (schemeHost[2] !== location.host));
                useGet = jsonp || useGet;
                if (jsonp) {
                    jsonpCallbackParameter = jsonpCallbackParameter || "callback";
                    tempCallback = "_jsonp" + _jsonp++;
                }
                if (!params)
                    params = {};
                var urlParams = params;
                if (!useGet || !urlParams)
                    urlParams = {};
                var timeoutcookie;
                var script;
                var error;
                var loader;
                var url = Sys.Net.WebRequest._createUrl(methodName ?
                    (servicePath + "/" + encodeURIComponent(methodName)) :
                    servicePath, urlParams, jsonp ? (jsonpCallbackParameter + "=" + tempCallback) : null);
                if (jsonp || false) {
                    script = document.createElement("script");
                    script.src = url;
                    /*
                    loader = new _ScriptLoaderTask( script, function( script, loaded )
                    {
                        if ( !loaded || tempCallback )
                        {
                            jsonpComplete(
                            {
                                Message: String.format( Sys.Res.webServiceFailedNoMsg, methodName )
                            }, -1 );
                        }
                    } );
                    */ //TODO
                    var jsonpComplete = function (data, statusCode) {
                        if (timeoutcookie !== undefined) {
                            window.clearTimeout(timeoutcookie);
                            timeoutcookie = undefined;
                        }
                        loader.dispose();
                        window["Sys"].tempCallback;
                        tempCallback = null;
                        if ((typeof (statusCode) !== "undefined") && (statusCode !== 200)) {
                            if (onFailure) {
                                error = new Sys.Net.WebServiceError(false, data.Message || String.format(Sys.Res.webServiceFailedNoMsg, methodName), data.StackTrace || null, data.ExceptionType || null, data);
                                error["_statusCode"] = statusCode; // TODO
                                onFailure(error, userContext, methodName);
                            }
                            else {
                                var errorMsg = void 0;
                                if (data.StackTrace && data.Message) {
                                    errorMsg = data.StackTrace + "-- " + data.Message;
                                }
                                else {
                                    errorMsg = data.StackTrace || data.Message;
                                }
                                errorMsg = String.format(errorMsg ? Sys.Res.webServiceFailed : Sys.Res.webServiceFailedNoMsg, methodName, errorMsg);
                                throw WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, errorMsg));
                            }
                        }
                        else if (onSuccess) {
                            onSuccess(data, userContext, methodName);
                        }
                    };
                    window["Sys"].tempCallback = jsonpComplete;
                    loader.execute();
                    return null;
                }
                var request = new Sys.Net.WebRequest();
                request.set_url(url);
                request.get_headers()['Content-Type'] = 'application/json; charset=utf-8';
                if (useGet === true) {
                    request.set_httpVerb("GET");
                }
                else {
                    request.set_httpVerb("POST");
                    var body = Sys.Serialization.JavaScriptSerializer.serialize(params);
                    if (body === "{}")
                        body = "";
                    request.set_body(body);
                }
                request.add_completed(onComplete);
                if (timeout && timeout > 0)
                    request.set_timeout(timeout);
                request.invoke();
                function onComplete(response, eventArgs) {
                    if (response.get_responseAvailable()) {
                        var statusCode = response.get_statusCode();
                        var result = void 0;
                        try {
                            var contentType = response.getResponseHeader("Content-Type");
                            if (contentType.startsWith("application/json")) {
                                result = response.get_object();
                            }
                            else if (contentType.startsWith("text/xml")) {
                                result = response.get_xml();
                            }
                            else {
                                result = response.get_responseData();
                            }
                        }
                        catch (ex) { }
                        var error = response.getResponseHeader("jsonerror");
                        var errorObj = (error === "true");
                        if (errorObj) {
                            if (result !== undefined) {
                                var err = result;
                                result = new Sys.Net.WebServiceError(false, err.Message, err.StackTrace, err.ExceptionType, result);
                            }
                        }
                        else if (contentType.startsWith("application/json")) {
                            result = (!result || (result.d === undefined)) ? result : result.d;
                        }
                        if (((statusCode < 200) || (statusCode >= 300)) || errorObj) {
                            if (onFailure) {
                                if (!result || !errorObj) {
                                    result = new Sys.Net.WebServiceError(false, String.format(Sys.Res.webServiceFailedNoMsg, methodName));
                                }
                                result._statusCode = statusCode;
                                onFailure(result, userContext, methodName);
                            }
                            else {
                                if (result && errorObj) {
                                    error = result.get_exceptionType() + "-- " + result.get_message();
                                }
                                else {
                                    error = response.get_responseData();
                                }
                                throw WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
                            }
                        }
                        else if (onSuccess) {
                            onSuccess(result, userContext, methodName);
                        }
                    }
                    else {
                        var msg;
                        if (response.get_timedOut()) {
                            msg = String.format(Sys.Res.webServiceTimedOut, methodName);
                        }
                        else {
                            msg = String.format(Sys.Res.webServiceFailedNoMsg, methodName);
                        }
                        if (onFailure) {
                            onFailure(new Sys.Net.WebServiceError(response.get_timedOut(), msg, "", ""), userContext, methodName);
                        }
                        else {
                            throw WebServiceProxy._createFailedError(methodName, msg);
                        }
                    }
                }
                return request;
            };
            WebServiceProxy._createFailedError = function (methodName, errorMessage) {
                var displayMessage = "WebServiceFailedException: " + errorMessage;
                var e = Error.create(displayMessage, {
                    'name': 'WebServiceFailedException',
                    'methodName': methodName
                });
                e.popStackFrame();
                return e;
            };
            WebServiceProxy._defaultFailedCallback = function (err, methodName) {
                var error = err.get_exceptionType() + "-- " + err.get_message();
                throw WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
            };
            WebServiceProxy._generateTypedConstructor = function (type) {
                return function (properties) {
                    var result = { __type: type };
                    if (properties !== undefined) {
                        for (var name in properties) {
                            result[name] = properties[name];
                        }
                    }
                    return result;
                };
            };
            WebServiceProxy._xdomain = /^\s*([a-zA-Z0-9\+\-\.]+\:)\/\/([^?#\/]+)/;
            return WebServiceProxy;
        }());
        Net.WebServiceProxy = WebServiceProxy;
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        function XMLDOM(markup) {
            if (!window.DOMParser) {
                var progIDs = ['Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument'];
                for (var i = 0, l = progIDs.length; i < l; i++) {
                    try {
                        var xmlDOM = new ActiveXObject(progIDs[i]);
                        xmlDOM.async = false;
                        xmlDOM.loadXML(markup);
                        xmlDOM.setProperty('SelectionLanguage', 'XPath');
                        return xmlDOM;
                    }
                    catch (ex) { }
                }
            }
            else {
                try {
                    var domParser = new window.DOMParser();
                    return domParser.parseFromString(markup, 'text/xml');
                }
                catch (ex) { }
            }
            return null;
        }
        Net.XMLDOM = XMLDOM;
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Sys;
(function (Sys) {
    var Net;
    (function (Net) {
        var XMLHttpExecutor = (function (_super) {
            __extends(XMLHttpExecutor, _super);
            function XMLHttpExecutor() {
                var _this = _super.call(this) || this;
                _this._responseAvailable = false;
                _this._timedOut = false;
                _this._aborted = false;
                _this._started = false;
                return _this;
            }
            XMLHttpExecutor.prototype.get_started = function () {
                return this._started;
            };
            XMLHttpExecutor.prototype.get_responseAvailable = function () {
                return this._responseAvailable;
            };
            XMLHttpExecutor.prototype.get_timedOut = function () {
                return this._timedOut;
            };
            XMLHttpExecutor.prototype.get_aborted = function () {
                return this._aborted;
            };
            XMLHttpExecutor.prototype.get_responseData = function () {
                if (this._responseAvailable == false) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_responseData'));
                }
                if (this._xmlHttpRequest === undefined) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_responseData'));
                }
                return this._xmlHttpRequest.responseText;
            };
            XMLHttpExecutor.prototype.get_statusCode = function () {
                if (!this._responseAvailable) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusCode'));
                }
                if (this._xmlHttpRequest === undefined) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusCode'));
                }
                var result = 0;
                try {
                    result = this._xmlHttpRequest.status;
                }
                catch (ex) { }
                return result;
            };
            XMLHttpExecutor.prototype.get_statusText = function () {
                if (!this._responseAvailable) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusText'));
                }
                if (this._xmlHttpRequest === undefined) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusText'));
                }
                return this._xmlHttpRequest.statusText;
            };
            XMLHttpExecutor.prototype.get_xml = function () {
                if (!this._responseAvailable) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_xml'));
                }
                if (this._xmlHttpRequest === undefined) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_xml'));
                }
                var xml = this._xmlHttpRequest.responseXML;
                if (!xml || !xml.documentElement) {
                    xml = Sys.Net.XMLDOM(this._xmlHttpRequest.responseText);
                    if (!xml || !xml.documentElement)
                        return null;
                }
                else if (navigator.userAgent.indexOf('MSIE') !== -1) {
                    var xmlDomDocument = xml;
                    xmlDomDocument.setProperty('SelectionLanguage', 'XPath');
                }
                if (xml.documentElement.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" &&
                    xml.documentElement.tagName === "parsererror") {
                    return null;
                }
                if (xml.documentElement.firstChild && xml.documentElement.firstChild.nodeName === "parsererror") {
                    return null;
                }
                return xml;
            };
            XMLHttpExecutor.prototype._onReadyStateChange = function () {
                if (this._xmlHttpRequest.readyState === 4) {
                    try {
                        if (this._xmlHttpRequest.status === undefined) {
                            return;
                        }
                    }
                    catch (ex) {
                        return;
                    }
                    this._clearTimer();
                    this._responseAvailable = true;
                    this._webRequest.completed(Sys.EventArgs.Empty);
                    if (this._xmlHttpRequest !== undefined) {
                        this._xmlHttpRequest.onreadystatechange = function () { };
                        delete this._xmlHttpRequest;
                    }
                }
            };
            XMLHttpExecutor.prototype._clearTimer = function () {
                if (this._timer !== undefined) {
                    window.clearTimeout(this._timer);
                    delete this._timer;
                }
            };
            XMLHttpExecutor.prototype._onTimeout = function () {
                if (this._timer !== undefined) {
                    window.clearTimeout(this._timer);
                    delete this._timer;
                }
            };
            XMLHttpExecutor.prototype.executeRequest = function () {
                var _this = this;
                if (this._started) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallOnceStarted, 'executeRequest'));
                }
                if (this._webRequest === null) {
                    throw Error.invalidOperation(Sys.Res.nullWebRequest);
                }
                var body = this._webRequest.get_body();
                var headers = this._webRequest.get_headers();
                this._xmlHttpRequest = new XMLHttpRequest();
                //this._xmlHttpRequest.addEventListener( "readyStateChange", this._onReadyStateChange );
                this._xmlHttpRequest.onreadystatechange = function () { _this._onReadyStateChange(); };
                var verb = this._webRequest.get_httpVerb();
                this._xmlHttpRequest.open(verb, this._webRequest.getResolvedUrl(), true);
                this._xmlHttpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                if (headers) {
                    for (var header in headers) {
                        var val = headers[header];
                        if (typeof (val) !== "function")
                            this._xmlHttpRequest.setRequestHeader(header, val);
                    }
                }
                if (verb.toLowerCase() === "post") {
                    if ((headers === null) || !headers['Content-Type']) {
                        this._xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
                    }
                    if (!body) {
                        body = "";
                    }
                }
                var timeout = this._webRequest.get_timeout();
                if (timeout > 0) {
                    this._timer = window.setTimeout(Function.createDelegate(this, this._onTimeout), timeout);
                }
                this._xmlHttpRequest.send(body);
                this._started = true;
            };
            XMLHttpExecutor.prototype.getResponseHeader = function (header) {
                if (!this._responseAvailable) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getResponseHeader'));
                }
                if (!this._xmlHttpRequest) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getResponseHeader'));
                }
                var result;
                try {
                    result = this._xmlHttpRequest.getResponseHeader(header);
                }
                catch (e) { }
                if (!result)
                    result = "";
                return result;
            };
            XMLHttpExecutor.prototype.getAllResponseHeaders = function () {
                if (!this._responseAvailable) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getAllResponseHeaders'));
                }
                if (!this._xmlHttpRequest) {
                    throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getAllResponseHeaders'));
                }
                return this._xmlHttpRequest.getAllResponseHeaders();
            };
            XMLHttpExecutor.prototype.abort = function () {
                if (!this._started) {
                    throw Error.invalidOperation(Sys.Res.cannotAbortBeforeStart);
                }
                if (this._aborted || this._responseAvailable || this._timedOut)
                    return;
                this._aborted = true;
                this._clearTimer();
                if (this._xmlHttpRequest && !this._responseAvailable) {
                    this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
                    this._xmlHttpRequest.abort();
                    delete this._xmlHttpRequest;
                    this._webRequest.completed(Sys.EventArgs.Empty);
                }
            };
            return XMLHttpExecutor;
        }(Sys.Net.WebRequestExecutor));
        Net.XMLHttpExecutor = XMLHttpExecutor;
    })(Net = Sys.Net || (Sys.Net = {}));
})(Sys || (Sys = {}));
var Test = (function (_super) {
    __extends(Test, _super);
    function Test() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Test.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        alert("TEST");
    };
    return Test;
}(Sys.Component));
var c = $create(Test, null, null, null, null);
c.initialize();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWljcm9zb2Z0QWpheC5kZWJ1Zy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Gb3JtYXR0YWJsZU9iamVjdC50cyIsIi4uL3NyYy9JbmRleC50cyIsIi4uL3NyYy9HbG9iYWwudHMiLCIuLi9zcmMvQXJyYXkudHMiLCIuLi9zcmMvQm9vbGVhbi50cyIsIi4uL3NyYy9EYXRlLnRzIiwiLi4vc3JjL0Vycm9yLnRzIiwiLi4vc3JjL0Z1bmN0aW9uLnRzIiwiLi4vc3JjL051bWJlci50cyIsIi4uL3NyYy9PYmplY3QudHMiLCIuLi9zcmMvU3RyaW5nLnRzIiwiLi4vc3JjL1N5cy9FdmVudEhhbmRsZXJMaXN0LnRzIiwiLi4vc3JjL1N5cy9Db21wb25lbnQudHMiLCIuLi9zcmMvU3lzL0V2ZW50QXJncy50cyIsIi4uL3NyYy9TeXMvQXBwbGljYXRpb25Mb2FkRXZlbnRBcmdzLnRzIiwiLi4vc3JjL1N5cy9Ccm93c2VyLnRzIiwiLi4vc3JjL1N5cy9DYW5jZWxFdmVudEFyZ3MudHMiLCIuLi9zcmMvU3lzL0N1bHR1cmVJbmZvLnRzIiwiLi4vc3JjL1N5cy9IaXN0b3J5RXZlbnRBcmdzLnRzIiwiLi4vc3JjL1N5cy9SZXMudHMiLCIuLi9zcmMvU3lzL1N0cmluZ0J1aWxkZXIudHMiLCIuLi9zcmMvU3lzL1NlcmlhbGl6YXRpb24vSmF2YVNjcmlwdFNlcmlhbGl6ZXIudHMiLCIuLi9zcmMvU3lzL1VJL0JlaGF2aW9yLnRzIiwiLi4vc3JjL1N5cy9VSS9Cb3VuZHMudHMiLCIuLi9zcmMvU3lzL1VJL0NvbnRyb2wudHMiLCIuLi9zcmMvU3lzL1VJL0RvbUVsZW1lbnQudHMiLCIuLi9zcmMvU3lzL1VJL0RvbUV2ZW50LnRzIiwiLi4vc3JjL1N5cy9VSS9LZXkudHMiLCIuLi9zcmMvU3lzL1VJL01vdXNlQnV0dG9uLnRzIiwiLi4vc3JjL1N5cy9VSS9Qb2ludC50cyIsIi4uL3NyYy9TeXMvVUkvVmlzaWJpbGl0eU1vZGUudHMiLCIuLi9zcmMvU3lzL05ldC9OZXR3b3JrUmVxdWVzdEV2ZW50QXJncy50cyIsIi4uL3NyYy9TeXMvTmV0L1dlYlJlcXVlc3QudHMiLCIuLi9zcmMvU3lzL05ldC9XZWJSZXF1ZXN0RXhlY3V0b3IudHMiLCIuLi9zcmMvU3lzL05ldC9XZWJSZXF1ZXN0TWFuYWdlci50cyIsIi4uL3NyYy9TeXMvTmV0L1dlYlNlcnZpY2VFcnJvci50cyIsIi4uL3NyYy9TeXMvTmV0L1dlYlNlcnZpY2VQcm94eS50cyIsIi4uL3NyYy9TeXMvTmV0L1hNTERPTS50cyIsIi4uL3NyYy9TeXMvTmV0L1hNTEh0dHBFeGVjdXRvci50cyIsIi4uL3Rlc3QvSW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUEsaUJBQ0ksSUFHQyxFQUNELFVBQW9CLEVBQ3BCLE1BR1EsRUFDUixVQUFzQixFQUN0QixPQUEyQjtJQUUzQixJQUFJLFNBQVMsQ0FBQztJQUNkLEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQyxZQUFZLENBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFHLENBQUMsQ0FDbEYsQ0FBQztRQUNHLEVBQUUsQ0FBQyxDQUFFLE9BQU8sS0FBSyxJQUFLLENBQUMsQ0FDdkIsQ0FBQztZQUNHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBRSxDQUFDO1FBQ3BFLENBQUM7UUFDRCxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUUsT0FBTyxDQUFFLENBQUM7SUFDcEMsQ0FBQztJQUNELElBQUksQ0FDSixDQUFDO1FBQ0csU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFHRCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFeEIsRUFBRSxDQUFDLENBQUUsVUFBVSxLQUFLLElBQUssQ0FBQyxDQUMxQixDQUFDO1FBQ0csR0FB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QUUsQ0FBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFFLEdBQUcsR0FBRyxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFFLENBQUM7Z0JBQzdFLEtBQUssQ0FBQztZQUNWLEtBQUssR0FBRztnQkFDSixHQUFHLENBQUMsTUFBTSxDQUFFLENBQUUsQ0FBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFFLEdBQUcsR0FBRyxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFFLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBRSxDQUFFLENBQUM7Z0JBQzdGLEtBQUssQ0FBQztZQUNWLEtBQUssR0FBRztnQkFDSixHQUFHLENBQUMsTUFBTSxDQUFFLGVBQWUsQ0FBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUUsQ0FBQztnQkFDcEUsS0FBSyxDQUFDO1lBQ1YsS0FBSyxJQUFJO2dCQUNMLEdBQUcsQ0FBQyxNQUFNLENBQUUsZUFBZSxDQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBRSxDQUFDLE1BQU0sQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUUsQ0FBQztnQkFDdkUsS0FBSyxDQUFDO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUUsZUFBZSxDQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBRSxDQUFFLENBQUM7Z0JBQ3hELEtBQUssQ0FBQztZQUNWLEtBQUssR0FBRztnQkFDSixJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUNyQyxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUUsQ0FBRSxJQUFJLElBQUksQ0FBQyxDQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUUsQ0FBRSxDQUFFLENBQUM7Z0JBQzdFLEtBQUssQ0FBQztZ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RSxJQUFJLEdBQUcsSUFBSSxDQUFHLENBQUM7d0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDbkQsS0FBSyxDQUFDO2dCQUNWLEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssSUFBSTtvQkFDTCxJQUFJLEdBQUcsUUFBUSxDQUFFLFVBQVUsRUFBRSxFQUFFLENBQUUsQ0FBQztvQkFDbEMsRUFBRSxDQUFDLENBQUUsSUFBSSxLQUFLLEVBQUcsQ0FBQzt3QkFBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO29CQUM1QixFQUFFLENBQUMsQ0FBRSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSSxDQUFFLElBQUksR0FBRyxFQUFFLENBQUcsQ0FBQzt3QkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNqRCxLQUFLLENBQUM7Z0JBQ1YsS0FBSyxHQUFHLENBQUM7Z0JBQ1QsS0FBSyxJQUFJO29CQUNMLElBQUksR0FBRyxRQUFRLENBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBRSxDQUFDO29CQUNsQyxFQUFFLENBQUMsQ0FBRSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUUsSUFBSSxDQUFFLElBQUksR0FBRyxFQUFFLENBQUcsQ0FBQzt3QkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNqRCxLQUFLLENBQUM7Z0JBQ1YsS0FBSyxHQUFHLENBQUM7Z0JBQ1QsS0FBSyxJQUFJO29CQUNMLEdBQUcsR0FBRyxRQUFRLENBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBRSxDQUFDO29CQUNqQyxFQUFFLENBQUMsQ0FBRSxDQUFFLEdBQUcsR0FBRyxDQUFDLENBQUUsSUFBSSxDQUFFLEdBQUcsR0FBRyxFQUFFLENBQUcsQ0FBQzt3QkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUMvQyxLQUFLLENBQUM7Z0JBQ1YsS0FBSyxHQUFHLENBQUM7Z0JBQ1QsS0FBSyxJQUFJO29CQUNMLEdBQUcsR0FBRyxRQUFRLENBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBRSxDQUFDO29CQUNqQyxFQUFFLENBQUMsQ0FBRSxDQUFFLEdBQUcsR0FB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LEdBQUcsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDLENBQUUsQ0FBRSxHQUFHLENBQUMsQ0FBRSxDQUFDO1FBQzdELEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFFLEdBQUcsQ0FBRSxDQUFDO1FBQ2xDLFlBQVksR0FBRyxLQUFLLENBQUUsQ0FBQyxDQUFFLENBQUM7UUFDMUIsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBRSxDQUFDLENBQUUsR0FBRyxFQUFFLENBQUM7UUFFM0MsSUFBSSxDQUFDLENBQUM7UUFDTixFQUFFLENBQUMsQ0FBRSxRQUFRLEdBQUcsQ0FBRSxDQUFDLENBQ25CLENBQUM7WUFDRyxLQUFLLEdBQUcsT0FBTyxDQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFFLENBQUM7WUFDMUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBRSxDQUFDO1lBQzNDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQ3JDLENBQUM7UUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUUsUUFBUSxHQUFHLENBQUUsQ0FBQyxDQUN4QixDQUFDO1lBQ0csUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3JCLFlBQVksR0FBRyxPQUFPLENBQUUsWUFBWSxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFFLENBQUM7WUFDM0QsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUUsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBRSxHQUFHLEtBQUssQ0FBQztZQUNyRSxZQUFZLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUN0RCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUUsU0FBUyxHQUFHLENBQUUsQ0FBQyxDQUNwQixDQUFDO1lBQ0csRUFBRSxDQUFDLENBQUUsS0FBSyxDQUFDLE1BQU0s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