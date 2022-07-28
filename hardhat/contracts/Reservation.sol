// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./IERC809.sol";
import "hardhat/console.sol";

contract Reservation is Ownable, IERC809Aux, ERC721Enumerable {

  mapping(uint256 => uint256) public calendarIds;
  mapping(uint256 => uint256) public startTimestamps;
  mapping(uint256 => uint256) public stopTimestamps;

  uint256 nextTokenId;

  constructor() ERC721("Reservation", "REZ") {}

  /// @notice Reserve access to token `_tokenId` from time `_start` to time `_stop`
  /// @dev A successful reservation must ensure each time slot in the range _start to _stop
  ///  is not previously reserved (by calling the function checkAvailable() described below)
  ///  and then emit a Reserve event.
  function reserve(address _to, uint256 _calendarId, uint256 _start, uint256 _stop)
  external
  onlyOwner()
  returns(uint256)
  {
    uint256 tokenId = nextTokenId;
    nextTokenId = SafeMath.add(nextTokenId, 1);

    super._mint(_to, tokenId);

    calendarIds[tokenId] = _calendarId;
    startTimestamps[tokenId] = _start;
    stopTimestamps[tokenId] = _stop;

    emit Creation(_to, _calendarId, tokenId);

    return tokenId;
  }

  function cancel(address _sender, uint256 _tokenId)
  external
  onlyOwner()
  {
    require(_sender == ownerOf(_tokenId), "Not allowed");

    super._burn(_tokenId);

    uint256 calendarId = calendarIds[_tokenId];
    delete calendarIds[_tokenId];
    delete startTimestamps[_tokenId];
    delete stopTimestamps[_tokenId];

    emit Cancellation(_sender, calendarId, _tokenId);
  }
}
