// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

/// @title  An interface for the contract that manages random numbers generation
/// @author Knacki
/// @dev    Should be implemented on the caller contract
interface IRandomNumberFactory {
  function request() external returns (uint);
}