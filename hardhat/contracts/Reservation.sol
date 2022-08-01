// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./IERC809.sol";
import "hardhat/console.sol";

contract Reservation is Ownable, IERC809Aux, ERC721Enumerable {

  uint256 constant public FEE = 1; //1%

  enum EscrowState { Created, Locked, Unlocked, Cancelled }

  struct Escrow {
    uint256         value;
    address payable seller;
    address payable buyer;
    EscrowState     state;
  }

  mapping(uint256 => uint256) public  calendarIds;
  mapping(uint256 => uint256) public  startTimestamps;
  mapping(uint256 => uint256) public  stopTimestamps;
  mapping(uint256 => Escrow)  public  escrows;

  uint256 nextTokenId;

  constructor() ERC721("Reservation", "REZ") {}

  /// @notice Reserve access to token `_tokenId` from time `_start` to time `_stop`
  /// @dev A successful reservation must ensure each time slot in the range _start to _stop
  ///  is not previously reserved (by calling the function checkAvailable() described below)
  ///  and then emit a Reserve event.
  function reserve(address  _seller, 
                    address  _buyer, 
                    uint256 _calendarId, 
                    uint256 _start, 
                    uint256 _stop)
  external
  payable
  onlyOwner
  returns(uint256)
  {
    uint256 tokenId = nextTokenId;
    nextTokenId = SafeMath.add(nextTokenId, 1);

    super._mint(_buyer, tokenId);

    calendarIds[tokenId] = _calendarId;
    startTimestamps[tokenId] = _start;
    stopTimestamps[tokenId] = _stop;
    
    escrows[tokenId].seller = payable(_seller);
    escrows[tokenId].buyer = payable(_buyer);
    escrows[tokenId].value = msg.value;
    escrows[tokenId].state = EscrowState.Locked;

    emit Creation(_buyer, _calendarId, tokenId);

    return tokenId;
  }

  function confirm(address _buyer, uint256 _tokenId)
  external
  onlyOwner
  {
    require(escrows[_tokenId].state == EscrowState.Locked, "Not allowed");
    require(escrows[_tokenId].buyer == _buyer, "Only allowed by buyer");

    uint256 _calendarId = calendarIds[_tokenId];
    // It is important to change the state first because
    // otherwise, the contracts called using `send` below
    // can call in again here.
    escrows[_tokenId].state = EscrowState.Unlocked;
    
    if(escrows[_tokenId].value > 0)
      escrows[_tokenId].seller.transfer(escrows[_tokenId].value);

    emit Confirmation(_buyer, _calendarId, _tokenId);
  }

  function cancel(address _sender, uint256 _tokenId)
  external
  onlyOwner
  {
    require(_sender == ownerOf(_tokenId), "Not allowed");
    require(escrows[_tokenId].state == EscrowState.Locked, "Not allowed");

    escrows[_tokenId].state = EscrowState.Cancelled;

    super._burn(_tokenId);

    uint256 calendarId = calendarIds[_tokenId];
    delete calendarIds[_tokenId];
    delete startTimestamps[_tokenId];
    delete stopTimestamps[_tokenId];

    // We use transfer here directly. It is
    // reentrancy-safe, because it is the
    // last call in this function and we
    // already changed the state.
    if(escrows[_tokenId].value > 0)
      escrows[_tokenId].buyer.transfer(escrows[_tokenId].value);

    emit Cancellation(_sender, calendarId, _tokenId);
  }
}
