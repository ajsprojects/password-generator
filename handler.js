'use strict';

var express = require("express");
var app = express();
const bodyParser = require('body-parser'); app.use(bodyParser.json());
var generator = require('generate-password');

module.exports.generate = (event, context, callback) => {

    const body = event.body ? JSON.parse(event.body) : event;
    if (body !== null && body !== undefined) {
        try {
            console.log(body);
            var length = (body.length);
            console.log("length " + length);
            var uppercase = (body.uppercase);
            console.log("uppercase " + uppercase);
            var special_characters = (body.special_characters);
            console.log("special characters " + special_characters);
            var easy_remember = (body.easy_remember);
            console.log("easy remember " + easy_remember);
            var numbers = (body.numbers);
            console.log("numbers " + numbers);
        } catch (e) { console.log(e); }
    }
    else {
        var myErrorObj = {
            errorType: "BadRequest",
            statusCode: 400,
        }
        callback(JSON.stringify(myErrorObj));
    }

    setImmediate(() => {

        var password = generatePassword(length, uppercase, special_characters, easy_remember, numbers);
        var strength = calculateStrength(length, uppercase, special_characters, easy_remember, numbers).toString();

        let responseBody = {
            password: password,
            strength: strength
        };
        console.log("Building JSON response");
        console.log(responseBody);

        callback(null, {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": { "Content-Type": "application/json" },
            "multiValueHeaders": null,
            "body": JSON.stringify(responseBody)
        });
    })
};

function calculateStrength(length, uppercase, special_characters, easy_remember, numbers) {
    var strength = parseInt(length);
    if (uppercase) {
        strength += 4;
    }
    if (special_characters) {
        strength += 5;
    }
    if (numbers) {
        strength += 4;
    }
    if (easy_remember) {
        strength -= 4;
    }
    console.log("Calculate strength: " + strength);
    return strength;
}

function generatePassword(length, uppercase, special_characters, easy_remember, numbers) {
    console.log("Generating password");
    var pass = '';

    if (!easy_remember) {

        pass = generator.generate({
            length: length,
            symbols: special_characters,
            uppercase: uppercase,
            numbers: numbers,
            excludeSimilarCharacters: easy_remember,
            strict: true
        });
    }

    if (easy_remember) { //Limits special characters and numbers and places them at the end of the string

        var specialcharsStringSimple = '!@#/?';
        var numberString = '1234567890';
        var random = getRandomInt(2, ((length / 3) + 1));
        console.log("Random: " + random);
        var customlength = length - random;
        console.log("customlength: " + customlength);
        pass = generator.generate({
            length: customlength,
            symbols: false,
            uppercase: uppercase,
            numbers: false,
            excludeSimilarCharacters: easy_remember,
            strict: true
        });
        console.log("password before adding extras: " + pass)

        if (numbers) {
            for (var i = 0; i < random - 1; i++) {
                if (numbers) {
                    console.log("adding number to end of string");
                    pass += numberString.charAt(Math.floor(Math.random() * numberString.length));
                }
            }
        }

        if (special_characters) {
            console.log("adding special character to end of string");
            pass += specialcharsStringSimple.charAt(Math.floor(Math.random() * specialcharsStringSimple.length));
        }

    }
    console.log("Password: " + pass + " | Length: " + pass.length);
    return pass;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}