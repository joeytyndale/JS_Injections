//JS

var url = new URL(window.location.href);
if(url.searchParams.get('revokeLicense') == "true"){
    var accountId = url.searchParams.get('accountId');
    var profileIdentity = url.searchParams.get('profileIdentity');
    var licenseType = url.searchParams.get('licenseType');
    var companyId = url.searchParams.get('companyId');
    var jsessionid = '';
	document.cookie.split(";").forEach((cookie, index) => {
		if(cookie.split("=")[0].trim() == "JSESSIONID" ){
			jsessionid = cookie.split("=")[1].trim().replace(/"/g,'');
		}
	});


    $.ajax({
		url: 'https://www.linkedin.com/learning-enterprise-api/groupLicenseAssignments/?ids=List((budgetGroup:urn%3Ali%3AenterpriseBudgetGroup%3A%28urn%3Ali%3AenterpriseAccount%3A' + String(accountId) + '%2C8%29,profiles:List(' + String(profileIdentity) + '),licenseType:' + licenseType + '))',
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