//TESTING
//Javascript
//Finesse Automatic Sign In Form

//Log-in information to be used when logging in and logging in remote
var ID = ''; //Phone ID number
var extensionNumber = ''; // Phone Extension Number
var dialNumber = ''; // Phone Dial Number

//PUTS MY CUSTOM BUTTONS ONTO THE PAGE
function loadButtons() {
    var ready = '<button onclick="clickButton(\'ready\')" class="myCustomButtons">Ready</button>';
    var bathroom = '<button onclick="clickButton(\'away\')" class="myCustomButtons">Bathroom</button>';
    var break10 = '<button onclick="clickButton(\'break\')" class="myCustomButtons">Break</button>';
    var chat = '<button onclick="clickButton(\'chat\')" class="myCustomButtons">Chat</button>';
    var meeting = '<button onclick="clickButton(\'meeting\')" class="myCustomButtons">Meeting</button>';
    var technical = '<button onclick="clickButton(\'awayTechnical\')" class="myCustomButtons">Technical</button>';
    var inday = '<button onclick="clickButton(\'inDay\')" class="myCustomButtons">InDay</button>';
    var lunch = '<button onclick="clickButton(\'lunch\')" class="myCustomButtons">Lunch</button>';
    var team_meeting = '<button onclick="clickButton(\'teamMeeting\')" class="myCustomButtons">Team Meeting</button>';
    var training = '<button onclick="clickButton(\'training\')" class="myCustomButtons">Training</button>';
    var logout = '<button onclick="clickButton(\'loggingOut\')" class="myCustomButtons">Log out</button>';
    var email = '<button onclick="clickButton(\'email\'))" class="myCustomButtons">Email</button>';
    var after_call_work = '<button onclick="clickButton(\'afterCallWork\')" class="myCustomButtons">After Call Work</button>';

    $('#finesse-container').prepend('<div id="myButtons">' + ready + after_call_work + bathroom + break10 + technical + chat + lunch + team_meeting + training + inday + meeting + email + logout + '</div>');
}

// CALLS FUNCTION TO LOAD THE BUTTONS WHICH WILL CREATE DESIRED FORM
function loadForm() {
    document.getElementById('app-signin').innerHTML = '<button class="finesseCustomButtons" onclick="signIn()">Sign In</button><br><button class="finesseCustomButtons" onclick="signInMobile()">Sign In As Mobile Agent</button>';
}

// LOADS ACTION BUTTONS <3
$(document).ready(function () {

    if (document.getElementById('user-info-text') != null) { //IF I'M SIGNED IN THEN THIS WILL NOT RETURN NULL 
        loadButtons();
    } else {
        loadForm();
    }

});

// CREATES A FORM AND AUTHENTICATES NORMALLY
function signIn() {
    var f = document.createElement("form");

    f.setAttribute('method', "POST");
    f.setAttribute('action', "j_security_check?locale=en_us");
    f.setAttribute('name', "login_user");


    var input_username = document.createElement("input");

    input_username.setAttribute('name', "j_username");
    input_username.setAttribute('value', ID);

    var input_password = document.createElement("input");

    input_password.setAttribute('name', "j_password");
    input_password.setAttribute('value', "13579");

    var input_extension = document.createElement("input");

    input_extension.setAttribute('name', "extension_login_user");
    input_extension.setAttribute('value', ID);

    var input_is_mobile = document.createElement("input");

    input_is_mobile.setAttribute('name', "mobile_agent_checkbox");
    input_is_mobile.checked = false;


    f.appendChild(input_username);
    f.appendChild(input_password);
    f.appendChild(input_extension);
    f.appendChild(input_is_mobile);

    document.getElementsByTagName('body')[0].appendChild(f);

    f.submit();

    setInterval(function () {
        window.location.reload();
    }, 5000);

}

// CREATES A FORM AND AUTHENTICATES AS MOBILE USER
function signInMobile() {
    var f = document.createElement("form");

    f.setAttribute('method', "POST");
    f.setAttribute('action', "j_security_check?locale=en_us");
    f.setAttribute('name', "login_user");


    var input_username = document.createElement("input");

    input_username.setAttribute('name', "j_username");
    input_username.setAttribute('value', ID);

    var input_password = document.createElement("input");

    input_password.setAttribute('name', "j_password");
    input_password.setAttribute('value', "13579");

    var input_extension = document.createElement("input");

    input_extension.setAttribute('name', "extension_login_user");
    input_extension.setAttribute('value', extensionNumber);

    var input_is_mobile = document.createElement("input");

    input_is_mobile.setAttribute('name', "mobile_agent_checkbox");
    input_is_mobile.checked = true;

    var input_call_by_call = document.createElement("input");

    input_call_by_call.setAttribute('name', "mobile_agent_mode");
    input_call_by_call.setAttribute('value', "CALL_BY_CALL");

    var input_dial_number = document.createElement("input");

    input_dial_number.setAttribute('name', "mobile_agent_dialnumber");
    input_dial_number.setAttribute('value', dialNumber);

    f.appendChild(input_username);
    f.appendChild(input_password);
    f.appendChild(input_extension);
    f.appendChild(input_is_mobile);
    f.appendChild(input_call_by_call);
    f.appendChild(input_dial_number);

    document.getElementsByTagName('body')[0].appendChild(f);

    f.submit();
}

// BUTTON FUNCTIONALITY
$('.myCustomButtons').click(function () {
    $('.activeButton').removeClass("activeButton");
    $(this).addClass("activeButton");
    //Shows active status in tab
    $('title').html('Finesse - ' + $(this).html())
})

// Creates Dictionary of buttons and their commands
function clickButton(index) {
    var buttons = {
        "ready": "#link-READY",
        "afterCallWork": "#link-NOT_READY19",
        "away": "#link-NOT_READY7",
        "break": "#link-NOT_READY8",
        "comfortBreak": "#link-NOT_READY9",
        "awayTechnical": "#link-NOT_READY10",
        "bugs": "#link-NOT_READY18",
        "email": "#link-NOT_READY14",
        "inDay": "#link-NOT_READY17",
        "loggingOut": "#link-NOT_READY20",
        "lunch": "#link-NOT_READY2",
        "meeting": "#link-NOT_READY12",
        "specialProjects": "#link-NOT_READY16",
        "teamMeeting": "#link-NOT_READY13",
        "training": "#link-NOT_READY11",
        "chat": "#link-NOT_READY15"
    };
    $(buttons[index]).click()
    if (index == "loggingOut") {
        setTimeout(function () {
            $('#link-signout6').click();
        }, 2000);
    }
}
