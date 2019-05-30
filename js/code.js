/*

A note from Jonas:
    This is still a work in progress. I have over commented a bit, just to be on the safe side.
    All comments about things that need to be changed will begin and end with three asterisks ***.

*/

// *** Log in requires three attempts to work properly in older version of internet explorer.

var apiUrl  = "http://contactmanager.online/php";
var rootUrl = "http://contactmanager.online";
var dotPhp = ".php";

//var homepages = [ '/', 'index.html', 'i
//var homePage = ['home', 'home.html'];

var userId;
var login = "";
var jsonContacts = "";
var dataArray = [[]]; // stores data for data table
var contactId = 0;

/*
// *** possibly remove this ***
$(document).ready(function(){
    
    // redirects to index if user is not logged in
    //if(window.location.href.indexOf("home") >= 0 && window.name === "")

    // *** this doesn't work properly with old version of internet explorer ***
    if(window.name === '')// && homePage.indexOf(window.location.pathname) >= 0)
    {
        window.location.href = rootUrl + '/index.html';
    }
    
    var loginAndIdBuffer = window.name.split(",");
    login = loginAndIdBuffer[0];
    userId = parseInt(loginAndIdBuffer[1]);

    //document.getElementById("loginNameText").placeholder = login;
    
    if(userId === 0)
        window.location.href = rootUrl + '/index.html', true;
    else
        getContacts();
    //document.getElementById("loginNameText").placeholder = login;
    
    document.getElementById("loginNameText").innerHTML = login;
    
});
*/

// This function updates the loginAndId variable with the user's login and id data.
// It is used to share login and id data between the login page and the home page.
function updateLoginAndUserId()
{
    // redirects to index if user is not logged in
    // *** this doesn't work properly with internet explorer ***
    if(window.name === '')// && homePage.indexOf(window.location.pathname) >= 0)
    {
        //window.location.href = rootUrl + '/index.html';
    }
    
    var loginAndIdBuffer = window.name.split(",");
    login = loginAndIdBuffer[0];
    userId = loginAndIdBuffer[1];
    //var i;
    //document.getElementById("loginNameText").placeholder = login;
    
    if(userId === 0)
        window.location.href = rootUrl + '/index.html', true;
    else
        getContacts();
    //document.getElementById("loginNameText").placeholder = login;
    
    document.getElementById("loginNameText").innerHTML = login;
}

// attempts to log in an existing user
function loginUser()
{
    userId = 0;
    login = "";

    // Get user input values.
    login = document.getElementById("loginNameText").value.trim();
    var password = document.getElementById("loginPasswordText").value.trim();
    
	// login-data json that interfaces with php / api
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = apiUrl + '/loginUser' + dotPhp;

    // Empty inputs are invalid.
    if(login === "" || password === "")
    {
       // document.getElementById("loginUserStatus").innerHTML = "invalid input";
        return false;
    }
	
	//document.getElementById("loginUserStatus").innerHTML = "";

	// http POST : Attempt to send json with login data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		var jsonObject = JSON.parse( xhr.responseText );
		userId = jsonObject.id;
		
		// if userId is still at its initial value, the login has failed.
		if( userId < 1 )
		{
			//document.getElementById("loginUserStatus").innerHTML = "invalid login / password";
			return false;
		}

		document.getElementById("loginNameText").value = "";
		document.getElementById("loginPasswordText").value = "";
		
		// store login and id in new window name to retrieve when needed by new page
        window.name = login + "," + userId;
		window.location.href = rootUrl + '/home.html', true;
	    return true;	
		//document.getElementById("currentUser").innerHTML = login;
	}
	catch(err)
	{
	    return false;
		//document.getElementById("loginUserStatus").innerHTML = err.message;
	}
}

function updateContact()
{
    //document.getElementById("newFirstText").placeholder = "Hello";
    
    // Get user input values.
    var id = contactId;//document.getElementById("updateIdText").value.trim(); // pass this as an argument
    var first = document.getElementById("newFirstText").value.trim();
    var last = document.getElementById("newLastText").value.trim();
    var email = document.getElementById("newEmailText").value.trim();
    var phone = document.getElementById("newPhoneText").value.trim();
    var address = document.getElementById("newAddressText").value.trim();
    
	//document.getElementById("updateContactStatus").innerHTML = "";
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"id" : "' + id + '", "last" : "' + last + '", "first" : "' + first + '", "email" : "' + email + '", "phone" : "' + phone + '", "address" : "' + address + '"}';
	var url = apiUrl + '/updateContact' + dotPhp;
	
	// http POST : Attempt to send json with login data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
        //document.getElementById("updateContactStatus").innerHTML = "Your contact has been updated.";
        getContacts();
        $("#editModal").modal('hide');
	}
	catch(err)
	{
		//document.getElementById("updateContactStatus").innerHTML = err.message;
	}
}

// This function updates jsonContacts with user's contacts.
// The data in jsonContacts is NOT associative. It's indexed with integers.
// For example, this is the data for the first contact in alphabetical order:
// contact 0 (first in alphabetical order)
// _____________________________________________________________________________________   
// | last               | first              | phone              | id (auto increment) |
// | jsonContacts[0][0] | jsonContacts[0][1] | jsonContacts[0][2] | jsonContacts[0][3]  |
// |____________________|____________________|____________________|_____________________|
function getContacts()
{
	//document.getElementById("getContactsStatus").innerHTML = "";
	
	if(userId === 0)
	{
       // document.getElementById("getContactsStatus").innerHTML = "logged out";
	    return;
	}
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + userId + '}';
	var url = apiUrl + '/getContacts' + dotPhp;
	
	// http POST : Attempt to send json with id data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including info for all contacts.
		jsonContacts = JSON.parse( xhr.responseText );
	    
	    // *** These two lines are for testing and debugging only. ***
		//var jsonStr = JSON.stringify(jsonContacts);
		//document.getElementById("getContactsStatus").innerHTML = jsonStr;

	    // *** put this in a function ***
        for(i = 0; i < Object.keys(jsonContacts).length; i++)
        {
            dataArray[i] = jsonContacts[i];
        }
   
        // deletes error contact entry
        if(dataArray[0][0] === "_NO_CONTACTS_ERROR_")
        {
            dataArray.shift();
        }
    
        //var table = $('#example').DataTable();
    
        //$('#example').DataTable.clear().rows.add(dataArray).draw();
        //$('#example').DataTable.rows.add(dataArray);
        //$('#example').DataTable.draw();
        //$('#example').ajax.reload();
        //$('#example').DataTable.draw();
        
        
        //table.clear();
        //table.rows.add(dataArray);
        //table.draw();
        
        ///////////////////////
 
 

        
        ///////////////////////
        
	}
	catch(err)
	{
	    //jsonContacts[[]] = "";
	    //dataArray[[]] = "";
		//document.getElementById("getContactsStatus").innerHTML = err.message;
	}
}

function createTable()
{
     $('#contactsTable').DataTable( {
        data: dataArray,
        columns : [
            { title : "Last" },
            { title : "First" }
        ]
    } );
}

// Gets all info for a contact using the json index, not id value.
// This function is mostly for testing.
// The full contact info is available in the jsonContacts:
// ________________________________________________________________________________________________________________________________
// | last               | first              | phone              | id (auto increment) | email              | address            |
// | jsonContacts[0][0] | jsonContacts[0][1] | jsonContacts[0][2] | jsonContacts[0][3]  | jsonContacts[0][4] | jsonContacts[0][5] |
// |____________________|____________________|____________________|_____________________|____________________|____________________|
function getFullContactInfo(data)
{
    /*
    document.getElementById("getFullContactInfoStatus").innerHTML = "failed to retrieve contacts data";
    var index = parseInt(document.getElementById("contactIndexText").value);
    var fullInfo = JSON.stringify(jsonContacts[index]);
    document.getElementById("getFullContactInfoStatus").innerHTML = fullInfo;
    */
    
    //document.getElementById("testData").innerHTML = data[3];
    //document.getElementById("getFullContactInfoStatus").innerHTML = "failed to retrieve contacts data";
    document.getElementById("newLastText").innerHTML    = data[0];
    document.getElementById("newFirstText").innerHTML   = data[1];
    document.getElementById("newPhoneText").innerHTML   = data[2];
    document.getElementById("newEmailText").innerHTML   = data[4];
    document.getElementById("newAddressText").innerHTML = data[5];

    $('#newLastText').val(data[0]);
    $('#newFirstText').val(data[1]);
    $('#newPhoneText').val(data[2]);
    $('#newEmailText').val(data[4]);
    $('#newAddressText').val(data[5]);
    
    contactId = data[3];
    
    $("#editModal").modal();
    
    //document.getElementById("editModal").style.display = "block";
}

// *** This will be rewritten. ***
function logoutUser()
{
	userId = 0;
	login = "";
	window.name = "";
    window.location.href = rootUrl + '/index.html', true;
	
	//document.getElementById("logoutUserStatus").innerHTML = "logged out";
    //document.getElementById("logoutUserStatus").innerHTML = "";
    //document.getElementById("currentUser").innerHTML = "";
    //document.getElementById("loginNameText").value = "";
    //document.getElementById("loginPasswordText").value = "";
    //jsonContacts = "logged out";
   // hideElement("threeColumns");
   // showElement("loginDiv");
    
}

function isExistingUser(loginString)
{
    
    var jsonPayload = '{"login" : "' + loginString + '"}';
	var url = apiUrl + '/isExistingUser' + dotPhp;
    var userStatus;
    
	//document.getElementById("loginUserStatus").innerHTML = "";

	// http POST : Attempt to send json with login data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		var jsonObject = JSON.parse( xhr.responseText );
		userStatus = jsonObject.userStatus;
		
		// if userId is still at its initial value, the login has failed.
		if( userStatus === "false" )
		{
			//document.getElementById("loginUserStatus").innerHTML = "invalid login / password";
			return false;
		}

		//document.getElementById("loginNameText").value = "";
		//document.getElementById("loginPasswordText").value = "";
		
		// store login and id in new window name to retrieve when needed by new page
		//window.name = login + "," + userId;
		//window.location.href = rootUrl + '/home.html', true;
	    return true;	
		//document.getElementById("currentUser").innerHTML = login;
	}
	catch(err)
	{
	    return false;
		//document.getElementById("loginUserStatus").innerHTML = err.message;
	}


}

// creates a new account
function addUser()
{
    //userId = 0;
    // Get user input for new-account login and pasword.
    login = document.getElementById("loginNameText").value.trim();
    var password = document.getElementById("loginPasswordText").value.trim();
    
    if(login === "" || password === "")
    {
        //document.getElementById("addUserStatus").innerHTML = "invalid input";
        return;
    }
    
    if(isExistingUser(login))
    {
        //document.getElementById("loginNameText").value = "";
		//document.getElementById("loginPasswordText").value = "";
		loginUser();
        return;
    }
    
    /*
    if(loginUser())
    {
        return;
    }
    */
   /* 
    if(isExistingUser())
    {
       loginUser(); 
    }
*/
    // *** We need to salt and hash the password before including it in the json ***
    
	//document.getElementById("addUserStatus").innerHTML = "";

	// login-data json that interfaces with php / api
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = apiUrl + '/addUser' + dotPhp;

	// http POST : Attempt to send json with new-account login and pasword data to server.	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("addUserStatus").innerHTML = "Your new account has been created.";
				//loginUser();
				
                // store login and id in new window name to retrieve when needed by new page
		        //window.name = login + "," + userId;
		        //window.location.href = rootUrl + '/home.html', true;
			}
		};
		xhr.send(jsonPayload);
        loginUser();
	}
	catch(err)
	{
	    //	document.getElementById("addUserStatus").innerHTML = err.message;
	}
}

// creates a new contact
function addContact()
{
    // Get user input information for new-contact.
	// *** We should validate all of these. For example email address should be in the     ***
	// *** form alphanumeric@alphanumeric.alphabetic, and first name should be alphabetic. ***
	var last = document.getElementById("lastText").value.trim();
    var first = document.getElementById("firstText").value.trim();
    var email = document.getElementById("emailText").value.trim();
    var phone = document.getElementById("phoneText").value.trim();
	var address = document.getElementById("addressText").value.trim();
	
	//document.getElementById("addContactStatus").innerHTML = "";
	
	// contact-data json that interfaces with php / api
	var jsonPayload = '{"last" : "' + last + '","first" : "' + first + '", "email" : "' + email + '", "phone" : ' + phone + ', "address" : "' + address + '", "userId" : ' + userId + '}';
	var url = apiUrl + '/addContact' + dotPhp;

	// http POST : Attempt to send json with new-contact data to server.		
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("addContactStatus").innerHTML = "Your new contact has been added.";
                getContacts();
                $("#editModal").modal('hide');
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("addContactStatus").innerHTML = err.message;
	}
}

// This function searches for contacts with matches based on an input string.
// It updates jsonContacts with the contacts with matching "first" rows.
// *** This should be updated to use an argument for the search string. ***
function searchContactsByFirst()
{
    //getContacts();
    document.getElementById("searchContactsByFirstStatus").innerHTML = "";
	
    var firstKey = document.getElementById("firstSearchText").value.trim();
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + userId + ', "first" : "' + firstKey + '"}';
	var url = apiUrl + '/searchContactsByFirst' + dotPhp;
	
	// http POST : Attempt to send json with id and key infomation to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		jsonContacts = JSON.parse( xhr.responseText );

		document.getElementById("searchContactsByFirstStatus").innerHTML = "Matching contact(s) retrieved.";	    

        // These two lines are for testing and debugging only.
		var jsonStr = JSON.stringify(jsonContacts);
		document.getElementById("searchContactsByFirstStatus").innerHTML = jsonStr;
	}
	catch(err)
	{
		document.getElementById("searchContactsByFirstStatus").innerHTML = err.message;
	}
}

// This function searches for contacts with matches based on an input string.
// It updates jsonContacts with the contacts with matching "last" rows.
// *** This should be updated to use an argument for the search string. ***
function searchContactsByLast()
{
    //getContacts();
    document.getElementById("searchContactsByLastStatus").innerHTML = "";
	
    var lastKey = document.getElementById("lastSearchText").value.trim();
	
	// login-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + userId + ', "last" : "' + lastKey + '"}';
	var url = apiUrl + '/searchContactsByLast' + dotPhp;
	
	// http POST : Attempt to send json with login data to server.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

	    // Receive json response, including autoincrement user key (id) value.	
		jsonContacts = JSON.parse( xhr.responseText );

		document.getElementById("searchContactsByLastStatus").innerHTML = "Matching contact(s) retrieved.";
		
        // These two lines are for testing and debugging only.
		var jsonStr = JSON.stringify(jsonContacts);
		document.getElementById("searchContactsByLastStatus").innerHTML = jsonStr;
	}
	catch(err)
	{
		document.getElementById("searchContactsByLastStatus").innerHTML = err.message;
	}
}

// Delete contact with corresponding id.
function deleteContact()
{
	var id = contactId;//document.getElementById("deleteIdText").value.trim(); // *** replace this with an argument ***
	
	// contact-data json that interfaces with php / api
	var jsonPayload = '{"id" : ' + id + '}';
	var url = apiUrl + '/deleteContact' + dotPhp;

    //document.getElementById("deleteContactStatus").innerHTML = "";

	// http POST : Attempt to send json with contact-id data to server.		
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("deleteContactStatus").innerHTML = "Your contact has been deleted.";
                getContacts();
                $("#editModal").modal('hide');
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("deleteContactStatus").innerHTML = err.message;
	}
}

function hideElement(elementId)
{
    document.getElementById( elementId ).style.visibility = "hidden";
	document.getElementById( elementId ).style.display = "none";
}

function showElement(elementId)
{
    document.getElementById( elementId ).style.visibility = "visible";
    //document.getElementById( elementId ).class = show;
	document.getElementById( elementId ).style.display = "block";
}

