pragma solidity ^0.4.18;

contract Donate {
	address[16] public donors;

	// Adopting a pet
	function donate(uint refugeeId) public returns (uint) {
	  require(refugeeId >= 0 && refugeeId <= 15);

	  donors[refugeeId] = msg.sender;

	  return refugeeId;
	}

	// Retrieving the adopters
	function getDonor() public view returns (address[16]) {
	  return donors;
	}
}