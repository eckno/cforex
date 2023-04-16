const _ = require('lodash');
const validator = require('validator');
const crypto = require('crypto');
const dayjs = require('dayjs');

let _this = this;
/**
 *
 * @todo complete all use cases for function, update matches
 * @param {object} pattern
 * @param {string} subject
 * @param {*} matches
 * @param {int} flags
 * @param {int} offset
 * @returns {int|false}
 */
exports.preg_match = (pattern, subject, matches = null, flags = 0, offset = 0) => {

    return _.toString(subject).match(pattern);
};

exports.uniqid = (prefix = "", more_entropy = false) => {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(13, "0");
    return `${prefix}${id}${more_entropy ? `.${Math.trunc(Math.random() * 100000000)}` : ""}`;
};


/**
 *
 * @param {string} str
 * @returns
 */
exports.humanize = (str) => {
    if (!_.isString(str)) return str;
    return this.ucwords(str.trim().toLowerCase().replace('/[_]+/', ' '));
}

/**
 * Uppercase the first character of each word in a string
 * @param {string} str
 * @returns
 */
exports.ucwords = (str) => {
  if (!_.isString(str) || !str.trim()) {
    return str;
  }

  let words = str.trim().split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(' ');
}


/**
 *
 * @todo Cover all use cases
 * @param {*} body
 * @param {*} rule
 * @returns
 */
exports.filter_var = (body, rule) => {
    switch (rule) {
        case "FILTER_VALIDATE_EMAIL":
            return validator.isEmail(body);
        case "FILTER_SANITIZE_EMAIL":
            return validator.normalizeEmail(body);
        case "FILTER_VALIDATE_URL":
          return validator.isURL(body);
        case "FILTER_FLAG_NO_ENCODE_QUOTES":
        // return validator.escape(body);
        default:
            return body;
    }
};

exports.get_ip_address = (req) => {
    let ip = null;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.socket && req.socket.remoteAddress) {
        ip = req.socket.remoteAddress;
    } else {
        ip = req.ip;
    }
    return ip;
};

/**
 * Computes the difference of arrays
 * @param {array} value
 * @param {array} options
 * @return {array} an array containing all the entries from value that are not present in any of the other arrays (options).
 */
exports.array_diff = (value = [], options = []) => {
    return value.filter(v => !options.includes(v));
};

/**
 * Calculate the sha1 hash of a string
 * @todo Add salt to hash, add binary
 * @param {string} str The input string.
 * @param {boolean} binary [optional]
 * If the optional raw_output is set to true, then the sha1 digest is instead returned in raw binary format with a length of 20, otherwise the returned value is a 40-character hexadecimal number.
 * @returns {string} the sha1 hash as a string.
 */
exports.sha1 = (str, binary = false) => {
    const hash = crypto.createHash('sha1');
    return hash.update(str);
}

/**
 * Get valid phone number regex
 * @returns
 */
exports.get_valid_phone_regex = () => /^[+]?[0-9]+$/g;

/**
 * Verify phone number
 * @param {string} phone
 * @param {boolean} should_return_data
 * @returns
 */
exports.verify_phone_number = (phone, should_return_data) => {
    let allDigitPhone = phone.replace(/\D/g, "");

    if (!(allDigitPhone.length >= 10 && allDigitPhone.length <= 15 && /^[+]?[0-9]+$/g.test(allDigitPhone)) || (allDigitPhone.length === 10 && allDigitPhone.substr(0, 1) === "+")) {
        return false;
    }
    if (typeof should_return_data !== true) {
        return true;
    }
    if (allDigitPhone.startsWith("+")) {
        allDigitPhone = allDigitPhone.substring(1);
    }
    return allDigitPhone;
};

/**
 * Counts all elements in an array, or something in an object.
 * @param {array|Countable} value — The array or the object.
 * @param {numbe} $mode [optional] If the optional mode parameter is set to COUNT_RECURSIVE (or 1), count will recursively count the array. This is particularly useful for counting all the elements of a multidimensional array. count does not detect infinite recursion.
 * @returns {number} the number of elements in var, which is typically an array, since anything else will have one element.
 * If var is not an array or an object with implemented Countable interface, 1 will be returned. There is one exception, if var is null, 0 will be returned.
 * Caution: count may return 0 for a variable that isn't set, but it may also return 0 for a variable that has been initialized with an empty array. Use isset to test if a variable is set.
 * count( any array_or_countable [, int $mode = COUNT_NORMAL ]): int
 *
 * @param {*} value
 */
exports.count = (value) => {
    if (!value) return 0;
    if (typeof value === "string" || Array.isArray(value)) {
        return value.length;
    }
    if (typeof value === "object") {
        return Object.keys(value).length;
    }
    return 0;
}


/***
 * Trying to mimic PHP unset method
 * @param any data (string | array | key/pair object)
 * @param array  keyPath_or_index (array | string | number)
 * @param  string array_mode (index | value) if data is an array, determines whether keyPath_or_index represents the position/index or value of the item to delete - defualts to index
 ***/
exports.unset = (data, keyPath_or_index, array_mode = "index") => {
    if (typeof data == "object") {
        if (Array.isArray(data) && typeof keyPath_or_index !== "undefined") {
            let del_indexes = Array.isArray(keyPath_or_index) ? keyPath_or_index : [typeof keyPath_or_index === "number" ? keyPath_or_index : (typeof keyPath_or_index === "string" ? parseInt(keyPath_or_index, 10) : '')];
            if (array_mode !== "index") {
                del_indexes = Array.isArray(keyPath_or_index) ? keyPath_or_index : [keyPath_or_index];
            }
            if (del_indexes.length > 0 && del_indexes[0] !== "") {
                data = data.filter((value, index) => {
                    if (array_mode === "index") {
                        // delete based index
                        return del_indexes.indexOf(index) == -1;
                    }
                    // delete based on value
                    return del_indexes.indexOf(value) == -1;
                });
            }
        } else if (typeof keyPath_or_index !== "undefined") {
            _.unset(data, _.toString(keyPath_or_index));
        }
    } else if (typeof data === "string") {
        data = undefined;
    }

    return data;
}

/***
 * Javascript equivalent of PHP's rawurlencode
 * example: rawurlencode('https://www.google.nl/search?q=Locutus&ie=utf-8')
 * returns: 'https://www.google.nl/search?q=Locutus&ie='
 ***/
exports.rawurlencode = (str) => {
    str = (str + '')
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
    // but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
}

/***
 * Javascript equivalent of PHP's rawurldecode
 * example: rawurldecode('https%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3D')
 * returns: 'https%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'
 ***/
exports.rawurldecode = (str) => {
    return decodeURIComponent((str + '')
        .replace(/%(?![\da-f]{2})/gi, function () {
            // PHP tolerates poorly formed escape sequences
            return '%25'
        }))
}
/**
 * Helper function that checks if supplied parameter is an object type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is an object or false if it's not.
 */
exports.isObject = (data = null) => {
    return (typeof data === "object" && Object.prototype.toString.call(data) === "[object Object]") ? true : false;
}

/**
 * Helper function that checks if supplied parameter is an array or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is an array or false if it's not.
 */
exports.isArray = (data = null) => {
    return (typeof data === "object" && Object.prototype.toString.call(data) === "[object Array]") || Array.isArray(data) ? true : false;
}

/**
 * Helper function that checks if supplied parameter is a string type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is a string or false if it's not.
 */
exports.isString = (data = null) => {
    return typeof data === "string";
}

/**
 * Helper function that checks if supplied parameter is a number type or not.
 * @param {any} value - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is a number or false if it's not.
 */
exports.isNumber = (value = null) => {
    try {
        // return typeof data === "number" || /[0-9]/.test(data);
        return typeof value === 'number' && value === value && value !== Infinity && value !== -Infinity
    } catch (err) {
        return false;
    }
}

/**
 * Helper function that checks if supplied parameter is a boolean type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is a booloean type or false if it's not.
 */
exports.isBoolean = (data = null) => {
    return (typeof data === "boolean" || data === true || data === false);
}

/**
 * Helper function that checks if supplied parameter is undefined type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is undefined or false if it's not.
 */
exports.isUndefined = (data = null) => {
    return ((typeof data === "undefined" || data == undefined) ? true : false);
}

/**
 * Helper function that checks if supplied parameter is defined or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is defined or false if it's not.
 */
exports.isDefined = (data = null) => {
    return typeof data !== "undefined";
}

/**
 * Helper function that checks if supplied parameter is null type or not.
 * @param {any} data - Represents the data to run check on. Accepts international numbers too
 * @returns {boolean} - Returns true if supplied parameter (data) is a valid phone number or false if it's not.
 */
exports.isNull = (data = null) => {
    return (data === null ? true : false);
}

/**
 * Cloned Helper function that checks if supplied parameter is empty (has no value) or not.
 * Cloned from the isEmpty() function
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is empty or false if it's not.
 */
exports.empty = (data = null) => {
    return this.isEmpty(data);
}

/**
 * Helper function that checks if supplied parameter is empty (has no value) or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is empty or false if it's not.
 */
exports.isEmpty = (data = null) => {
    let rtn = false;
    if (this.isString(data) && (data === "" || data.trim() === "")) rtn = true;
    else if (this.isNumber(data) && data === 0) rtn = true;
    else if (this.isBoolean(data) && data === false) rtn = true;
    else if (this.isObject(data) && Object.values(data).length === 0) rtn = true;
    else if (this.isArray(data) && data.length === 0) rtn = true;
    else if (this.isUndefined(data)) rtn = true;
    else if (this.isNull(data)) rtn = true;

    return rtn;
}

/**
 * Get the float value of a variable
 * @param {*} value The scalar value being converted to an float
 * @returns {number} The float value of var on success, or 0 on failure. Empty arrays and objects return 0, non-empty arrays and objects return 1.
 * Strings will most likely return 0 although this depends on the leftmost characters of the string. The common rules of float casting apply.
 */
exports.floatval = (value) => {
    try {
        if (_.isString(value) || _.isNumber(value)) {
            value = parseFloat(value);
            if (_.isNaN(value)) return 0;
        } else if (!this.empty(value)) {
            value = 1;
        } else value = 0;

        return value;
    } catch (e) {
        return 0;
    }
}


exports.is_dev = (req) => {
    if (
        !this.empty(req)
        && !this.empty(req.hostname)
        && !this.isString(req.hostname)
        && !this.isString(this.get_ip_address(req))
        && _.includes(this.get_ip_address(req), '192.163.244.87') === false
        && _.includes(this.get_ip_address(req), '54.85.223.76') === false
        && _.includes(req.hostname, 'local.') === false
        && _.includes(req.hostname, 'local-') === false
        && _.includes(req.hostname, 'dev.') === false
    ) {
        return false;
    }
    return true;
}

exports.is_local = (req) => {
    if (
        !this.empty(req)
        && !this.empty(req.hostname)
        && !this.isString(req.hostname)
        && (_.indexOf(req.hostname, 'local.') === 0 || _.indexOf(req.hostname, 'local-') === 0)
    ) {
        return true;
    }
    return false;
}

exports.url_exists = (req) => {
    const hdrs = req.headers;
    return this.isArray(hdrs) ? this.preg_match(/[^HTTP\\/\\d+\\.\\d+\\s+2\\d\\d\\s+.*$]/, hdrs[0]) : false;
}

exports.skip_weekends = (date, numberofdays) => {
    const d = new Date(date);
    let t = d.getTime();
    // loop for X days
    let total_days = 0;

    //skip weekends
    for (let i = 0; i < numberofdays; i++) {
        // add 1 day to timestamp
        let addDay = 86400000;

        // get what day it is next day
        const nextDay = new Date(t + addDay).getDay();

        // if it's Saturday or Sunday get i-1
        if (nextDay === 0 || nextDay === 6) {
            i--;
        }

        // modify timestamp, add 1 day
        t = t + addDay;
        total_days++;
    }

    d.setTime(t);
    return { 'date': d, 'total_days': total_days };
}

/**
 * @todo resolve session_id
 * @returns
 */
exports.session_status = () => {
    return session_id() === '' ? 1 : 2;
}

exports.format_date = (date, format = 'M jS, Y') => {
    return dayjs(this.strtotime(date)).format(format);
}

exports.get_valid_phone_regex = () => {
    return /^[+]?([\d]{0,3})?[\(\.\-\s]?([\d]{3})[\)\.\-\s]*([\d]{3})[\.\-\s]?([\d]{4})$/;
}


exports.get_credit_card_types = () => {
    const credit_card_types = ["Visa", "MasterCard", "American Express", "Discover"];
    return credit_card_types;
}

exports.get_wireless_carriers = () => {
    const carriers = {
        "": { "name": "Select Carrier" },
        "Verizon": { "name": "Verizon" },
        "AT&T": { "name": "AT&T" },
        "Sprint": { "name": "Sprint" },
        "T-Mobile": { "name": "T-Mobile" }

    };
    return carriers;
}


exports.array_to_csv_string = (array, delim = ",", newline = "\n", enclosure = '"') => {
    let out = '';
    // Next blast through the result array and build out the rows
    if (this.isArray(array)) _.forEach(array, row => {
        if (this.isArray(row)) _.forEach(row, item => {
            out += `${enclosure}${_.replace(item, enclosure, enclosure + enclosure)}${enclosure}${delim}`;
        })
        out = _.trimEnd(out);
        out += newline;
    })

    return out;
}

/**
 * Underscore
 *
 * Takes multiple words separated by spaces and underscores them
 *
 * @access	public
 * @param	{string} str
 * @return	{string}
 */
exports.underscore = (str) => {
    return this.preg_replace( '/[\s]+/', '_',_.toLower(_.trim(str)));
}

/**

 * Helper function to get the sha1 hash of a string.  equivalent of PHP sha1
 * @param {string} str
 * @returns
 *
 * Usage example: sha1('Kevin van Zonneveld');
 * returns: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'
 */
exports.sha1 = (str="") =>{
  let hash
  try {
    const crypto = require('crypto')
    const sha1sum = crypto.createHash('sha1')
    sha1sum.update(str)
    hash = sha1sum.digest('hex')
  } catch (e) {
    hash = undefined
  }
  if (hash !== undefined) {
    return hash
  }
  const _rotLeft = function (n, s) {
    const t4 = (n << s) | (n >>> (32 - s))
    return t4
  }
  const _cvtHex = function (val) {
    let str = ''
    let i
    let v
    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f
      str += v.toString(16)
    }
    return str
  }
  let blockstart
  let i, j
  const W = new Array(80)
  let H0 = 0x67452301
  let H1 = 0xEFCDAB89
  let H2 = 0x98BADCFE
  let H3 = 0x10325476
  let H4 = 0xC3D2E1F0
  let A, B, C, D, E
  let temp
  // utf8_encode
  str = unescape(encodeURIComponent(str))
  const strLen = str.length
  const wordArray = []
  for (i = 0; i < strLen - 3; i += 4) {
    j = str.charCodeAt(i) << 24 |
      str.charCodeAt(i + 1) << 16 |
      str.charCodeAt(i + 2) << 8 |
      str.charCodeAt(i + 3)
    wordArray.push(j)
  }
  switch (strLen % 4) {
    case 0:
      i = 0x080000000
      break
    case 1:
      i = str.charCodeAt(strLen - 1) << 24 | 0x0800000
      break
    case 2:
      i = str.charCodeAt(strLen - 2) << 24 | str.charCodeAt(strLen - 1) << 16 | 0x08000
      break
    case 3:
      i = str.charCodeAt(strLen - 3) << 24 |
        str.charCodeAt(strLen - 2) << 16 |
        str.charCodeAt(strLen - 1) <<
        8 | 0x80
      break
  }
  wordArray.push(i)
  while ((wordArray.length % 16) !== 14) {
    wordArray.push(0)
  }
  wordArray.push(strLen >>> 29)
  wordArray.push((strLen << 3) & 0x0ffffffff)
  for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = wordArray[blockstart + i]
    }
    for (i = 16; i <= 79; i++) {
      W[i] = _rotLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
    }
    A = H0
    B = H1
    C = H2
    D = H3
    E = H4
    for (i = 0; i <= 19; i++) {
      temp = (_rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }
    for (i = 20; i <= 39; i++) {
      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }
    for (i = 40; i <= 59; i++) {
      temp = (_rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }
    for (i = 60; i <= 79; i++) {
      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }
    H0 = (H0 + A) & 0x0ffffffff
    H1 = (H1 + B) & 0x0ffffffff
    H2 = (H2 + C) & 0x0ffffffff
    H3 = (H3 + D) & 0x0ffffffff
    H4 = (H4 + E) & 0x0ffffffff
  }
  temp = _cvtHex(H0) + _cvtHex(H1) + _cvtHex(H2) + _cvtHex(H3) + _cvtHex(H4)
  return temp.toLowerCase()
}

/**
 * Helper function to replace a string or array of strings with another string or array os strings in a given string.  equivalent of PHP str_replace
 * @param {string} search
 * @param {string} replace
 * @param {string} subject
 * @param {string} countObj
 * @returns
 *
 * note 1: The countObj parameter (optional) if used must be passed in as an object. The count will then be written by reference into it's `value` property
 *  example 1: str_replace(' ', '.', 'Kevin van Zonneveld')
 *  returns 1: 'Kevin.van.Zonneveld'
 *  example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars')
 *  returns 2: 'hemmo, mars'
 *  example 3: str_replace(Array('S','F'),'x','ASDFASDF')
 *  returns 3: 'AxDxAxDx'
 *  example 4: var countObj = {}
 *  example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , countObj)
 *  example 4: var $result = countObj.value
 *  returns 4: 4
 *  example 5: str_replace('', '.', 'aaa')
 *  returns 5: 'aaa'
 */
exports.str_replace = (search, replace, subject, countObj={})=> {
  search=this.isString(search)?search:'';
  replace=this.isString(replace)?replace:'';
  subject=this.isString(subject)?subject:'';
  countObj=this.isObject(countObj)?countObj:{};
  let i = 0
  let j = 0
  let temp = ''
  let repl = ''
  let sl = 0
  let fl = 0
  const f = [].concat(search)
  let r = [].concat(replace)
  let s = subject
  let ra = Object.prototype.toString.call(r) === '[object Array]'
  const sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)
  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
    temp = ''
    r = [].concat(replace)
    ra = Object.prototype.toString.call(r) === '[object Array]'
  }
  if (typeof countObj !== 'undefined') {
    countObj.value = 0
  }
  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      if (f[j] === '') {
        continue
      }
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      if (typeof countObj !== 'undefined') {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }
  return sa ? s : s[0]
}

 /* Search an object for a value and return the key
 * JS Equvalent of PHP array_search
 * @param {*} needle
 * @param {*} haystack
 * @returns string | boolean
 */
exports.object_search = (needle, haystack) => {
    if(_this.isObject(haystack)) {
        for(let i in haystack) {
            if (haystack.hasOwnProperty(i)) {
                if((haystack[i] + '') === (needle + '')) return i;
            }
        }
    }
    return false;
}

exports.array_search = (needle, haystack) => {
    return _this.object_search(needle, haystack);
}

/**
 * Returns object with unique values (JS equivalent of PHP array_unique)
 * @param {*} inputArr
 * @param {*} returnObjec
 * Sample input and output
 * example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin'])
 *      returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
 * example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'})
 *      returns 2: {a: 'green', 0: 'red', 1: 'blue'}
 * @returns
 */
exports.array_unique = (inputArr, returnObjec = true) => {
    let key = ''
    const tmpArr2 = {}
    let val = '';
    for (key in inputArr) {
      if (inputArr.hasOwnProperty(key)) {
        val = inputArr[key]
        if (_this.array_search(val, tmpArr2) === false) {
          tmpArr2[key] = val
        }
      }
    }
    return tmpArr2
}

exports.randomNumberWithInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.generateRandomCodes = (amount, min_length = 10, max_length = 16, characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789") => {
    const string = [];
    for (let j = 0; j < amount; j++) {
        let first_string = '';
        const random_string_length = this.randomNumberWithInterval(min_length, max_length);
        for (let i = 0; i < random_string_length; i++) {
            first_string += characters[this.randomNumberWithInterval(0, characters.length - 1)];
        }
        string.push(first_string);
    }
    return string;
}

/**
 * Helper function to check if a needle/string/value is an element of an array/
 * equivalent to php in_array
 * Usage examples:
 *   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
 *   returns 1: true
 *   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
 *   returns 2: false
 *   example 3: in_array(1, ['1', '2', '3'])
 *   example 3: in_array(1, ['1', '2', '3'], false)
 *   returns 3: true
 *   returns 3: true
 *   example 4: in_array(1, ['1', '2', '3'], true)
 *   returns 4: false
 * @param needle
 * @param haystack
 * @param argStrict
 * @returns {boolean}
 */
exports.in_array = (needle, haystack, argStrict) =>{
  let key = ''
  const strict = !!argStrict
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true
      }
    }
  }
  return false
}


//equivalent of php file_get_contents
// reimplemented by: Kevin van Zonneveld (https://kvz.io)
//           note 1: This used to work in the browser via blocking ajax
//           note 1: requests in 1.3.2 and earlier
//           note 1: but then people started using that for real app,
//           note 1: so we deprecated this behavior,
//           note 1: so this function is now Node-only
//        example 1: var $buf = file_get_contents('test/never-change.txt')
//        example 1: var $result = $buf.indexOf('hash') !== -1
//        returns 1: true
exports.file_get_contents = (url, flags, context, offset, maxLen) => {
  const fs = require('fs')
  return fs.readFileSync(url, 'utf-8');
}



//Equivalent of php pathinfo
//      note 1: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
//      note 1: The way the bitwise arguments are handled allows for greater flexibility
//      note 1: & compatability. We might even standardize this
//      note 1: code and use a similar approach for
//      note 1: other bitwise PHP functions
//      note 1: Locutus tries very hard to stay away from a core.js
//      note 1: file with global dependencies, because we like
//      note 1: that you can just take a couple of functions and be on your way.
//      note 1: But by way we implemented this function,
//      note 1: if you want you can still declare the PATHINFO_*
//      note 1: yourself, and then you can use:
//      note 1: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
//      note 1: which makes it fully compliant with PHP syntax.
//   example 1: pathinfo('/www/htdocs/index.html', 1)
//   returns 1: '/www/htdocs'
//   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME')
//   returns 2: 'index.html'
//   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION')
//   returns 3: 'html'
//   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME')
//   returns 4: 'index'
//   example 5: pathinfo('/www/htdocs/index.html', 2 | 4)
//   returns 5: {basename: 'index.html', extension: 'html'}
//   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL')
//   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
//   example 7: pathinfo('/www/htdocs/index.html')
//   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
exports.pathinfo = (path, options) => {

  let opt = ''
  let realOpt = ''
  let optName = ''
  let optTemp = 0
  const tmpArr = {}
  let cnt = 0
  let i = 0
  let haveBasename = false
  let haveExtension = false
  let haveFilename = false
  // Input defaulting & sanitation
  if (!path) {
    return false
  }
  if (!options) {
    options = 'PATHINFO_ALL'
  }
  // Initialize binary arguments. Both the string & integer (constant) input is
  // allowed
  const OPTS = {
    PATHINFO_DIRNAME: 1,
    PATHINFO_BASENAME: 2,
    PATHINFO_EXTENSION: 4,
    PATHINFO_FILENAME: 8,
    PATHINFO_ALL: 0
  }
  // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
  for (optName in OPTS) {
    if (OPTS.hasOwnProperty(optName)) {
      OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName]
    }
  }
  if (typeof options !== 'number') {
    // Allow for a single string or an array of string flags
    options = [].concat(options)
    for (i = 0; i < options.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[options[i]]) {
        optTemp = optTemp | OPTS[options[i]]
      }
    }
    options = optTemp
  }
  // Internal Functions
  const _getExt = function (path) {
    const str = path + ''
    const dotP = str.lastIndexOf('.') + 1
    return !dotP ? false : dotP !== str.length ? str.substr(dotP) : ''
  }
  // Gather path infos
  if (options & OPTS.PATHINFO_DIRNAME) {
    const dirName = path
      .replace(/\\/g, '/')
      .replace(/\/[^/]*\/?$/, '') // dirname
    tmpArr.dirname = dirName === path ? '.' : dirName
  }
  if (options & OPTS.PATHINFO_BASENAME) {
    if (haveBasename === false) {
      haveBasename = this.basename(path)
    }
    tmpArr.basename = haveBasename
  }
  if (options & OPTS.PATHINFO_EXTENSION) {
    if (haveBasename === false) {
      haveBasename = this.basename(path)
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename)
    }
    if (haveExtension !== false) {
      tmpArr.extension = haveExtension
    }
  }
  if (options & OPTS.PATHINFO_FILENAME) {
    if (haveBasename === false) {
      haveBasename = this.basename(path)
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename)
    }
    if (haveFilename === false) {
      haveFilename = haveBasename.slice(0, haveBasename.length - (haveExtension
          ? haveExtension.length + 1
          : haveExtension === false
            ? 0
            : 1
      )
      )
    }
    tmpArr.filename = haveFilename
  }
  // If array contains only 1 element: return string
  cnt = 0
  for (opt in tmpArr) {
    if (tmpArr.hasOwnProperty(opt)) {
      cnt++
      realOpt = opt
    }
  }
  if (cnt === 1) {
    return tmpArr[realOpt]
  }
  // Return full-blown array
  return tmpArr
}

/**
 * Cloned Helper function to trim str
 * @param {string} str - Represents the data to run check on.
 * @returns {string} - Returns the trimmed str.
 */
exports.trim = (str = "") => {
  return this.isString(str) ? str.trim() : str;
}

/**
 * Cloned Helper function to trim str
 * @param {string} str - Represents the data to run check on.
 * @returns {string} - Returns the trimmed str.
 */
exports.strtolower = (str = "") => {
  return this.isString(str) ? str.toLowerCase() : str;
}

/**
 * Cloned Helper function to trim str
 * @param {string} str - Represents the data to run check on.
 * @returns {string} - Returns the trimmed str.
 */
exports.strtoupper = (str = "") => {
  return this.isString(str) ? str.toUpperCase() : str;
}


//  function to count number of string characters
//   example 1: strlen('Kevin van Zonneveld')
//   returns 1: 19
exports.strlen = (string) => {
  const str = string + ''
  return str.length

}

//  js version of php implode
// original by: Kevin van Zonneveld (https://kvz.io)
// improved by: Waldo Malqui Silva (https://waldo.malqui.info)
// improved by: Itsacon (https://www.itsacon.net/)
// bugfixed by: Brett Zamir (https://brett-zamir.me)
//   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
//   returns 1: 'Kevin van Zonneveld'
//   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
//   returns 2: 'Kevin van Zonneveld'
exports.implode = (glue, pieces) => {

  let i = ''
  let retVal = ''
  let tGlue = ''
  if (arguments.length === 1) {
    pieces = glue
    glue = ''
  }
  if (typeof pieces === 'object') {
    if (Object.prototype.toString.call(pieces) === '[object Array]') {
      return pieces.join(glue)
    }
    for (i in pieces) {
      retVal += tGlue + pieces[i]
      tGlue = glue
    }
    return retVal
  }
  return pieces
}

// js version of php str_split
//  discuss at: https://locutus.io/php/str_split/
// original by: Martijn Wieringa
// improved by: Brett Zamir (https://brett-zamir.me)
// bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
//  revised by: Theriault (https://github.com/Theriault)
//  revised by: Rafał Kukawski (https://blog.kukawski.pl)
//    input by: Bjorn Roesbeke (https://www.bjornroesbeke.be/)
//   example 1: str_split('Hello Friend', 3)
//   returns 1: ['Hel', 'lo ', 'Fri', 'end']
exports.str_split = (string, splitLength) => {
  if (splitLength === null) {
    splitLength = 1
  }
  if (string === null || splitLength < 1) {
    return false
  }
  string += ''
  const chunks = []
  let pos = 0
  const len = string.length
  while (pos < len) {
    chunks.push(string.slice(pos, pos += splitLength))
  }
  return chunks
}

//  js version of php substr
// original by: Martijn Wieringa
// bugfixed by: T.Wild
// improved by: Onno Marsman (https://twitter.com/onnomarsman)
// improved by: Brett Zamir (https://brett-zamir.me)
//  revised by: Theriault (https://github.com/Theriault)
//  revised by: Rafał Kukawski
//      note 1: Handles rare Unicode characters if 'unicode.semantics' ini (PHP6) is set to 'on'
//   example 1: substr('abcdef', 0, -1)
//   returns 1: 'abcde'
//   example 2: substr(2, 0, -6)
//   returns 2: false
//   example 3: ini_set('unicode.semantics', 'on')
//   example 3: substr('a\uD801\uDC00', 0, -1)
//   returns 3: 'a'
//   example 4: ini_set('unicode.semantics', 'on')
//   example 4: substr('a\uD801\uDC00', 0, 2)
//   returns 4: 'a\uD801\uDC00'
//   example 5: ini_set('unicode.semantics', 'on')
//   example 5: substr('a\uD801\uDC00', -1, 1)
//   returns 5: '\uD801\uDC00'
//   example 6: ini_set('unicode.semantics', 'on')
//   example 6: substr('a\uD801\uDC00z\uD801\uDC00', -3, 2)
//   returns 6: '\uD801\uDC00z'
//   example 7: ini_set('unicode.semantics', 'on')
//   example 7: substr('a\uD801\uDC00z\uD801\uDC00', -3, -1)
//   returns 7: '\uD801\uDC00z'
//        test: skip-3 skip-4 skip-5 skip-6 skip-7
exports.substr = (input, start, len) => {

  const _php_cast_string = require('../lib/php_js/_phpCastString') // eslint-disable-line camelcase
  input = _php_cast_string(input)
  const multibyte = false;
  if (multibyte) {
    input = input.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/gu) || []
  }
  const inputLength = input.length
  let end = inputLength
  if (start < 0) {
    start += end
  }
  if (typeof len !== 'undefined') {
    if (len < 0) {
      end = len + end
    } else {
      end = len + start
    }
  }
  if (start > inputLength || start < 0 || start > end) {
    return false
  }
  if (multibyte) {
    return input.slice(start, end).join('')
  }
  return input.slice(start, end)
}

//js version of php explode
// original by: Kevin van Zonneveld (https://kvz.io)
//   example 1: explode(' ', 'Kevin van Zonneveld')
//   returns 1: [ 'Kevin', 'van', 'Zonneveld' ]
exports.explode = (delimiter, string, limit) => {
  const _explode = require('../lib/php_js/explode');
  return _explode(delimiter, string, limit);
}

// js version of php str_pad
//  discuss at: https://locutus.io/php/str_pad/
// original by: Kevin van Zonneveld (https://kvz.io)
// improved by: Michael White (https://getsprink.com)
//    input by: Marco van Oort
// bugfixed by: Brett Zamir (https://brett-zamir.me)
//   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT')
//   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
//   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH')
//   returns 2: '------Kevin van Zonneveld-----'
exports.str_pad = (input, padLength, padString, padType) => {
  const _str_pad = require('../lib/php_js/str_pad');
  return _str_pad(input, padLength, padString, padType);
}

// js version of php array_values
//  discuss at: https://locutus.io/php/array_values/
// original by: Kevin van Zonneveld (https://kvz.io)
// improved by: Brett Zamir (https://brett-zamir.me)
//   example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} )
//   returns 1: [ 'Kevin', 'van Zonneveld' ]
exports.array_values = (input) => {
  const tmpArr = []
  let key = ''
  if(this.isArray(input)) {
    for (key in input) {
      tmpArr[tmpArr.length] = input[key]
    }
  }
  return tmpArr
}





