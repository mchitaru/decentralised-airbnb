// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./treemap/TreeMap.sol";
import "./Reservation.sol";
import "./IERC809.sol";
import "hardhat/console.sol";

contract Calendar is IERC809, Ownable, Pausable, ERC721Enumerable, ERC721URIStorage {
  using TreeMap for TreeMap.Map;

  // limit reservation duration to 7 days because we do not have spam protection yet
  uint256 constant public RESERVATION_DURATION_LIMIT = 168 hours * 1000;

  // mapping of token(calendar) id to mapping from start/end timestamp of a reservation to its id
  mapping(uint256 => TreeMap.Map) public startTimestampsMap;
  
  address public reservationContract;  // address of the ERC721 contract tokenizing reseravation/access of this contract's token

  constructor() ERC721("Calendar", "CAL") {
    reservationContract = address(new Reservation());
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) 
  internal
  override(ERC721, ERC721Enumerable) 
  {
      super._beforeTokenTransfer(from, to, tokenId);
  }
  
  function supportsInterface(bytes4 interfaceId)
  public
  view
  override(ERC721, ERC721Enumerable, IERC165)
  returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

  function _burn(uint256 _tokenId)
  internal
  whenNotPaused()
    override(ERC721, ERC721URIStorage)
  {
    require(msg.sender == ownerOf(_tokenId), "Not allowed");

    super._burn(_tokenId);
  } 

  function tokenURI(uint256 tokenId)
  public 
  view 
  override(ERC721, ERC721URIStorage) 
  returns (string memory) 
  {    
    return super.tokenURI(tokenId);
  }

  /// @notice Create a new calendar token
  function mint(string memory _tokenURI)
  public
  whenNotPaused()
  returns(uint256)
  {
    uint256 _tokenId = totalSupply();
    super._mint(msg.sender, _tokenId);
    super._setTokenURI(_tokenId, _tokenURI);

    return _tokenId;
  }

  /// @notice Destroy a calendar token
  /// TODO: figure out what to do when there are expired and/or outstanding reservations
  function burn(uint256 _tokenId)
  public
  whenNotPaused()
  {
    require(msg.sender == ownerOf(_tokenId), "Not allowed");

    _burn(_tokenId);
  }

  /// @notice Query if token `_tokenId` if available to reserve between `_start` and `_stop` time
  /// @dev For the requested token, we examine its current resertions, check
  ///   1. whether the last reservation that has `startTime` before `_start` already ended before `_start`
  ///                Okay                            Bad
  ///           *startTime*   stopTime        *startTime*   stopTime
  ///             |---------|                  |---------|
  ///                          |-------               |-------
  ///                          _start                 _start
  ///   2. whether the soonest reservation that has `endTime` after `_end` will start after `_end`.
  ///                Okay                            Bad
  ///          startTime   *stopTime*         startTime   *stopTime*
  ///             |---------|                  |---------|
  ///    -------|                           -------|
  ///           _stop                              _stop
  ///
  //   NB: reservation interval are [start time, stop time] i.e. closed on both ends.
  function isAvailable(uint256 _tokenId, uint256 _start, uint256 _stop)
  public
  view
  returns(bool)
  {
    require(_stop > _start, "Stop must ends after start");
    require(_stop - _start <= RESERVATION_DURATION_LIMIT, "Reservation duration must not exceed limit");

    bool found;
    uint256 reservationId;
    uint256 startTime;

    // find closest event that started after _start
    (found, startTime, reservationId) = startTimestampsMap[_tokenId].ceilingEntry(_start);
    if (found && _stop > startTime) {
      return false;
    }

    // find closest event that started before _start
    (found, startTime, reservationId) = startTimestampsMap[_tokenId].floorEntry(_start);
    if (found) {
      Reservation reservation = Reservation(reservationContract);
      if (reservation.stopTimestamps(reservationId) > _start) {
        return false;
      }
    }

    return true;
  }

  /// @notice Reserve access to token `_tokenId` from time `_start` to time `_stop`
  /// @dev A successful reservation must ensure each time slot in the range _start to _stop
  ///  is not previously reserved.
  function reserve(uint256 _tokenId, uint256 _start, uint256 _stop, uint256 _rate)
  public
  payable
  whenNotPaused()
  returns(uint256)
  {
    console.log("Msg value: %d", msg.value);

    require(_exists(_tokenId), "Calendar does not exist");
    require(isAvailable(_tokenId, _start, _stop), "Token is unavailable during this time period");

    uint256 nights = SafeMath.div(SafeMath.sub(_stop,_start), SafeMath.mul(24 hours, 1000));
    uint256 value = SafeMath.mul(_rate, nights);
    console.log("Value: %d", value);
    require(msg.value >= value, "The amount is too low");
    
    Reservation reservation = Reservation(reservationContract);
    uint256 reservationId = reservation.reserve{value: msg.value}(ownerOf(_tokenId), 
                                                                  msg.sender, 
                                                                  _tokenId, 
                                                                  _start, 
                                                                  _stop);

    startTimestampsMap[_tokenId].put(_start, reservationId);

    return reservationId;
  }

  /// @notice Cancel all reservations for `_tokenId` between `_start` and `_stop`
  /// @return number of reservation that has been cancelled
  function cancelAll(uint256 _tokenId, uint256 _start, uint256 _stop)
  public
  whenNotPaused()
  returns (uint256)
  {
    require(_exists(_tokenId), "Calendar does not exist");

    // TODO: implement iterator in TreeMap for more efficient batch removal
    TreeMap.Map storage startTimestamps = startTimestampsMap[_tokenId];
    Reservation reservation = Reservation(reservationContract);

    bool found = true;
    uint256 startTime = _start;
    uint256 stopTime;
    uint256 reservationId;
    uint256 cancelled = 0;
    // FIXME: a token could also have a `renter => startTimestamps` mapping to skip
    //   reservations that don't belong to a renter more efficiently
    (found, startTime, reservationId) = startTimestamps.ceilingEntry(startTime);
    while (found) {
      stopTime = reservation.stopTimestamps(reservationId);
      if (stopTime <= _stop && reservation.ownerOf(reservationId) == msg.sender) {
        reservation.cancel(msg.sender, reservationId);
        startTimestamps.remove(startTime);

        cancelled++;
      }

      (found, startTime, reservationId) = startTimestamps.higherEntry(startTime);
    }

    return cancelled;
  }

  /// @notice Cancel reservation `_reservationId` for calendar `_tokenId`
  function cancel(uint256 _tokenId, uint256 _reservationId)
  public
  whenNotPaused()
  {
    require(_exists(_tokenId), "Calendar does not exist");

    Reservation reservation = Reservation(reservationContract);

    uint256 startTime = reservation.startTimestamps(_reservationId);
    uint256 calendarId = reservation.calendarIds(_reservationId);
    if (calendarId != _tokenId) {
      revert("Calendar id is invalid");
    }

    reservation.cancel(msg.sender, _reservationId);

    TreeMap.Map storage startTimestamps = startTimestampsMap[_tokenId];
    startTimestamps.remove(startTime);
  }

  /// @notice Find the owner of the reservation that overlaps `_timestamp` for the calendar `_tokenId`
  function renterOf(uint256 _tokenId, uint256 _timestamp)
  public
  view
  returns (address addr)
  {
    TreeMap.Map storage startTimestamps = startTimestampsMap[_tokenId];

    // find the last reservation that started before _timestamp
    bool found;
    uint256 startTime;
    uint256 reservationId;
    (found, startTime, reservationId) = startTimestamps.floorEntry(_timestamp);

    if (found) {
      Reservation reservation = Reservation(reservationContract);
      // verify the reservation ends after _timestamp
      if (reservation.stopTimestamps(reservationId) >= _timestamp) {
        return reservation.ownerOf(reservationId);
      }
    }
  }

  /// @notice Count all reservations for an calendar
  function reservationBalanceOf(uint256 _tokenId)
  public
  view
  returns (uint256)
  {
    return startTimestampsMap[_tokenId].size();
  }

  /// @notice Count all reservations for an calendar
  function reservationBalanceOfOwner(address owner)
  public
  view
  returns (uint256)
  {
    Reservation reservation = Reservation(reservationContract);

    return reservation.balanceOf(owner);
  }

  /// @notice Get reservation details for a calendar by index
  function reservationOfCalendarByIndex(uint256 _tokenId, uint256 _index)
  public
  view
  returns (uint256 reservationId, uint256 startTime, uint256 stopTime, address owner)
  {
    bool found;
    (found, startTime, reservationId) = startTimestampsMap[_tokenId].select(_index);
    require(found, "Reservation index out of bound");

    Reservation reservation = Reservation(reservationContract);
    stopTime = reservation.stopTimestamps(reservationId);
    owner = reservation.ownerOf(reservationId);
  }

  /// @notice Get reservation details for an account by index
  function reservationOfOwnerByIndex(address _owner, uint256 _index)
  public
  view
  returns (uint256 reservationId, uint256 startTime, uint256 stopTime, uint256 calendarId)
  {
    Reservation reservation = Reservation(reservationContract);

    reservationId = reservation.tokenOfOwnerByIndex(_owner, _index);
    startTime = reservation.startTimestamps(reservationId);
    stopTime = reservation.stopTimestamps(reservationId);
    calendarId = reservation.calendarIds(reservationId);
  }
}
