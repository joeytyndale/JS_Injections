//TESTING
//Javascript
//Finesse Automatic Sign In Form
//Log-in information to be used when logging in and logging in remote

//Notification Stuff
function spawnNotification(mutationList, observer) {

	console.log("We have infiltrated the function");

	if(!callNotificationLimiter){
		let notified = false;
	    callNotificationLimiter = true

		mutationList.forEach((mutation) => {
			if (notified === false){
				if(mutation.addedNodes[0] !== undefined){
					console.log(mutation.addedNodes[0].data)
					if(mutation.addedNodes[0].data == 'Reserved' || mutation.addedNodes[0].data == 'Ready'){
						notified = true;
						
                        console.log("Notified set to true")

                        var callVariable = "";
                        
                        if($('.call-var-value-text').length > 1){
							console.log($('.call-var-value-text'));
                            callVariable = $('.call-var-value-text')[6].innerHTML;
                        }else{
                            callVariable = "none";
                        }

						$.ajax({
							url: 'http://localhost:81?state=' + mutation.addedNodes[0].data + '&callVariable=' + callVariable,
							dataType: "json",
							crossDomain:true,
							method: 'GET'
						});
					}
				}	
			}
		});	
	}

	notiReset()

}

var stateText = document.querySelector("#state-text");
var observerOptions = {
	childList: true,
	attributes: true,
	subtree: true
}




/// MOST NOTIFICATION STUFF SHOULD REALLY GO ABOVE HERE

//if(window.location.protocol == "http:"){
//    window.location.replace('https' + window.location.href.substring(4))
//}

var callNotificationLimiter = false; // Ensures that we don't spam notifications when the btn state changes. Cause for some reason Finesse just changes it all willey nilley
let notiReset = () => {
    let callNotificationLimiterReset = setTimeout(()=>{
        callNotificationLimiter = false;
    },5000);
};



//////



var ID = '01003951029'; //Phone ID number
var extensionNumber = '01009800009'; // Phone Extension Number
var dialNumber = '918057936853'; // Phone Dial Number
//PUTS MY CUSTOM BUTTONS ONTO THE PAGE
function loadButtons() {
    var ready = '<button onclick="clickButton(\'ready\')" class="myCustomButtons">Ready</button>';
    var bathroom = '<button onclick="clickButton(\'away\')" class="myCustomButtons">Take a piss</button>';
    var break10 = '<button onclick="clickButton(\'break\')" class="myCustomButtons">Break</button>';
    var chat = '<button onclick="clickButton(\'chat\')" class="myCustomButtons">Chat</button>';
    var meeting = '<button onclick="clickButton(\'meeting\')" class="myCustomButtons">Meeting</button>';
    var technical = '<button onclick="clickButton(\'awayTechnical\')" class="myCustomButtons">Sometin Broken</button>';
    var inday = '<button onclick="clickButton(\'inDay\')" class="myCustomButtons">InDay</button>';
    var lunch = '<button onclick="clickButton(\'lunch\')" class="myCustomButtons">NomNom</button>';
    var team_meeting = '<button onclick="clickButton(\'teamMeeting\')" class="myCustomButtons">Team Meeting</button>';
    var training = '<button onclick="clickButton(\'training\')" class="myCustomButtons">Teach Me</button>';
    var logout = '<button onclick="clickButton(\'loggingOut\')" class="myCustomButtons">Go Away</button>';
    var email = '<button onclick="clickButton(\'email\'))" class="myCustomButtons">Email</button>';
    var after_call_work = '<button onclick="clickButton(\'afterCallWork\')" class="myCustomButtons">After Call Work</button>';
    $('#finesse-container').prepend('<div id="myButtons">' + ready + after_call_work + bathroom + break10 + technical + chat + lunch + team_meeting + training + inday + meeting + email + logout + '</div>');
}
// CALLS FUNCTION TO LOAD THE BUTTONS WHICH WILL CREATE DESIRED FORM
function loadForm() {
    $('#app-signin').prepend('<button class="finesseCustomButtons" onclick="signIn(false)">Sign In</button><br><button class="finesseCustomButtons" onclick="signIn(true)">Sign In As Mobile Agent</button>');
    $('#logonForm').toggle();
}
// LOADS ACTION BUTTONS <3
$(document).ready(function () {
	
	///////////////////////////////////
	/////////////////TEST TES TES TEST///////////////
	(function(){
	    var oldLog = console.log;
	    console.log = function (message) {
	        oldLog.apply(console, arguments);
	    };
	})();
	
	
	///////////////////////////////////////
	/////////////////////////////////////
	
	
        
        if (document.getElementById('user-info-text') !== null) { //IF I'M SIGNED IN THEN THIS WILL NOT RETURN NULL 
                loadButtons();
        } else {
            document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            loadForm();
        }
        var observer = new MutationObserver(spawnNotification);
    
            observer.observe(stateText, observerOptions);
            console.log("Established Observer");
        
        notiReset(); // I think we have to run this on page load....
    
});
function signIn(m) {
    //$('#logonForm').toggle();
    $('#username').val(ID);
    $('#extension').val( (m) ? extensionNumber : ID);
    $("#password").val('13579');
    $('#mobile_agent_mode').val('CALL_BY_CALL');
    $('#mobile-agent-checkbox').prop( "checked", m );
    $('#mobile_agent_dialnumber').val(dialNumber);
    $('#signin-button').click();
    //setInterval(function () {
    //    window.location.reload();
    //}, 6000);
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