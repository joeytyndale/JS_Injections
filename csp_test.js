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
    MID : 'None'
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
    user_info.profile_data = apiRequest(`https://customer.www.linkedin.com/csp-api/profiles/($params:(),account:urn%3Ali%3AenterpriseAccount%3A${String(info.accountId)},profileId:${String(info.profileId)})`,
    user_info.headers);

    // If a user doesn't have an Azure email then the parameter isn't provided.
    if(!user_info.profile_data.azureB2CEmailAddress){  
        // Set to None if there isn't one
        user_info.profile_data.azureB2CEmailAddress = "None";
    }

    //
    user_info.instance_data = findLilInstance(info);

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
