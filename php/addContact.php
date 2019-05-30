<?php
	$inData = getRequestInfo();
	
	$last = $inData["last"];
	$first = $inData["first"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$address = $inData["address"];
	$userId = $inData["userId"];

    // connects to database and inserts new contact data into contacts table
    //$conn = new mysqli("localhost", "*** USER NAME ***", "*** PASSWORD ***", "*** DATABASE ***");
	$conn = new mysqli("localhost", "cont8774_Jonas", "dbadmin2231", "cont8774_user_database");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT INTO contacts (last, first, email, phone, address, userId) VALUES ('" . $last . "','" . $first . "','" . $email . "'," . $phone . ",'" . $address . "'," . $userId . ")";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>