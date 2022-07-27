// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

/// @title ERC809: a standard interface for rentable rival non-fungible tokens.
interface IERC809 is IERC721Enumerable {
  // address of the ERC721 contract tokenizing reseravation/access of this contract's token

  /// @notice Find the renter of an NFT token as of `_time`
  /// @dev The renter is who made a reservation on `_tokenId` and the reservation spans over `_time`.
  function renterOf(uint256 _tokenId, uint256 _time) external view returns (address);

  /// @notice Query if token `_tokenId` if available to reserve between `_start` and `_stop` time
  function isAvailable(uint256 _tokenId, uint256 _start, uint256 _stop) external view returns (bool);

  /// @notice Cancel reservation for `_tokenId` between `_start` and `_stop`
  /// @dev All reservations between `_start` and `_stop` are cancelled. `_start` and `_stop` do not guarantee
  //   to be the ends for any one of the reservations
  function cancelAll(uint256 _tokenId, uint256 _start, uint256 _stop) external returns (uint256);

  /// @notice Cancel a single reservation for `_tokenId`
  function cancel(uint256 _tokenId, uint256 _reservationId) external;
}


/// @title ERC809Aux: an auxiliary ERC809 token representing access to a ERC809.
interface IERC809Aux is IERC721Enumerable {
  // address of the parent ERC721 contract whose tokens are open for access

  /// @dev This emits when a successful reservation is made for accessing any NFT.
  event Creation(address indexed _renter, uint256 _calendarId, uint256 _tokenId);

  /// @dev This emits when a successful cancellation is made for a reservation.
  event Cancellation(address indexed _renter, uint256 _calendarId, uint256 _tokenId);
}
