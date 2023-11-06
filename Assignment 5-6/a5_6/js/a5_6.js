/* Authors: David Barrios c0893262, Paul Jordan c0899319, Can Tarhan c0895400, Alexander Gutierrez c0895239
   Date: 05 - November - 2023 */

// We have accessed the property offence in the JSON, containing an array with all the offences and its data
const OffenceValidations = [];
let offence;
let randomSpeedOver = Math.floor((Math.random() * 71) + 1);
const getOffence = function (json) {
    const offences = JSON.parse(json); // JSON.parse has been used to convert the string into an JavaScript Object.
    randomIndex = Math.floor(Math.random() * offences.offences.length); // an index in the array is selected randomly.
    offence = offences.offences[randomIndex];
    return offence.item + ": " + offence.offence + " " + offence.section + ".";
};

/* Generates the heading of the webpage by surrounding each letter with <span></span>, and Prints the heading of the web page one letter at a time with an interval of 25milliseconds */
const generateHeadingMsg = function () {
    const HEADING = `Hello, this is Computer Programmer Group 1 Ontario Provincial Police, we have pulled you over because
you were exceeding the speed limit over ${randomSpeedOver} Km/h.`;
    let HTMLheading = "";
    for (let i = 0; i < HEADING.length; i++) {
        HTMLheading += "<span>" + HEADING.charAt(i) + "</span>";
    }
    $('#offence_desc').html(HTMLheading);

    $('#offence_desc span').each(function (index) {
        let that = this;
        setTimeout(function () {
            $(that).css('display', 'inline');
        }, 25 * index);
    });
};

/* generates a random boolean, used in the validation of the offences */
const isValid = function () {
    return Math.random() >= 0.5;
}

/* validates the textBoxes used in the webpage Driver's name and Driver's License */
const validateInput = function () {
    let isInputValid = true;
    if ($('#driver_name').val() == "") {
        $('.driver_name_error').html('This field is required');
        $("#driver_name").focus();
        isInputValid = false;
    } else {
        $('.driver_name_error').html('');
    }

    if (licenseNumber.length < 21) {
        $('.driver_license_error').html('Must be 15 digits long');
        isInputValid = false;

        if (licenseNumber.length == 0) {
            $('.driver_license_error').html('This field is required');
            isInputValid = false;
        }
    } else {
        $('.driver_license_error').html('');
    }
    return isInputValid;
};

/* animate the validation fo the offences */
const animateValidation = function () {
    if (validateInput()) {
        $('#btn_validate').attr('disabled', 'true');
        $('#driver_name').attr('disabled', 'true');
        $('#driver_license').attr('disabled', 'true');

        $('#info_validity > div').each(function (index) {
            let validity = isValid();
            let background = validity ? "#7BB810" : "#FF7F50";
            let image = validity ? "../img/check_mark.png" : "../img/check_mark_fail.png";
            OffenceValidations[index] = validity;
            let that = this;

            $(that).find('img').attr('src', image);
            setTimeout(function () {
                $(that).find('p').css('display', 'block');
                $(that).animate({ 'background-color': background, 'width': '100%' }, 1000);
                $(that).find('img').animate({ 'width': '20px', 'height': '20px' }, 1000);
            }, 1400 * index)
        });

        setTimeout(function () {
            printTicket();
        }, 6000);
    }
};

/* prints a ticket, with all the data gathered from the user and randomly gathered form the JSON */
function printTicket() {
    let offenceStr = getOffence(json_str);
    const date = new Date(Date.now());
    const fine = isNaN(offence.fine) ? 0 : parseFloat(offence.fine);
    const driverLicenseFine = OffenceValidations[0] ? 0 : 85;
    const driverPermitFine = OffenceValidations[1] ? 0 : 200;
    const driverInsuranceFine = OffenceValidations[2] ? 0 : 85;
    const seatBeltFine = OffenceValidations[3] ? 0 : 200;
    let overSpeedLimitFine;
    let overSpeedLimitFineRate;
    if (randomSpeedOver <= 19) {
        overSpeedLimitFineRate = 2.5;
    } else if (randomSpeedOver <= 29) {
        overSpeedLimitFineRate = 3.75;
    } else if (randomSpeedOver <= 49) {
        overSpeedLimitFineRate = 6.00;
    }

    overSpeedLimitFine = overSpeedLimitFineRate ? randomSpeedOver * overSpeedLimitFineRate : 0;

    $("#outputWrapper").html(`<p>After further investigation we have noticed that you violates the law number ${offenceStr}</p>
<h2>Ticket Summary</h2>
<pre>Date: ${date.toDateString()}
Name: ${$("#driver_name").val()} 
Ticket No: ${Math.round((Math.random() * 9999999) + 1000000)}
License No: ${$("#driver_license").val()}
Speeding Fine: ${overSpeedLimitFine != 0 ? `$ ${overSpeedLimitFine.toFixed(2)}` : 'No out of court settlement'}
Found Offense: ${offence.offence}
Section: ${offence.section}
Fine: ${fine != 0 ? `$ ${fine.toFixed(2)}` : 'N/A'}
Other Fines:</pre>
<ul>
<li>Driver License Not Valid: $ ${driverLicenseFine.toFixed(2)}</li>
<li>Driver Permit Not Valid: $ ${driverPermitFine.toFixed(2)}</li>
<li>Driver Insurance Not Valid: $ ${driverInsuranceFine.toFixed(2)}</li>
<li>Seat Belt Unfastened: $ ${seatBeltFine}</li>
</ul>
<pre>
Court appearance: ${offence.fine == "N.S.F." || overSpeedLimitFine == 0 ? "Yes" : "No"}
Total Fine: $ ${(overSpeedLimitFine + fine + driverLicenseFine + driverPermitFine + driverInsuranceFine + seatBeltFine).toFixed(2)}.
</pre>`);
    $('.output').slideDown(function () { window.location = "#outputWrapper"; });
};

/* used in the Driver's License textBox to format the user input as '_____ - _____ - _____' in real time, and show it in the textBox
   it is the event handler of an input event. */
let licenseNumber = "";
function formatLicenseNumber(event) {
    const SEPARATOR = ' - ';
    const PLACE_HOLDER = '_____' + SEPARATOR + '_____' + SEPARATOR + '_____';
    
    if (licenseNumber.length < PLACE_HOLDER.length || !event.data) {
        if (licenseNumber.length == $("#driver_license").val().indexOf(SEPARATOR, licenseNumber.length)) {
            licenseNumber += SEPARATOR;
        }
        if (event.data) {
            licenseNumber += event.data;
        } else {
            if (licenseNumber.length == $("#driver_license").val().lastIndexOf(SEPARATOR, licenseNumber.length) + SEPARATOR.length) {
                licenseNumber = licenseNumber.substring(0, licenseNumber.length - (SEPARATOR.length + 1));
            } else {
                licenseNumber = licenseNumber.substring(0, licenseNumber.length - 1);
            }
        }
        $("#driver_license").val((licenseNumber.length == 0 ? "" : licenseNumber + PLACE_HOLDER.substring(licenseNumber.length)).toUpperCase());
    } else {
        $("#driver_license").val(licenseNumber.toUpperCase());
    }
    // hide or show the text input cursor of the driver license TextBox.
    $("#driver_license").css(licenseNumber.length != 0 ? {'caret-color' : 'transparent'} : {'caret-color' : 'black'});
};

/* reload the webpage to process a new ticket */
const newOffence = function () {
    location.reload();
};

$(function () {
    generateHeadingMsg();
    $('#btn_validate').on('click', animateValidation);
    $('#new_offence').on('click', newOffence);
    $("#driver_name").focus();
});

