/* Authors: David Barrios c0893262, Paul Jordan c0899319, Can Tarhan c0895400, Alexander Gutierrez c0895239
   Date: 05 - November - 2023 */

// We have accessed the property offence in the JSON, containing an array with all the offences and its data
const OffenceValidations = [];
let offence;
const getOffence = function (json) {
    const offences = JSON.parse(json); // JSON.parse has been used to convert the string into an JavaScript Object.
    randomIndex = Math.floor(Math.random() * offences.offences.length); // an index in the array is selected randomly.
    offence = offences.offences[randomIndex];
    return offence.item + " " + offence.offence + " " + offence.section + ".";
};

/* Generates the heading of the webpage by surrounding each letter with <span></span>, and Prints the heading of the web page one letter at a time with an interval of 25milliseconds */
const generateHeadingMsg = function () {
    const heading = 'Hello, this is Computer Programmer Group 1 Ontario Provincial Police, we have pulled you over because you violates the law number ' + getOffence(json_str);
    let HTMLheading = "";
    for (let i = 0; i < heading.length; i++) {
        HTMLheading += "<span>" + heading.charAt(i) + "</span>";
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
        isInputValid = false;
    } else {
        $('.driver_name_error').html('');
    }

    if (lnumber.length < 17) {
        $('.driver_license_error').html('Must be 15 digits long');
        isInputValid = false;

        if (lnumber.length == 0) {
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
    const date = new Date(Date.now());
    const fine = isNaN(offence.fine) ? 0 : parseFloat(offence.fine);
    const driverLicenseFine = OffenceValidations[0] ? 0 : 85;
    const driverPermitFine = OffenceValidations[1] ? 0 : 100;
    const driverInsuranceFine = OffenceValidations[2] ? 0 : 50;
    const seatBeltFine = OffenceValidations[3] ? 0 : 200;

    $("#outputWrapper").html(`<h2>Ticket Summary</h2><pre>Date: ${date.toDateString()}
Name: ${$("#driver_name").val()} 
Ticket No: ${Math.round((Math.random() * 9999999) + 1000000)}
License No: ${$("#driver_license").val()}
Offense: ${offence.offence}
Section: ${offence.section}
Fine: $ ${fine.toFixed(2)}
Other Fines:</pre>
<ul>
<li>Driver License Not Valid: $ ${driverLicenseFine.toFixed(2)}</li>
<li>Driver Permit Not Valid: $ ${driverPermitFine.toFixed(2)}</li>
<li>Driver Insurance Not Valid: $ ${driverInsuranceFine.toFixed(2)}</li>
<li>Seat Belt Unfastened: $ ${seatBeltFine}</li>
</ul>
<pre>
Court appearance: ${offence.fine == "N.S.F." ? "Yes" : "No"}
Total Fine: $ ${(fine + driverLicenseFine + driverPermitFine + driverInsuranceFine + seatBeltFine).toFixed(2)}.
</pre>`);
    $('.output').slideDown(function () { window.location = "#outputWrapper"; });
};

/* used in the Driver's License textBox to format the user input as '_____ - _____ - _____' in real time, and show it in the textBox
   it is the event handler of an input event. */
let lnumber = "";
function formatLicenseNumber(event) {
    console.log('qweqwe');
    const placeHolder = "_____ - _____ - _____";
    if (lnumber.length <= 20 || !event.data) {
        if (lnumber.length == 5 || lnumber.length == 13) {
            lnumber += " - ";
        }
        if (event.data) {
            lnumber += event.data;
        } else {
            if (lnumber.length == 8 || lnumber.length == 16) {
                lnumber = lnumber.substring(0, lnumber.length - 4);
            } else {
                try {
                    lnumber = lnumber.substring(0, lnumber.length - 1);
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
        $("#driver_license").val((lnumber.length == 0 ? "" : lnumber + placeHolder.substring(lnumber.length)).toUpperCase());
    } else {
        $("#driver_license").val(lnumber.toUpperCase());
    }
};

/* reload the webpage to process a new ticket */
const newOffence = function () {
    location.reload();
};

$(function () {
    generateHeadingMsg();
    $('#btn_validate').on('click', animateValidation);
    $('#new_offence').on('click', newOffence);
});

