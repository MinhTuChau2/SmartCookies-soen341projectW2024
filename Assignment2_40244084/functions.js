function addNumbers(numbers) {
    var sum = 0;
    for (var i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    document.getElementById('sum').innerHTML = sum;
}

function findMaxNumber() {
    var max = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] > max) {
            max = arguments[i];
        }
    }
    document.getElementById('max').innerHTML = max;
}

function addOnlyNumbers(mixedArray) {
    var sum = 0;
    for (var i = 0; i < mixedArray.length; i++) {
        var number = parseFloat(mixedArray[i]) || 0;
        sum += number;
    }
    document.getElementById('addOnlyNumbers').innerHTML = sum;
}

function getDigits(str) {
    var digits = '';
    for (var i = 0; i < str.length; i++) {
        if (str[i] >= '0' && str[i] <= '9') {
            digits += str[i];
        }
    }
    document.getElementById('getDigits').innerHTML = digits;
}

function reverseString(str) {
    var reversed = '';
    for (var i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    document.getElementById('reverseString').innerHTML = reversed;
}

function getCurrentDate() {
    var date = new Date();
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    document.getElementById('getCurrentDate').innerHTML = date.toLocaleDateString('en-US', options);
}


addNumbers([10, 20, 30]);
findMaxNumber(10, 5, 55, 2);
addOnlyNumbers([4, 5, "3.0 birds", true, "birds2"]);
getDigits("Phone123Call456");
reverseString("See you later!");
getCurrentDate();
