//Javascript

function spawnNotification(mutationList, observer) {

	console.log("We have infiltrated the function");

	if(!callNotificationLimiter){
		let notified = false;
	    callNotificationLimiter = true

		mutationList.forEach((mutation) => {
			if (notified == false){
				if(mutation.addedNodes[0] != undefined){
					console.log(mutation.addedNodes[0].data)
					if(mutation.addedNodes[0].data == 'Reserved' || mutation.addedNodes[0].data == 'Ready'){
						notified = true;
						
                        console.log("Notified set to true")

                        var callVariable = "";
                        
                        if($('.call-var-value-text').length > 1){
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

if(window.location.protocol == "http:"){
    window.location.replace('https' + window.location.href.substring(4))
}

var callNotificationLimiter = false; // Ensures that we don't spam notifications when the btn state changes. Cause for some reason Finesse just changes it all willey nilley
let notiReset = () => {
    let callNotificationLimiterReset = setTimeout(()=>{
        callNotificationLimiter = false;
    },5000);
};

$(document).ready(function(){
	if(document.getElementById('user-info-text') != null){ //IF I'M SIGNED IN THEN THIS WILL NOT RETURN NULL 
		loadButtons();
	}else{
		loadForm();
    }
	
		var observer = new MutationObserver(spawnNotification);

		observer.observe(stateText, observerOptions);
		console.log("Established Observer");
    
    notiReset(); // I think we have to run this on page load....
	
	//$('#finesse-container').prepend('<div id="variableStorage"></div>');
	
	
	
});

function loadButtons(){ //PUTS MY CUSTOM BUTTONS ONTO THE PAGE

	var ready = '<button onclick="goReady()" class="myCustomButtons">Ready</button>';
	var pepe = '<button onclick="goPeePee()" class="myCustomButtons">Take a piss</button>';
	var breakButton = '<button onclick="goBreak()" class="myCustomButtons">Break</button>';
	var chat = '<button onclick="goChat()" class="myCustomButtons">Chat</button>';
	var meeting = '<button onclick="goMeeting()" class="myCustomButtons">Meeting</button>';
	var tech = '<button onclick="goGTS()" class="myCustomButtons">Sometin Broken</button>';
	var inday = '<button onclick="goIn()" class="myCustomButtons">InDay</button>';
	var lunch = '<button onclick="goNomNom()" class="myCustomButtons">NomNom</button>';
	var team = '<button onclick="goTeam()" class="myCustomButtons">Team Meeting</button>';
	var training = '<button onclick="goTrain()" class="myCustomButtons">Teach Me</button>';
	var logout = '<button onclick="goAway()" class="myCustomButtons">Go Away</button>';

	$('#finesse-container').prepend('<div id="myButtons">' + ready + pepe + breakButton + tech + inday + lunch + team + training + chat + meeting + logout + '</div>');

};


function loadForm(){ //CALLS FUNCTION TO LOAD THE BUTTONS WHICH WILL CREATE DESIRED FORM
	document.getElementById('app-signin').innerHTML =	'<button class="finesseCustomButtons" onclick="signIn()">Sign In</button><br><button class="finesseCustomButtons" onclick="signInMobile()">Sign In As Mobile Agent</button>';
}

//FORMS

function signIn(){ //CREATES A FORM AND AUTHENTICATES NORMALLY
	var f = document.createElement("form");

	f.setAttribute('method',"POST");
	f.setAttribute('action',"j_security_check?locale=en_us");
	f.setAttribute('name',"login_user");


	var i1 = document.createElement("input");

	i1.setAttribute('name',"j_username");
	i1.setAttribute('value',"01003951029");

	var i2 = document.createElement("input");

	i2.setAttribute('name',"j_password");
	i2.setAttribute('value',"13579");

	var i3 = document.createElement("input");

	i3.setAttribute('name',"extension_login_user");
	i3.setAttribute('value',"01003951029");

	var i4 = document.createElement("input");

	i4.setAttribute('name',"mobile_agent_checkbox");
	i4.checked = false;


	f.appendChild(i1);
	f.appendChild(i2);
	f.appendChild(i3);
	f.appendChild(i4);

	document.getElementsByTagName('body')[0].appendChild(f);

	f.submit();

}

function signInMobile(){ //CREATES A FORM AND AUTHENTICATES AS MOBILE USER
	var f = document.createElement("form");

	f.setAttribute('method',"POST");
	f.setAttribute('action',"j_security_check?locale=en_us");
	f.setAttribute('name',"login_user");


	var i1 = document.createElement("input");

	i1.setAttribute('name',"j_username");
	i1.setAttribute('value',"01003951029");

	var i2 = document.createElement("input");

	i2.setAttribute('name',"j_password");
	i2.setAttribute('value',"13579");

	var i3 = document.createElement("input");

	i3.setAttribute('name',"extension_login_user");
	i3.setAttribute('value',"01009800009");

	var i4 = document.createElement("input");

	i4.setAttribute('name',"mobile_agent_checkbox");
	i4.checked = true;

	var i5 = document.createElement("input");

	i5.setAttribute('name',"mobile_agent_mode");
	i5.setAttribute('value',"CALL_BY_CALL");

	var i6 = document.createElement("input");

	i6.setAttribute('name',"mobile_agent_dialnumber");
	i6.setAttribute('value',"918057936853");

	f.appendChild(i1);
	f.appendChild(i2);
	f.appendChild(i3);
	f.appendChild(i4);
	f.appendChild(i5);
	f.appendChild(i6);

	document.getElementsByTagName('body')[0].appendChild(f);

	f.submit();
}

//BUTTON FUNCTIONALITY

$('.myCustomButtons').click(function(){
    $('.activeButton').removeClass("activeButton");
    $(this).addClass("activeButton");
})

function goReady(){
    $('#link-READY').click();
}
function goPeePee(){
    $('#link-NOT_READY7').click();
}
function goBreak(){
    $('#link-NOT_READY8').click();
}
function goChat(){
    $('#link-NOT_READY15').click();
}
function goMeeting(){
    $('#link-NOT_READY12').click();
}
function goGTS(){
    $('#link-NOT_READY10').click();
}
function goIn(){
    $('#link-NOT_READY17').click();
}
function goNomNom(){
    $('#link-NOT_READY2').click();
}
function goTeam(){
    $('#link-NOT_READY13').click();
}
function goTrain(){
    $('#link-NOT_READY11').click();
}
function goAway(){
    $('#link-NOT_READY20').click();
    setTimeout(function(){ 
        $('#link-signout6').click();
    }, 3000);
}