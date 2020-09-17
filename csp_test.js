// CSP JS Injection
// COPYRIGHT JOE and SAM

// Global Variables

var clipboard_icon = '<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fthin-text-editing%2F24%2Fthin-0254_copy-256.png&f=1&nofb=1" width="12px" height="12px" />';
var hyperlink_icon = `<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmaxcdn.icons8.com%2FShare%2Ficon%2Fp1em%2FVery_Basic%2Fexternal_link1600.png&f=1&nofb=1" width="10px" height="10px" />`;
var profile_requirement = {
    "NON_SSO_MEMBER_REQUIRED" : "Non SSO: Profile Required",
	"NON_SSO_MEMBER_OPTIONAL" : "Non SSO: Profile Optional",
	"NON_SSO_MEMBER_FORBIDDEN" : "Non SSO: Profile Not Allowed",
	"SSO_MEMBER_REQUIRED" : "SSO: Profile Required",
	"SSO_MEMBER_OPTIONAL" : "SSO: Profile Optional",
	"SSO_MEMBER_FORBIDDEN" : "SSO: Profile Not Allowed",
}

var user_info = {
    profile_id : '',
    account_id : '',
    MID : 'None',
    auth_type : '',
    // Instance data - includes the company ID
    instance_data : '',
    // Provided with each API call, token gets filled in
    headers : {
        'Csrf-Token' : '',
        'X-RestLi-Protocol-Version' : '2.0.0',
        'Accept' : 'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
    },
    // profile_data - Includes the profileIdentity
    profile_data : ''
}

const API_URL = 'https://customer.www.linkedin.com/csp-api'

function get_user_information(){
    var url = window.location.href;
    // Set profile_id
    user_info.profile_id = url.substring(Number(url.indexOf("profiles/")) + 9,Number(url.indexOf("/licenses"))); 
    // Set account_id
    user_info.account_id = url.substring(Number(url.indexOf("Account:")) + 8, Number(url.indexOf("/profiles")));

    // Set jsessionID
    document.cookie.split(';').forEach((cookie) => {
        if ( cookie.split('=')[0].trim() == 'JSESSIONID' ){
            user_info.headers['Csrf-Token'] = cookie.split('=')[1].trim().replace(/"/g, '');
        }
    });
    if ( user_info.headers['Csrf-Token'] == '' ) console.log('NO TOKEN')

    // Get profile_data
    user_info.profile_data = api_request(API_URL + `/profiles/($params:(),account:urn%3Ali%3AenterpriseAccount%3A${String(user_info.account_id)}, profileId:${String(user_info.profile_id)})`,
    user_info.headers);

    // If a user doesn't have an Azure email then the parameter isn't provided.
    if(!user_info.profile_data.azureB2CEmailAddress){  
        // Set to None if there isn't one
        user_info.profile_data.azureB2CEmailAddress = "None";
    }

    //
    user_info.instance_data = find_LIL_instance(info);

    // Filling in the MID if a member was found
    if(user_info.profile_data.member){
	    user_info.MID = user_info.profile_data.member.substring(14);
    }

    // Searching for the active LiL instance (if one exists) and recording its profile requirement
    user_info.instance_data.authentications.forEach((auth_type) => {
	if(auth_type.active){
		user_info.auth_type = profile_requirement[auth_type.authenticationType];
	}
    });
}

function api_request(url,headers){
	// Takes a URL and Headers and returns the raw API response
	let d = -1;
	$.ajax({
        url,
        // Async has to be false because each subsequent request depends on the data returned by the one before it
		async: false,
		headers,
		success: function(data){
			d = data;
		},
	});
	return d;
}

function find_LIL_instance(info, step=0){
	var found = false;
	var lil = -1;

	// Iterate through instances looking for an Active Learning instance | Might consider disregarding the status and instead returning all/any LiL instance and displaying their status' 
	api_request(API_URL + `/applicationInstances?account=urn%3Ali%3AenterpriseAccount%3A${String(user_info.account_id)}&count=50&forPreOrder=false&q=account&start=${String(step)}`,info.headers).elements.forEach((instance) => {
		if(instance.enterpriseApplication == "urn:li:enterpriseApplication:learning" && instance.status == "ACTIVE"){
			found = true;
			lil = instance;
		}
	});

	if(!found && step < 250){ // We're only pulling 50 instances per request and some accounts have a LOT of instances. Artificial limit set to 250 to avoid out of control API requests. 
		return find_LIL_instance(info,step+50);
	}else{
		return lil;
	}
}