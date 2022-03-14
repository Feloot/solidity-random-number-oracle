// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IRandomNumberFactory.sol";

/// @title  A test contract to show how to use RandomNumberFactory
/// @author Knacki
/// @dev    -
contract TestContract is OwnableUpgradeable {
  event NewRandomNumberRequest(uint requestId);
  
  mapping (uint => uint) public rngRequestsToNumbers;

  address private randomNumberFactoryAddress;

  function initialize() public initializer {
    __Ownable_init_unchained();
  }

  modifier onlyRandomNumberFactory {
    require(msg.sender == randomNumberFactoryAddress, "Access forbidden");
    _;
  }

  /**
    * @dev Sets the RandomNumberFactory contract address
    */
  function setRandomNumberFactoryAddress (address _randomNumberFactoryAddress) external onlyOwner {
    randomNumberFactoryAddress = _randomNumberFactoryAddress;
  }

  /**
    * @dev Requests a new random number and returns the requestId
    */
  function requestRandomNumber () external {
    uint requestId = IRandomNumberFactory(randomNumberFactoryAddress).request();
    emit NewRandomNumberRequest(requestId);
  }

  /**
    * @dev Random number generator callback
    */
  function randomNumberGeneratorCallback (uint _requestId, uint _randomNumber) external onlyRandomNumberFactory {
    rngRequestsToNumbers[_requestId] = _randomNumber;
  }
}