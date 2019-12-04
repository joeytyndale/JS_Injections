// enter some javascript here and it will run
// on every page on this domain (location.host)


// Random Test Function -- Ignore

function testActivationLink(jsessionid,accountId){

	// Need to get the profile ID for the profile we're looking at

	var url = window.location.href;
	var num1 = Number(url.indexOf("profiles/")) + 9;
	var num2 = Number(url.indexOf("/licenses"));

	var profileId = url.substring(num1,num2);

	var apiUrl = 'https://customer.www.linkedin.com/csp-api/profiles/($params:(),account:urn%3Ali%3AenterpriseAccount%3A' + String(accountId) + ',profileId:' + String(profileId) + ')';
	$.ajax({
		url: apiUrl,
		headers: {
			'Csrf-Token': jsessionid.replace(/"/g, ''),
			'X-RestLi-Protocol-Version' : '2.0.0',
			'Accept': 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		},
		success: function(data){
			console.log("Found profile stuffs");
			console.log(data);

			var activationLink = 'https://www.linkedin.com/learning/memberbinding?u=' + String(accountId) + '&auth=true&identity=' + String(data.profileIdentity)

			var ALButton = document.createElement('BUTTON');
			ALButton.setAttribute('class','artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view');
			ALButton.innerHTML = "Show Activation Link";
			ALButton.setAttribute('style','margin-left:8px');
			ALButton.setAttribute('onclick','alert(\'' + activationLink + '\')');

			$('#customTableRow').append(ALButton);
		}
	})
}





// END RANDOM TEST STUFF


function findAdmin(jsessionid, accountId, companyId, instanceStep=0){
	//BEGIN FULL ADMIN FUNCTION

	var foundFullAdmin = false;

	$.ajax({
		url: 'https://customer.www.linkedin.com/csp-api/miniProfileAdminInfos?applicationInstance=urn%3Ali%3AenterpriseApplicationInstance%3A%28urn%3Ali%3AenterpriseAccount%3A' + String(accountId) + '%2C' + String(companyId) + '%29&count=50&q=applicationInstance&start=' + String(instanceStep),
		headers: {
			'Csrf-Token': jsessionid.replace(/"/g, ''),
			'X-RestLi-Protocol-Version' : '2.0.0',
			'Accept': 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		},
		success: function(data){
			console.log(data.elements);

			data.elements.forEach((admin) => {
				if(!foundFullAdmin){
					admin.associatedApplicationInstances.forEach((application) => {
						if(application.licenseAssignments.length > 0){
							application.roleAssignments.forEach((role) => {
								//console.log(role.role.split(',')[1])
								if(role.role.split(',')[1] == "LearningProductAdmin)"){
									//console.log(admin)
	
									foundFullAdmin = true;
	
									var liasURL = 'https://www.linkedin.com/checkpoint/enterprise/loginAsSeat/' + String(accountId) + '?enterpriseProfileId=' + String(admin.profileId) + '&amp;enterpriseApplication=learning&amp;applicationInstanceId=' + String(companyId) + '&amp;redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Flearning-admin%2Fpeople%3FappInstanceId%3D' + String(companyId) + '%26account%3D' + String(accountId);
	
									var liasForm = document.createElement("FORM");
									liasForm.setAttribute('action',liasURL);
									liasForm.setAttribute('method','POST');
									liasForm.setAttribute('target','_blank');
									liasForm.setAttribute('id','myLiasForm')
	
									var liasInput1 = document.createElement("INPUT");
									liasInput1.setAttribute('name','csrfToken');
									liasInput1.setAttribute('value',jsessionid.replace(/"/g,''));
	
									var liasInput2 = document.createElement("INPUT");
									liasInput2.setAttribute('name','accountId');
									liasInput2.setAttribute('value',accountId);
	
									var liasInput3 = document.createElement("INPUT");
									liasInput3.setAttribute('name','enterpriseApplication');
									liasInput3.setAttribute('value','learning');
	
									var liasInput4 = document.createElement("INPUT");
									liasInput4.setAttribute('name','enterpriseProfileId');
									liasInput4.setAttribute('value',admin.profileId)
	
									liasForm.appendChild(liasInput1);
									liasForm.appendChild(liasInput2);
									liasForm.appendChild(liasInput3);
									liasForm.appendChild(liasInput4);
	
									$('body').append(liasForm);
	
									var liasButton = document.createElement('BUTTON');
									liasButton.setAttribute('class','artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view');
									liasButton.innerHTML = "Lias as Full Admin";
									liasButton.setAttribute('style','margin-left:8px');
									liasButton.setAttribute('onclick','$(\'#myLiasForm\').submit()');
	
									$('#customTableRow').append(liasButton);

									// More Testing stuff

									testActivationLink(jsessionid,accountId);

									// End more testing stuff
	
								}
							});
						}
					});
				}
			});
			if(foundFullAdmin == false && instanceStep < 250){
				console.log("Didn't find an admin. Trying again at step: " + String(instanceStep + 50));
				findAdmin(jsessionid,accountId,companyId,instanceStep + 50);
			}
		}
	});
}

// Start is the meat of the script
// instanceStep tracks the "start" parameter of our API request. We begin that with 0
function start(instanceStep=0){
	console.log("------\nStarting\n-------");
	
	// Translate map allows us to grab a plain text description of the auth type we find
	var translate = {
		"NON_SSO_MEMBER_REQUIRED" : "Non SSO: Profile Required",
		"NON_SSO_MEMBER_OPTIONAL" : "Non SSO: Profile Optional",
		"NON_SSO_MEMBER_FORBIDDEN" : "Non SSO: Profile Not Allowed",
		"SSO_MEMBER_REQUIRED" : "SSO: Profile Required",
		"SSO_MEMBER_OPTIONAL" : "SSO: Profile Optional",
		"SSO_MEMBER_FORBIDDEN" : "SSO: Profile Not Allowed"
	}
	
	// This parses the URL to find the account ID for use in our API call
	var url = window.location.href;
	var num1 = Number(url.indexOf("Account:")) + 8;
	var num2 = Number(url.indexOf("/profiles"));
	
	var accountId = url.substring(num1, num2);
	console.log(accountId);

	// We now go through the cookies to find jsessionid which neads to be sent as a header to the API
	var jsessionid = '';
	document.cookie.split(";").forEach((cookie, index) => {
		if(cookie.split("=")[0].trim() == "JSESSIONID" ){
			jsessionid = cookie.split("=")[1].trim();
		}
	});
	
	// If the cookie exists and we successfully grab it then we move forward with the script
	if(jsessionid != ""){
		console.log("jsessionid: " + String(jsessionid));

		// AJAX call to the API asking for application instances under the account we found before
		$.ajax({
			url: 'https://customer.www.linkedin.com/csp-api/applicationInstances?account=urn%3Ali%3AenterpriseAccount%3A' + String(accountId) + '&count=50&forPreOrder=false&q=account&start=' + String(instanceStep),
			headers: {
				'Csrf-Token': jsessionid.replace(/"/g, ''),
				'X-RestLi-Protocol-Version' : '2.0.0',
				'Accept': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			success: function(data){
				console.log("Got API response");
				console.log(data);

				// We may need to ask the API for the next set of instances if there are more than 50 on the account and Learning wasn't in the set we just pulled. This variable keeps track of our success
				var foundLearning = false;

				// Iterate through instances looking for an Active Learning instance
				data.elements.forEach((instance, index) => {
					if(instance.enterpriseApplication == "urn:li:enterpriseApplication:learning" && instance.status == "ACTIVE"){

						// Setting to true to confirm Learning was in the set of instances we pulled
						foundLearning = true;

						// Company ID is different from the account ID and is a part of the URL used to access a specific instance. We'll need it for our "Go to instance" button
                        var companyId = instance.key.id;
                        console.log("Company ID: " + companyId);

						// We now iterate through all of the authentication types looking for the active type. This is what we'll display
						instance.authentications.forEach((authType, authIndex) => {
							if(authType.active){
								
								// Creating our table row for append onto the page
								var titleCell = document.createElement("TH");
								titleCell.innerHTML = "Profile Requirement";
								titleCell.setAttribute('class','profile-header__property');
								
								var valueCell = document.createElement("TD");
								valueCell.innerHTML = translate[authType.authenticationType];
								valueCell.setAttribute('class','profile-header__value');
								
								var tableRow = document.createElement("TR");
								tableRow.setAttribute('id','customTableRow');
								tableRow.appendChild(titleCell);
								tableRow.appendChild(valueCell);

								var instanceButton = document.createElement("A");
								instanceButton.innerHTML = "Go to LiL Instance";
								instanceButton.setAttribute('class','artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view');
								instanceButton.setAttribute('href', "https://customer.www.linkedin.com/support/product/urn%3Ali%3AenterpriseApplicationInstance%3A(urn%3Ali%3AenterpriseAccount%3A" + String(accountId) + "," + String(companyId) + ")");
								instanceButton.setAttribute('target', "_blank");

								tableRow.appendChild(instanceButton);
								
								console.log("Your auth type is: " + authType.authenticationType);
								$('table')[0].tBodies[0].appendChild(tableRow);

								findAdmin(jsessionid,accountId,companyId);
								
							}
						});
					}
				});

				// In the event that we didn't find Learning in our set of instances we start() again with the next 50 instances on the account. If we end up pulling 200 instances and still can't find Learning we quit.
				if(foundLearning == false && instanceStep < 150){
					start(instanceStep + 50);
				}
			}
		});
	}
}

$(document).ready(() => {    // Script starts here

	// Initiate a loop to look for a <table> on the page. Despite jquery .ready() the elements are still loading we need the <table> to exist before beginning
	var verification = setInterval(function(){
		if($('table').length > 0){
			start();
			clearInterval(verification);
		}
	}, 500);
});