// enter some javascript here and it will run
// on every page on this domain (location.host)


// Random Test Function -- Ignore

function testActivationLink(jsessionid,accountId,companyId){

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

			var revokeLicense = document.createElement('A');
			revokeLicense.setAttribute('class','artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view');
			revokeLicense.innerHTML = "Revoke License";
			revokeLicense.setAttribute('style','margin-left:8px');
			revokeLicense.setAttribute('href',`https://www.linkedin.com/revokeEnterpriseLicense?revokeLicense=true&accountId=${accountId}&profileIdentity=${data.profileIdentity}&jsessionid=${jsessionid.replace(/"/g,'')}&companyId=${companyId}&licenseType=${data.licenseAssignments[0].enterpriseLicenseType}`);
			revokeLicense.setAttribute('target','_blank');

			$('#customTableRow').append(ALButton);
			$('#customTableRow').append(revokeLicense);

			/// ADDITIONAL TESTING AHHHH

			// $.ajax({
			// 	url: 'https://www.linkedin.com/learning-enterprise-api/groupLicenseAssignments/?ids=List((budgetGroup:urn%3Ali%3AenterpriseBudgetGroup%3A%28urn%3Ali%3AenterpriseAccount%3A' + String(accountId) + '%2C8%29,profiles:List(' + String(data.profileIdentity) + '),licenseType:' + data.licenseAssignments[0].enterpriseLicenseType + ')',
			// 	type: 'DELETE',
			// 	success: function(){
			// 		console.log("Successfully Removed License");
			// 	}
			// });


			//// SO MANY TESTS
		}
	})
}


/// ADDITIONAL TESTING AHHHH
function revokeLicense(jsessionid,url,accountId,companyId){
	$.ajax({
		url: url,
		type: 'DELETE',
		headers: {
			'Csrf-Token': jsessionid,
			'X-RestLi-Protocol-Version' : '2.0.0',
			'X-Requested-With': 'XMLHttpRequest',
			'Host': 'www.linkedin.com',
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Accept-Language': 'en-US,en;q=0.5',
			'Accept-Encoding': 'gzip, deflate, br',
			'X-RestLi-Method': 'batch_delete',
			'X-LI-Lang': 'en_US',
			'X-LI-Track': '{"clientVersion":"1.2.*","osName":"web","timezoneOffset":-8}',
			//'X-li-page-instance': 'urn:li:page:d_learning-enterprise_people_users_detail_licenses;fv2jdX0VRKKtONnTkdwCtQ==',
			//'X-Li-Identity': 'dXJuOmxpOmVudGVycHJpc2VQcm9maWxlOih1cm46bGk6ZW50ZXJwcmlzZUFjY291bnQ6MTA0LDE1MTY0NjcxKQ==',
			'x-lil-intl-library': 'en_US',
			'x-li-enterprise-account-urn': 'urn:li:enterpriseAccount:' + String(accountId),
			'x-li-app-instance-urn': 'urn:li:enterpriseApplicationInstance:(urn:li:enterpriseAccount:' + String(accountId) + ',' + String(companyId) + ')',
			'X-Requested-With': 'XMLHttpRequest',
			'Origin':'https://www.linkedin.com',
			'Connection': 'keep-alive',
			//'Referer': 'https://www.linkedin.com/learning-admin/people/users/ABkAAAAAAAAAAGgAAAAAAMBzPwAAAW7Oh9ruAZ09eARqfCYCydapqqvXebHi2yhJ/licenses?account=104&appInstanceId=8',
			//Cookie: bcookie="v=2&7b1d674d-1b52-46ce-8d22-c05bffb1f5a1"; bscookie="v=1&2019091922355052ab57e0-f573-4f43-86bf-36c8fb7521bbAQEy2ShIdT___wh-xcJZzKHI8U6KU_CO"; lissc1=1; lissc2=1; _ga=GA1.2.1845196697.1568942798; utag_main=v_id:016d4c473d210010d7619fdca6150104e002a00d01058$_sn:77$_se:3$_ss:0$_st:1572565063806$vapi_domain:linkedin.com$ses_id:1572562300708%3Bexp-session$_pn:3%3Bexp-session; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-1303530583%7CMCIDTS%7C18234%7CMCMID%7C61829522553799052682212703543261954561%7CMCOPTOUT-1575428626s%7CNONE%7CvVersion%7C3.3.0; li_sugr=33a31831-9826-47dd-ba20-42450923682e; UserMatchHistory=AQLjNca2vZ44KQAAAW7KE_bDjCa-O7Xbye0VvEFHGvGqy-lcuWK9IIuTc8c6rlt1g_hKpE00ahwf9qDf2XC6K1PUqxKTz_OHIs1D87udVuQChSbxL6eplsi88ItB0JvGf1lOGq28M6SIu8qRJqRHlEaQGTLzsubZKxgZxU151g; _lipt=CwEAAAFuyY-A-NSbJ56gFEwIZA9fi4bd1g-B6v_9bgci7Bew07Iv4ptnf3SlEH1ytPaLdse62N4iKg6voPvS4VXyDKzchSO51Ih2XzLhmMy_4vTHWC-e0OoErJ4YvLajygNZfcR1gpwxGgSGhCYNhJN8pDpX3qgEvPT--9C8Ot2_uRM-Kv6PckahXIpG2ce0zyiPN1NyvalMGzfoibYH_G0IdFBWljOSCTgoENHo-wq-j8A7Ms9KoR7qLC5y3vBRVPvMCsp8OCfa6ux5EReLSYEmAFEuUjqr3oGsTjB4bWJpSW-D51cQaqhNWr6tp1ByS7cKJ3mM2RxkmlE; visit=v=1&M; _gcl_au=1.1.1760309701.1569371764; VID=V_2019_10_02_22_278316; li_oatml=AQFiJDbn55BwTAAAAW6f8Qz61R418397JoP0MyGl_7UtsQ7ZEjs4SbIJXbH_6oChcGa9rEQmaPFcz4djAmy9Aj5Y2Iv23BQt; lidc="b=OGST09:g=1388:u=1:i=1575423029:t=1575509429:s=AQGpblUZozIDcZ2pN7Z76yLo_1AqEtSn"; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; PLAY_LANG=en; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiJlZjcxZDFiYi05NjJkLTRkMjYtOTE3Ni03ODk1MWRhMWQ1N2V8MTU3NTM1NDMwOSIsInJlY2VudGx5LXNlYXJjaGVkIjoiZGVsZXRlfGFjY291bnR8cHJlbWl1bXxjYXJlZXJ8cmVjZWlwdHxjZXJ0aWZpY2F0ZXN8Y2FuY2VsfHRyYW5zZmVyfGhpc3Rvcnl8c2NyZWVuc2hvdCIsInJlZmVycmFsLXVybCI6IiIsImFpZCI6IiIsIlJOVC1pZCI6ImVVRjhHNmZ3ZVNpY2lQTDRuSERtMW1MTn5Gfl9yWUdKRXpDQXdVaHZyRDZHNGpOTEs2U1QyR3dWSjJOV2dXQjhuZFBfekJSakNvU2pqVUJZTkYxclBFdGhwQ0xZaEY4SHZDUEM2a1F6dFhweVFoVWh4MGZNVXAwWE9RWXlzYmhuYTgxTDNrUXIzSWsyUWwwM09YWktwNmM2eGllbFRyOEExcnwxNTc0Mjk2MjMzIiwicmVjZW50bHktdmlld2VkIjoiNzF8MTM4N3w4MDQzN3w5NDc5NHw3MDI0MSIsIkNQVC1pZCI6IllqVTJaVEEwT0RFdE9EQTNaQzAwTTJGaExXSm1PRFF0TkdVMVkyWTVNekpsTm1ZeSIsImV4cGVyaWVuY2UiOiJlbnRpdHkiLCJpc19uYXRpdmUiOiJmYWxzZSIsIndoaXRlbGlzdCI6Int9IiwibHluZGFBc2tQYXRoIjoiIiwidHJrIjoiaGMtcHJvZHVjdC1zd2l0Y2hlciJ9LCJuYmYiOjE1NzUzNTQzMDksImlhdCI6MTU3NTM1NDMwOX0.h2OKAeOehpDoWjEIqFvwDei79Nk8ZT4X5B4TBHbrjUU; lihc_auth_internal=1569371241; lihc_auth_internal_al=gco_user; lihc_cato_auth_str=TM57d4wEMj9anbIOlRpO%2Fxzl%2BBGJsxelwCkRQuuc45uyGqTGBnwiM7Xso0sROOl6Y9SeolcjqtXGxV61BrYFV9qXf3ZckEq55dP4A%2Bn1pampGsDB2R%2Brppo6OZKWT0J9BDifa9zW2NqjgX1lvhX77BWCnR69LKRu2B%2BSGVVt85uxVfTRwmmim8BsynAaZQYK1X0uTgtmmNQTHWhOZZQZJ2xiOqQ436vdIeruR65cybqdgdcjg7WB25pD3w6c2UkU6rBenP5MNSfHNqOVXQ8BZlEvvYsaygX0jDn4qlyEGSXt1XkoCmwfUvgRcoQ5zNDD9X5946ln1EgGaw630u%2BoZAXNikrjfWdc1W0O6LE26C1%2BYJ%2FGkGi1tVkPq%2FP0mi0qe5LEeHYv4ov4gMfXHKY7HfkaLYh9CUim7rkC0BhYWK%2BYEJHFuv0S6D%2FnjpFfhhLS%2FbHpTaAKmLVLVIq1kBdc%2FQPvtQCXuEih9YtOcXMO3nc%2BJdvV7Cvr63Jo4IGdXFvuAry%2FHa5AgmI%3D; SID=954295b4-07b1-4190-acd7-d4ff4d46ffd7; lil-lang=en_US; JSESSIONID="ajax:3919789895438817764"; li_at=AQEGAFEBAAAAAAHU0xwAAAFuzoewyQAAAW7OiRlZVgECABVjBBAALnVybjpsaTplaWRJbXBlcnNvbmF0b3I6KDEwNCwxNTE2NDY3MSxsZWFybmluZylSBCP2Ucb0ll-LXW9mZCzeEpB0E2vt__6R5P5mKcJazUNrtvNqCEmHewZybJf7BB3f6ExolRiJGEorrnze4mf1qh5hDpdP2HTd4cGgSn4sUV3BYPo; sl="v=1&AGycv"; liap=true; lang=v=2&lang=en-us
			'TE': 'Trailers'
		},
		success: function(){
			console.log("Successfully Removed License");
		}
	});
}



//// SO MANY TESTS





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

									testActivationLink(jsessionid,accountId,companyId);

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