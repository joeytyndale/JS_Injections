// MY CSP JAVASCRIPT THING
// COPYRIGHT JOE



////////////////////////////////////////////////////////////////////////

// Collecting variables


var clpIcon = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fthin-text-editing%2F24%2Fthin-0254_copy-256.png&f=1&nofb=1" width="12px" height="12px" />`;
var hyperlinkIcon = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmaxcdn.icons8.com%2FShare%2Ficon%2Fp1em%2FVery_Basic%2Fexternal_link1600.png&f=1&nofb=1" width="10px" height="10px" />`;
var translate = {
	"NON_SSO_MEMBER_REQUIRED" : "Non SSO: Profile Required",
	"NON_SSO_MEMBER_OPTIONAL" : "Non SSO: Profile Optional",
	"NON_SSO_MEMBER_FORBIDDEN" : "Non SSO: Profile Not Allowed",
	"SSO_MEMBER_REQUIRED" : "SSO: Profile Required",
	"SSO_MEMBER_OPTIONAL" : "SSO: Profile Optional",
	"SSO_MEMBER_FORBIDDEN" : "SSO: Profile Not Allowed"
}




var info = {
	profileId : "",
	accountId : "",
	mid: "None",
	authType: "",
	instanceData : "", // Includes the company ID which we'll need
	headers : { // Get sent with each API call | Token gets filled in below
		'Csrf-Token': '',
		'X-RestLi-Protocol-Version' : '2.0.0',
		'Accept': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	},
	profileData : "" // Includes the profileIdentity which we'll need
}

// Get profileId
var url = window.location.href;
info.profileId = url.substring(Number(url.indexOf("profiles/")) + 9,Number(url.indexOf("/licenses"))); // profileId set
info.accountId = url.substring(Number(url.indexOf("Account:")) + 8, Number(url.indexOf("/profiles"))); // accountId set

// Get jsessionId
document.cookie.split(";").forEach((cookie) => {
	if(cookie.split("=")[0].trim() == "JSESSIONID" ){
		info.headers['Csrf-Token'] = cookie.split("=")[1].trim().replace(/"/g, ''); // jsessionId set
	}
});
if(info.headers['Csrf-Token'] == "") console.log("NO TOKEN"); // No point in continuing without that token

// Get profileData
info.profileData = apiRequest(`https://customer.www.linkedin.com/csp-api/profiles/($params:(),account:urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)},profileId:${String(info.profileId)})`,info.headers);

if(!info.profileData.azureB2CEmailAddress){ // If a user doesn't have an Azure email then the parameter isn't provided. Since I reference it below I'm making sure we at least have a "None" for users without it
	info.profileData.azureB2CEmailAddress = "None";
}

// Get instanceData | placing in function due to potential need for steping through multiple GET requests
info.instanceData = findLilInstance(info);

console.log(info); // For Debugging 

// Filling in the MID if a member was found
if(info.profileData.member){
	info.mid = info.profileData.member.substring(14);
}

// Searching for the active LiL instance (if one exists) and recording its profile requirement
info.instanceData.authentications.forEach((authType) => {
	if(authType.active){
		info.authType=translate[authType.authenticationType];
	}
});



/////////////////////////////////////////////////////////////////////////

function apiRequest(url,headers){
	// Takes a URL and Headers and returns the raw API response
	let d = -1;
	$.ajax({
		url,
		async: false, // Async has to be false because each subsequent requuest depends on the data returned by the one before it
		headers,
		success: function(data){
			d = data;
		},
	});
	return d;
}

function findLilInstance(info, step=0){

	var found = false;
	var lil = -1;

	// Iterate through instances looking for an Active Learning instance | Might consider disregarding the status and instead returning all/any LiL instance and displaying their status' 
	apiRequest(`https://customer.www.linkedin.com/csp-api/applicationInstances?account=urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)}&count=50&forPreOrder=false&q=account&start=${String(step)}`,info.headers).elements.forEach((instance) => {
		if(instance.enterpriseApplication == "urn:li:enterpriseApplication:learning" && instance.status == "ACTIVE"){
			found = true;
			lil = instance;
		}
	});

	if(!found && step < 250){ // We're only pulling 50 instances per request and some accounts have a LOT of instances. Artificial limit set to 250 to avoid out of control API requests. 
		return findLilInstance(info,step+50);
	}else{
		return lil;
	}
}


// Same deal here as with findLilInstance, we need to potentially iterate through a good deal of admins to find a full admin which is why we used a function. 
// This function is called at the end of the start() function. This just adds a hidden form to the page that we reference with its ID "myLiasForm" via a hard coded button.
function findAdmin(info,instanceStep=0){
	
	var foundFullAdmin = false;
	apiRequest(`https://customer.www.linkedin.com/csp-api/miniProfileAdminInfos?applicationInstance=urn%3Ali%3AenterpriseApplicationInstance%3A%28urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)}%2C${String(info.instanceData.key.id)}%29&count=50&q=applicationInstance&start=${String(instanceStep)}`,info.headers).elements.forEach((admin) => {
		if(!foundFullAdmin){
			admin.associatedApplicationInstances.forEach((application) => {
				if(application.licenseAssignments.length > 0){
					application.roleAssignments.forEach((role) => {
						if(role.role.split(',')[1] == "LearningProductAdmin)"){

							foundFullAdmin = true;								   

							var liasURL = `https://www.linkedin.com/checkpoint/enterprise/loginAsSeat/${String(info.accountId)}?enterpriseProfileId=${String(admin.profileId)}&amp;enterpriseApplication=learning&amp;applicationInstanceId=${String(info.instanceData.key.id)}&amp;redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning-admin%2Fpeople%2Fusers%2F${String(info.profileData.profileIdentity)}%2Flicenses%3Faccount%3D${String(info.accountId)}%26appInstanceId%3D${String(info.instanceData.key.id)}`;

							var liasForm = document.createElement("FORM");
							liasForm.setAttribute('action',liasURL);
							liasForm.setAttribute('method','POST');
							liasForm.setAttribute('target','_blank');
							liasForm.setAttribute('id','myLiasForm')

							var liasInput1 = document.createElement("INPUT");
							liasInput1.setAttribute('name','csrfToken');
							liasInput1.setAttribute('value',info.headers['Csrf-Token']);

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



function start(){
	// Verify that we're on a page that requires our script
	if(window.location.href.substring(window.location.href.length - 8) != 'licenses'){ console.log("no need to run on this page"); return false };

	if(Notification.permission !== "granted"){
		Notification.requestPermission();
	}

	// Initiate a loop to look for a <table> on the page. Despite jquery .ready() the elements are still loading we need the <table> to exist before beginning
	var verification = setInterval(function(){
		if($('table').length > 0){

			// Stop our interval because the page (or part of it we need) has loaded
			clearInterval(verification);
			
			// The unbind button seems to have a JS handler tracking its ID. Problem is that the ID changes from time to time. So to make my own button I'm just gonna copy the one that's here and paste it in where I want it
			var unbindButtonId = $('.profile-unbind-modal button')[0].id;

			// Same thing as the unbind button but for Lias button
			var liasButtonId = $('.app-instance-cell button')[0].id;

			// Remove the table because we don't really need it anymore
			$('table')[0].remove();

			// This is not the ideal solution but my script injector doesn't make functions available to the DOM so I need to actually place this one into the "head" as a script and some CSS becuase why not
			$('head').prepend(`
				<style type="text/css">
					.profile-header{
						font-size:10px;
						color:#f7f7f7;
						width:calc(100% - 48px);
						display:inline-grid;
						grid-gap:10px;
						grid-template-rows: auto auto auto;
					}
					.header-block button{
						margin: 5px 0;
					}
					.header-block h4 {
						width: 140px;
						padding: 3px;
						color: #000;
					}
					.header-block{
						font-size: 1.4rem;
					}
					.sub-block{
						box-sizing: border-box;
						padding: 10px 10px 10px 150px;
						border-top: 1px dashed #0073b1;
					}
					.header-block span{
						color:#000;
						cursor:pointer;
					}
					.header-block span:hover{
						transition:0.2s;
						color: rgb(0, 63, 103);
					}
					.header-block img{
						margin: 0 5px 0 5px;
					}
					.sub-block p{
						font-size: 1.4rem;
					}
					.field-label{
						font-style: italic;
						display: inline-block;
						width: 200px;
						font-weight: 900;
						color:#7b7b7b;
					}
				</style>
				<script>
					function copyToClipboard(copyString, noti=true){
						navigator.clipboard.writeText(copyString)
						.then(() => {
							if(noti){
								let n = new Notification('Done!',{body: "Successfully copied to clipboard!"});
							}
						});
					}
				</script>`
			);

			$('.profile-header').append( `
				<div id="user-block" class="header-block">
					<h4 class="artdeco-entity-lockup__title ember-view">User Profile</h4>
					<div class="sub-block">
						<p class="ember-view"><span class="field-label">Name:</span> <span onclick="copyToClipboard('${info.profileData.preferredFirstName} ${info.profileData.preferredLastName}')">${info.profileData.preferredFirstName} ${info.profileData.preferredLastName} ${clpIcon}</span></p>
						<p class="ember-view"><span class="field-label">Email:</span> <span onclick="copyToClipboard('${info.profileData.primaryEmailAddress}')">${info.profileData.primaryEmailAddress} ${clpIcon}</span></p>
						<p class="ember-view"><span class="field-label">Azure Email:</span> <span onclick="copyToClipboard('${info.profileData.azureB2CEmailAddress}')">${info.profileData.azureB2CEmailAddress} ${clpIcon}</span></p>
						<br />
						<p class="ember=view"><span class="field-label">User Status:</span> ${info.profileData.workerStatus}</p>
						<p class="ember-view"><span class="field-label">Profile ID:</span> <span onclick="copyToClipboard('${info.profileId}')">${info.profileId} ${clpIcon}</span></p>
						<p class="ember-view"><span class="field-label">Unique ID:</span> <span onclick="copyToClipboard('${info.profileData.uniqueUserId}')">${info.profileData.uniqueUserId} ${clpIcon}</span></p>
						<p class="ember-view"><button onclick="$('#myLiasForm').submit()" class="artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view">Open As Full Admin</button></p>
					</div>
				</div>
				<div id="license-block" class="header-block">
					<h4 class="artdeco=entity-lockup__title ember-view">License</h4>
					<div class="sub-block">
						<p class="ember-view"><span class="field-label">Activation Status:</span> ${info.profileData.licenseAssignments[0].status}</p> 
						<p class="ember-view"><span class="field-label">Activated On:</span> ${String(new Date(info.profileData.licenseAssignments[0].activatedAt)).substring(0,15)} </p>
						<p class="ember-view"><span class="field-label">Binding Status:</span> ${info.profileData.memberBindingStatus}</p>
						<br />
						<p class="ember-view"><span class="field-label">Member ID:</span> <a target="_blank" href="https://cstool.www.linkedin.com/cstool/members/${info.mid}">${info.mid}${hyperlinkIcon}</a><span onclick="copyToClipboard('${info.mid}')">${clpIcon}</span></p>
						<p class="ember-view">
							<button id="${unbindButtonId}" class="artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view">Unbind</button>
						</p>
						<p class="ember-view">
							<button id="${liasButtonId}" class="artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view">Login as user</button>
						</p>
						<p class="ember-view">
							<button class="artdeco-button__text artdeco-button artdeco-button--1 artdeco-button--primary ember-view" onclick="copyToClipboard('https://www.linkedin.com/learning/memberbinding?u=${String(info.accountId)}&auth=true&identity=${String(info.profileData.profileIdentity)}')">Copy Activation Link</button>
						</p>
					</div>
				</div>
				<div id="company-block" class="header-block">
					<h4 class="artdeco=entity-lockup__title ember-view">Instance</h4>
					<div class="sub-block">
						<p class="ember-view"><span class="field-label">Instance Name:</span> <a target="_blank" href="https://customer.www.linkedin.com/support/product/urn%3Ali%3AenterpriseApplicationInstance%3A(urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)},${String(info.instanceData.key.id)})">${info.instanceData.name} ${hyperlinkIcon}</a></p>
						<p class="ember-view"><span class="field-label">Profile Requirement:</span> ${info.authType}</p>
						<p class="ember-view"><span class="field-label">Instance Status:</span> ${info.instanceData.status}</p>
						<br />
						<p class="ember-view"><span class="field-label">Total Licenses:</span> ${info.instanceData.licenseSummaries[0].allocatedCount}</p>
						<p class="ember-view"><span class="field-label">Used Licenses:</span> ${info.instanceData.licenseSummaries[0].assignedCount}</p>
						<p class="ember-view"> </p>
						<p class="ember-view"> </p>
						<p class="ember-view"> </p>
					</div>
				</div>
			`);

			//Finish everything by finding a full admin and adding a LIAS form to the page
			findAdmin(info);
			
		}
	}, 500);
}

// Script starts here | Keeping start in its own function in hopes of adding triggers to detect DOM changes. That way script doesn't depend solely on reload
$(document).ready(() => {
	// START
	start() 	
});
