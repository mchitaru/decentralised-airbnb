// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Escrow {
  
  uint256 constant public FEE = 1; //1%

  uint256 public          value;
  address payable public  seller;
  address payable public  buyer;

  enum State { Created, Locked, Unlocked, Cancelled }
  // The state variable has a default value of the first member, `State.created`
  State public state;

  /// Only the buyer can call this function.
  error OnlyBuyer();
  /// Only the seller can call this function.
  error OnlySeller();
  /// The function cannot be called at the current state.
  error InvalidState();

  modifier onlyBuyer() {
    if (msg.sender != buyer)
        revert OnlyBuyer();
    _;
  }

  modifier onlySeller() {
    if (msg.sender != seller)
        revert OnlySeller();
    _;
  }

  modifier inState(State state_) {
    if (state != state_)
        revert InvalidState();
    _;
  }

  event EscrowCancelled();
  event EscrowLocked();
  event EscrowUnlocked();

  constructor() {}

  /// Cancel the purchase and reclaim the ether.
  /// Can only be called by the seller
  function cancel()
    external
    onlySeller
    inState(State.Locked)
  {
    emit EscrowCancelled();
    state = State.Cancelled;
    // We use transfer here directly. It is
    // reentrancy-safe, because it is the
    // last call in this function and we
    // already changed the state.
    buyer.transfer(value);
  }

  /// Confirm the purchase as buyer.
  function lock(uint256 _value, address payable _seller, address payable _buyer)
    external
    inState(State.Created)
    payable
  {      
    emit EscrowLocked();

    seller = payable(_seller);
    buyer = payable(_buyer);
    value = _value;
    state = State.Locked;
  }

  /// Confirm that you (the buyer) received the item.
  /// This will release the locked ether.
  function unlock()
    external
    onlyBuyer
    inState(State.Locked)
  {
    emit EscrowUnlocked();
    // It is important to change the state first because
    // otherwise, the contracts called using `send` below
    // can call in again here.
    state = State.Unlocked;

    seller.transfer(value);
  }
}