// Script to run in Inspector and look for enterprise licenses. 

// Grab MID
$(document).ready(() => {
	var url = document.location.href;
    var mid = url.substring((url.indexOf('members/') + 8)).split('/')[0]
    var profileId = "";
    var accountId = "";

    console.log(mid);
    

    $.ajax({
        url: "https://cstool.www.linkedin.com/cstool/members/" + String(mid) + "/enterpriseLicenses?memberId=" + String(mid),
        success: function(data){
            console.log(data);

            data.forEach((license, index) => {
                if(license.applicationName == "learning"){
                    console.log(license);

                    profileId = license.profileId;
                    accountId = license.accountId;

                    var profileURL = "https://customer.www.linkedin.com/support/account/urn:li:enterpriseAccount:" + accountId + "/profiles/" + profileId + "/licenses";

                    var profileButton = document.createElement("A");
                    profileButton.innerHTML = `${license.companyName} (${accountId})`;
                    profileButton.setAttribute("href",profileURL);
                    profileButton.setAttribute("target","_blank");

                    var blockTitle = document.createElement("DT");
                    blockTitle.innerHTML = "&#9939;";
                    blockTitle.setAttribute("style","text-overflow:clip");
                    
                    var blockContent = document.createElement("DD");
                    blockContent.appendChild(profileButton);


                    $('.member-details')[0].append(blockTitle);
                    $('.member-details')[0].append(blockContent);
                }
            })
        }
    });
});
