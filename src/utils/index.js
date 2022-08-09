import { ethers } from "ethers";
import axios from 'axios'

import { contractAddress } from '../artifacts/config' 
import contractAbi from '../artifacts/contracts/Calendar.sol/Calendar.json'
import { create as ipfsHttpClient } from 'ipfs-http-client'

const ipfsClient = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');


const checkBound = (lat, lng, bound) => {

  return (lat >= bound.sw_lat && lat <= bound.ne_lat &&
    lng >= bound.sw_lng && lng <= bound.ne_lng);
}

async function uploadToIPFS(place) {

  const data = JSON.stringify(place);

  try {
    const added = await ipfsClient.add(data)
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
    return url;
  } catch (error) {
    console.log('Error uploading file: ', error)
  }  

  return '';
}

const isRentalAvailable = async (calendarId, checkIn, checkOut, provider) => {

  let res = false;

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());                
    const available = await contract.isAvailable(calendarId, checkIn, checkOut);  
    
    res = (available);  

  }catch(e){

    res = false;
    console.log("Contract call error!");
  }  

  return res;
}

const getBookingsByCalendar = async (calendarId, provider) => {

  let bookings = [];

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());     
    const balance = ethers.utils.formatUnits(await contract.reservationBalanceOf(calendarId), 0);

    for(let i = 0; i < balance; i++){

      const { reservationId, startTime, stopTime, owner} = await contract.reservationOfCalendarByIndex(calendarId, i);

      // const tokenURI = await contract.tokenURI(calendarId);
      // const meta = await axios.get(tokenURI);

      const checkIn = Number(ethers.utils.formatUnits(startTime, 0));
      const checkOut = Number(ethers.utils.formatUnits(stopTime, 0));

      bookings.push({
        token: reservationId,
        checkIn: checkIn, 
        checkOut: checkOut, 
        owner: owner
      });
    }

  }catch(e){
    console.log("Contract call error!");
  }

  return bookings;
}

const getPropertiesBalance = async (address, provider) => {
  
  let balance = null;

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());
    balance = ethers.utils.formatUnits(await contract.balanceOf(address), 0);
    
  }catch(e){
    console.log("Contract call error!");
  }

  return balance;
}


const getProperties = async (address, provider) => {

  let properties = [];

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());
    const balance = ethers.utils.formatUnits(await contract.balanceOf(address), 0);

    for(let i = 0; i < balance; i++){

      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = await axios.get(tokenURI);

      properties.push({...meta.data, token: tokenId});
    }

  }catch(e){
    console.log("Contract call error!");
  }

  return properties;
}

const getTripsBalance = async (address, provider) => {

  let balance = null;

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());  
    balance = ethers.utils.formatUnits(await contract.reservationBalanceOfOwner(address), 0);

  }catch(e){
    console.log("Contract call error!");
  }

  return balance;
}


const getTrips = async (address, provider) => {

  let trips = [];

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());  
    const balance = ethers.utils.formatUnits(await contract.reservationBalanceOfOwner(address), 0);
  
    for(let i = 0; i < balance; i++){

      const {reservationId, startTime, stopTime, calendarId} = await contract.reservationOfOwnerByIndex(address, i);
      const tokenURI = await contract.tokenURI(calendarId);
      const meta = await axios.get(tokenURI);

      const checkIn = Number(ethers.utils.formatUnits(startTime, 0));
      const checkOut = Number(ethers.utils.formatUnits(stopTime, 0));

      trips.push({place: {token: calendarId, ...meta.data}, token: reservationId, checkIn: new Date(checkIn).toDateString(), checkOut: new Date(checkOut).toDateString()});  
    }

  }catch(e){
    console.log("Contract call error!");
  }

  return trips;
}

const getRentalsBalance = async (bound, provider) => {

  let balance = null;

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider);
    balance = ethers.utils.formatUnits(await contract.totalSupply(), 0);

  }catch(e){
    console.log("Contract call error!");
  }

  return balance;
}

const getRentals = async (bound, provider) => {

  let rentals = [];

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider);
    const balance = ethers.utils.formatUnits(await contract.totalSupply(), 0);
      
    for(let i = 0; i < balance; i++){

      const tokenId = await contract.tokenByIndex(i);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = await axios.get(tokenURI);

      if(checkBound(meta.data.latitude, 
                    meta.data.longitude,
                    bound)){

        rentals.push({...meta.data, token: tokenId});
      }  
    }

  }catch(e){
    console.log("Contract call error!");
  }

  return rentals;
}

const claimProperty = async (place, provider) => {

  let res = false;

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());

    const url = await uploadToIPFS(place);

    // console.log(`Url: ${url}`);

    const transaction = await contract.mint(url);
    const receipt = await transaction.wait();  

    res = (receipt.status === 1);

  }catch(e){
    console.log("Contract call error!");
  }    

  return res;
}

const bookRental = async (place, checkIn, checkOut, provider) => {

  let res = false;

  try{

    const price = ethers.utils.parseEther((Number(place.rating) / 50).toString()); //TO DO: real price

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());

    const transaction = await contract.reserve(place.token, 
                                              (new Date(checkIn)).getTime(), 
                                              (new Date(checkOut)).getTime(), 
                                              price, {value: price});
    const receipt = await transaction.wait();  

    res = (receipt.status === 1);

  }catch(e){
    console.log("Contract call error: " + e);
  }

  return res;
};

const cancelBooking = async  (calendarId, reservationId, provider) => {

  let res = false;

  try{

    const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider.getSigner());

    const transaction = await contract.cancel(calendarId, reservationId);
    const receipt = await transaction.wait();  

    res = (receipt.status === 1)

  }catch(e){
    console.log("Contract call error!");
  }

  return res;
};

export {   
  isRentalAvailable, 
  getPropertiesBalance, 
  getProperties, 
  getTripsBalance,
  getTrips,
  getRentalsBalance,
  getRentals,
  getBookingsByCalendar, 
  claimProperty, 
  bookRental, 
  cancelBooking,
  checkBound 
};