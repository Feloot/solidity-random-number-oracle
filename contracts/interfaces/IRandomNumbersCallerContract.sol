// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

/// @title  An interface for returning the random number to the caller contract
/// @author Knacki
/// @dev    Should be implemented on the caller contract
interface IRandomNumberCallerContract {
  function randomNumberGeneratorCallback(uint requestId, uint randomNumber) external;
}