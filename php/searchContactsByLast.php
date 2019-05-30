<?php

	$inData = getRequestInfo();
    
    $contactsArray = array();
	$last = "";
	$first = "";
	$phone = 0;
	$id = 0;
	$errorArray = array();
	$errorArray[] = array("No", "contacts found.", 0, 0);
	
    // connects to database and retrieves data (last, first, phone, id)
	//$conn = new mysqli("localhost", "*** USER NAME ***", "*** PASSWORD ***", "*** DATABASE ***");
	$conn = new mysqli("localhost", "cont8774_Jonas", "dbadmin2231", "cont8774_user_database");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Get data if contact data belongs to user and the "last" row matches the key.
		$sql = "SELECT last, first, phone, id FROM contacts WHERE  last LIKE '%" . $inData["last"] . "%' AND userId= '" . $inData["id"] . "'"; 
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0)
		{
            // Add contact to array.
            while($row = $result->fetch_assoc())
            {
                $last = $row["last"]; 
                $first = $row["first"]; 
                $phone = $row["phone"]; 
                $id = $row["id"];
                
                $contactsArray[] = array($last, $first, $phone, $id);
            }
           
            // This is just a buffer array used for sorting purposes.
            $contactsArrayLowercase = array_map('strtolower', $contactsArray);
            
            // Sort array by last name.
            array_multisort($contactsArrayLowercase, SORT_ASC, SORT_STRING, $contactsArray);

			returnWithInfo($contactsArray);
		}
		
		// no contacts belonging to user in contacts table
		else
		{
			returnWithError( $errorArray );
		}
		$conn->close();
	}
	
	// get json data
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    // send json
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    // return json with error message
	function returnWithError( $err )
	{
		$retValue = json_encode($err);
		sendResultInfoAsJson( $retValue, JSON_FORCE_OBJECT);
	}

    // return json with data
	function returnWithInfo( $dataArray )
	{
		$retValue = json_encode($dataArray, JSON_FORCE_OBJECT);
		sendResultInfoAsJson( $retValue );
	}
	
?>