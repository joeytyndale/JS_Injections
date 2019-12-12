// MY CSP JAVASCRIPT THING
// COPYRIGHT JOE

function activationLink(info){

	var activationLink = `https://www.linkedin.com/learning/memberbinding?u=${String(info.accountId)}&auth=true&identity=${String(info.profileData.profileIdentity)}`;

	var ALButton = document.createElement('BUTTON');
	ALButton.setAttribute('class','artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view');
	ALButton.innerHTML = "Show Activation Link";
	ALButton.setAttribute('style','margin-left:8px');
	ALButton.setAttribute('onclick','alert(\'' + activationLink + '\')');

	$('#customTableRow').append(ALButton);
}

function findAdmin(info,instanceStep=0){
	
	var foundFullAdmin = false;

	$.ajax({
		url: `https://customer.www.linkedin.com/csp-api/miniProfileAdminInfos?applicationInstance=urn%3Ali%3AenterpriseApplicationInstance%3A%28urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)}%2C${String(info.instanceData.key.id)}%29&count=50&q=applicationInstance&start=${String(instanceStep)}`,
		async: false,
		headers: {
			'Csrf-Token': info.jsessionId,
			'X-RestLi-Protocol-Version' : '2.0.0',
			'Accept': 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		},
		success: function(data){
			console.log("Admins");
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

									var liasURL = `https://www.linkedin.com/checkpoint/enterprise/loginAsSeat/${String(info.accountId)}?enterpriseProfileId=${String(admin.profileId)}&amp;enterpriseApplication=learning&amp;applicationInstanceId=${String(info.instanceData.key.id)}&amp;redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning-admin%2Fpeople%2Fusers%2F${String(info.profileData.profileIdentity)}%2Flicenses%3Faccount%3D${String(info.accountId)}%26appInstanceId%3D${String(info.instanceData.key.id)}`;
	
									var liasForm = document.createElement("FORM");
									liasForm.setAttribute('action',liasURL);
									liasForm.setAttribute('method','POST');
									liasForm.setAttribute('target','_blank');
									liasForm.setAttribute('id','myLiasForm')
	
									var liasInput1 = document.createElement("INPUT");
									liasInput1.setAttribute('name','csrfToken');
									liasInput1.setAttribute('value',info.jsessionId);
	
									var liasInput2 = document.createElement("INPUT");
									liasInput2.setAttribute('name','accountId');
									liasInput2.setAttribute('value',info.accountId);
	
									var liasInput3 = document.createElement("INPUT");
									liasInput3.setAttribute('name','enterpriseApplication');
									liasInput3.setAttribute('value','learning');
	
									var liasInput4 = document.createElement("INPUT");
									liasInput4.setAttribute('name','enterpriseProfileId');
									liasInput4.setAttribute('value',info.profileId)
	
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
	
								}
							});
						}
					});
				}
			});
			if(foundFullAdmin == false && instanceStep < 250){
				console.log("Didn't find an admin. Trying again at step: " + String(instanceStep + 50));
				findAdmin(info,instanceStep + 50);
			}
		}
	});
}

function profileRequirement(info){
	
	// Translate map allows us to grab a plain text description of the auth type we find
	var translate = {
		"NON_SSO_MEMBER_REQUIRED" : "Non SSO: Profile Required",
		"NON_SSO_MEMBER_OPTIONAL" : "Non SSO: Profile Optional",
		"NON_SSO_MEMBER_FORBIDDEN" : "Non SSO: Profile Not Allowed",
		"SSO_MEMBER_REQUIRED" : "SSO: Profile Required",
		"SSO_MEMBER_OPTIONAL" : "SSO: Profile Optional",
		"SSO_MEMBER_FORBIDDEN" : "SSO: Profile Not Allowed"
	}
	// Company ID is different from the account ID and is a part of the URL used to access a specific instance. We'll need it for our "Go to instance" button
	var companyId = info.instanceData.key.id;
	console.log("Company ID: " + companyId);

	// We now iterate through all of the authentication types looking for the active type. This is what we'll display
	info.instanceData.authentications.forEach((authType, authIndex) => {
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
			instanceButton.setAttribute('href', "https://customer.www.linkedin.com/support/product/urn%3Ali%3AenterpriseApplicationInstance%3A(urn%3Ali%3AenterpriseAccount%3A" + String(info.accountId) + "," + String(companyId) + ")");
			instanceButton.setAttribute('target', "_blank");

			tableRow.appendChild(instanceButton);
			
			console.log("Your auth type is: " + authType.authenticationType);
			$('table')[0].tBodies[0].appendChild(tableRow);

			return true;
			
		}
	});				
}

function findLilInstance(info, step=0){

	var foundLearning = false;
	var lilInstance = null;

	$.ajax({
		url: `https://customer.www.linkedin.com/csp-api/applicationInstances?account=urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)}&count=50&forPreOrder=false&q=account&start=${String(step)}`,
		async: false,
		headers: {
			'Csrf-Token': info.jsessionId,
			'X-RestLi-Protocol-Version' : '2.0.0',
			'Accept': 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		},
		success: function(data){
			
			// Iterate through instances looking for an Active Learning instance
			data.elements.forEach((instance, index) => {
				if(instance.enterpriseApplication == "urn:li:enterpriseApplication:learning" && instance.status == "ACTIVE"){
					lilInstance = instance
					foundLearning = true;
					return false;
				}
			});
		}
	});
	if(!foundLearning && step < 250){
		return findLilInstance(info,step+50);
	}else{
		return lilInstance;
	}
}

$(document).ready(() => {    // Script starts here

	// Initiate a loop to look for a <table> on the page. Despite jquery .ready() the elements are still loading we need the <table> to exist before beginning
	var verification = setInterval(function(){
		if($('table').length > 0){

			// We need to collect all of our variables here and disperse them accordingly
			// Variables needed:
			// Profile ID
			// Account ID
			// Company ID
			// jsession ID
			// profileIdentity

			var info = {
				profileId : "",
				accountId : "",
				instanceData : "", // Includes the company ID which we'll need
				jsessionId : "",
				profileData : "" // Includes the profileIdentity which we'll need
			}

			// Get profileId
			var url = window.location.href;
			var num1 = Number(url.indexOf("profiles/")) + 9;
			var num2 = Number(url.indexOf("/licenses"));

			info.profileId = url.substring(num1,num2); // profileId set

			// Get accountId
			var num1 = Number(url.indexOf("Account:")) + 8;
			var num2 = Number(url.indexOf("/profiles"));
			
			info.accountId = url.substring(num1, num2); // accountId set

			// Get jsessionId
			document.cookie.split(";").forEach((cookie) => {
				if(cookie.split("=")[0].trim() == "JSESSIONID" ){
					info.jsessionId = cookie.split("=")[1].trim().replace(/"/g, ''); // jsessionId set
				}
			});

			// get profileData
			$.ajax({
				url: `https://customer.www.linkedin.com/csp-api/profiles/($params:(),account:urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)},profileId:${String(info.profileId)})`,
				async: false,
				headers: {
					'Csrf-Token': info.jsessionId,
					'X-RestLi-Protocol-Version' : '2.0.0',
					'Accept': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
				},
				success: function(data){
					info.profileData = data; // profileData set
				}
			});

			// get instanceData | placing in function due to need for steping through multiple GET requests
			info.instanceData = findLilInstance(info);

			console.log(info);

			clearInterval(verification);

			// Start running our functions
			profileRequirement(info);

			findAdmin(info);

			activationLink(info);

			
		}
	}, 500);
});