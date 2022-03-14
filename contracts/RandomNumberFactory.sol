// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "./interfaces/IRandomNumbersCallerContract.sol";

/// @title  A contract that manages random numbers generation
/// @author Knacki
/// @dev    Intended to be used with an oracle
contract RandomNumberFactory is OwnableUpgradeable, AccessControlEnumerableUpgradeable {
  bytes32 private constant ORACLE_ROLE = keccak256("ORACLE");
  bytes32 private constant CALLER_ROLE = keccak256("CALLER");

  event NewRequest(uint requestId);
  event RandomNumberGenerated(uint requestId, uint randomNumber);

  uint private numberOfRequests;
  mapping (uint => uint) private randomNumbers;
  mapping (uint => address) private callerAddresses;

  function initialize() public initializer {
    __Ownable_init_unchained();
    __AccessControlEnumerable_init_unchained();
    numberOfRequests = 0;
  }

  /**
    * @dev Adds an address to the authorized oracles
    */
  function addOracleAddress(address account) external onlyOwner {
    _grantRole(ORACLE_ROLE, account);
  }

  /**
    * @dev Removes an address from the authorized oracles
    */
  function removeOracleAddress(address account) external onlyOwner {
    _revokeRole(ORACLE_ROLE, account);
  }

  /**
    * @dev Adds an address to the authorized caller contracts
    */
  function addCallerAddress(address account) external onlyOwner {
    _grantRole(CALLER_ROLE, account);
  }

  /**
    * @dev Removes an address from the authorized caller contracts
    */
  function removeCallerAddress(address account) external onlyOwner {
    _revokeRole(CALLER_ROLE, account);
  }

  /**
    * @dev Requests a new random number
    */
  function request() external returns (uint) {
    require(hasRole(CALLER_ROLE, _msgSender()), "Access forbidden");

    numberOfRequests++;
    randomNumbers[numberOfRequests] = 0;
    callerAddresses[numberOfRequests] = _msgSender();

    emit NewRequest(numberOfRequests);
    
    return numberOfRequests;
  }

  /**
    * @dev Updates the request with a given random number ;
    *      Sends the randomly generated number back to the caller contract and cleans up storage
    */
  function response(uint requestId, uint randomNumber) external {
    require(hasRole(ORACLE_ROLE, _msgSender()), "Access forbidden");
    require(requestId <= numberOfRequests, "Unknown request id");
    // require(randomNumber >= 1 && randomNumber <= 100, "Random number out of range (should be between 1 and 100)");
    require(randomNumbers[requestId] == 0, "Response already processed");

    randomNumbers[requestId] = randomNumber;

    IRandomNumberCallerContract callerContract = IRandomNumberCallerContract(callerAddresses[requestId]);
    callerContract.randomNumberGeneratorCallback(requestId, randomNumbers[requestId]);

    emit RandomNumberGenerated(requestId, randomNumbers[requestId]);
  }
}