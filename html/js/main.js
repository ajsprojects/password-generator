function generatePassword() {

	var length = document.getElementById("slider").value;
	console.log(length)

	const url = 'https://qupapl2w9k.execute-api.us-east-1.amazonaws.com/dev/password';
	const data = {
		"length": length,
		"uppercase": $('#switch-uppercase').is(":checked"),
		"special_characters": $('#switch-special-chars').is(":checked"),
		"easy_remember": $('#switch-easy-remember').is(":checked"),
		"numbers": $('#switch-numbers').is(":checked")

	};

	console.log(data)
	jQuery.ajax({
		url: url,
		type: "POST",
		data: JSON.stringify(data),
		dataType: "json",
		success: function (result) {
			console.log(result);
			document.getElementById('passField').value = result.password;
			var strength = result.strength * 4;
			$('#strength-bar').width(strength + "%").attr('aria-valuenow', strength);
			$('#strength-bar').attr('data-amount', strength);
			$('#strength-bar').css('background-color', getColour(strength));
			$('#strength-bar').html('&nbsp; Password Strength: ' + getText(strength));
		}
	});
}

function getColour(strength) {
	console.log("Strength: " + strength);
	if (strength <= 35) {
		return '#d66036';
	}
	if (strength >= 36 && strength <= 55) {
		return '#f0b83e';
	}
	if (strength >= 56) {
		return '#6fa86a';
	}
}

function getText(strength) {
	if (strength <= 35) {
		return 'Weak';
	}
	if (strength >= 36 && strength <= 55) {
		return 'Medium';
	}
	if (strength >= 56 && strength <= 80) {
		return 'Strong';
	}
	if (strength >= 81) {
		return 'Very Strong';
	}
}

// Slider operations
const sliderGroup = document.getElementById('slider-group');
const slider = document.getElementById('slider');
const sliderValueText = document.getElementById('slider-value');

slider.oninput = function () {
	sliderValueText.innerHTML = this.value;
};

// Switch operations
const switchNumbers = document.getElementById('switch-numbers');
const switchUppercase = document.getElementById('switch-uppercase');
const switchEasyRemember = document.getElementById('switch-easy-remember');
const switchSpecialChars = document.getElementById('switch-special-chars');

switchNumbers.onchange = function () {
	console.log('Numbers: ', this.checked);
}

switchUppercase.onchange = function () {
	console.log('Uppercase: ', this.checked);
}

switchEasyRemember.onchange = function () {
	console.log('Easy remember: ', this.checked);
	checkParameters();
}

switchSpecialChars.onchange = function () {
	console.log('Special characters: ', this.checked);
}

function checkParameters() {
	if (switchEasyRemember.checked) {
		switchNumbers.checked = true;
		switchSpecialChars.checked = true;
	}
}