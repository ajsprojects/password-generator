var express = require("express");
var app = express();
const bodyParser = require('body-parser'); app.use(bodyParser.json());
var generator = require('generate-password');


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Listening on: ` + port)
});

app.post("/generatepassword", (req, res, next) => {
    console.log(req.body);

    var length = req.body.length;
    console.log("length " + length);
    var uppercase = JSON.parse(req.body.uppercase);
    console.log("uppercase " + uppercase);
    var special_characters = JSON.parse(req.body.special_characters);
    console.log("special characters " + special_characters);
    var easy_remember = JSON.parse(req.body.easy_remember);
    console.log("easy remember " + easy_remember);
    var numbers = JSON.parse(req.body.numbers);
    console.log("numbers " + numbers);

    var password = generatePassword(length, uppercase, special_characters, easy_remember, numbers);
    var strength = calculateStrength(length, uppercase, special_characters, easy_remember, numbers);
    console.log(password);

    res.json({ password, "strength": strength });
});

function calculateStrength(length, uppercase, special_characters, easy_remember, numbers) {
    var strength = parseInt(length);
    console.log(strength);
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
    return strength;
}

function generatePassword(length, uppercase, special_characters, easy_remember, numbers) {
    console.log("Generating password");
    var password = '';

    if (!easy_remember) {

        password = generator.generate({
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
        password = generator.generate({
            length: customlength,
            symbols: false,
            uppercase: uppercase,
            numbers: false,
            excludeSimilarCharacters: easy_remember,
            strict: true
        });
        console.log("password before adding extras: " + password)

        for (var i = 0; i < random - 1; i++) {
            if (numbers) {
                console.log("adding number to end of string");
                password += numberString.charAt(Math.floor(Math.random() * numberString.length));
            }
        }

        if (special_characters) {
            console.log("adding special character to end of string");
            password += specialcharsStringSimple.charAt(Math.floor(Math.random() * specialcharsStringSimple.length));
        }

    }
    console.log("pass length: " + password.length);
    return password;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}