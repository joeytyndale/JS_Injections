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

