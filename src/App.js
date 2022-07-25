import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";

import { getData } from "./api";
import Details from "./pages/Details";
import { searchFilterContext } from "./Context";
import Trip from "./pages/Trip";

import { ethers } from 'ethers'
import Web3Modal from "web3modal" 
import axios from 'axios'

import {
  calendarAddress, reservationAddress
} from './artifacts/config' 

import Calendar from './artifacts/contracts/Calendar.sol/Calendar.json'
import Reservation from './artifacts/contracts/Reservation.sol/Reservation.json'


const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [bound, setBound] = useState({});
  const [places, setPlaces] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [properties, setProperties] = useState([]);
  const [trips, setTrips] = useState([]);

  const [coordinates, setCoordinates] = useState({});
  const [autocomplete, setAutocomplete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [childClicked, setChildClicked] = useState(null);

  const { destination, setDestination } = useContext(searchFilterContext);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    setDestination(autocomplete.getPlace().formatted_address);
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    setCoordinates({ lat, lng });
  };

  function checkBound(lat, lng, bound) {

    return (lat >= bound.sw_lat && lat <= bound.ne_lat &&
      lng >= bound.sw_lng && lng <= bound.ne_lng);
  }

  const loadRentals = async () => {

    if(provider){

      const contract = new ethers.Contract(calendarAddress, Calendar.abi, provider);

      const balance = await contract.totalSupply();
  
      let tokens = [];
  
      for(let i = 0; i < balance; i++){
  
        const tokenId = await contract.tokenByIndex(i);
        const tokenURI = await contract.tokenURI(tokenId);
        const meta = await axios.get(tokenURI);

        if(checkBound(meta.data.latitude, 
                      meta.data.longitude,
                      bound)){

          tokens.push({...meta.data, token: tokenId});
        }  
      }
  
      setRentals(tokens);  
    }else{
      setRentals([]);  
    }
  };

  const loadProperties = async () => {

    if(account != null){

      const contract = new ethers.Contract(calendarAddress, Calendar.abi, account);
      const address = await account.getAddress();

      const balance = ethers.utils.formatUnits(await contract.balanceOf(address));

      let tokens = [];

      for(let i = 0; i < balance; i++){

        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const tokenURI = await contract.tokenURI(tokenId);
        const meta = await axios.get(tokenURI);

        tokens.push({...meta.data, token: tokenId});
      }

      setProperties(tokens);
    }
  };

  const loadTrips = async () => {

    if(account != null){

      const calendar = new ethers.Contract(calendarAddress, Calendar.abi, account);
      const contract = new ethers.Contract(reservationAddress, Reservation.abi, account);
      const address = await account.getAddress();

      const balance = ethers.utils.formatUnits(await contract.balanceOf(address), 0);

      let tokens = [];

      for(let i = 0; i < balance; i++){

        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const {reservationId, startTime, stopTime, calendarId} = await calendar.reservationOfOwnerByIndex(address, i);
        const tokenURI = await calendar.tokenURI(calendarId);
        const meta = await axios.get(tokenURI);

        const checkIn = Number(ethers.utils.formatUnits(startTime, 0));
        const checkOut = Number(ethers.utils.formatUnits(stopTime, 0));

        tokens.push({...meta.data, token: tokenId, checkIn: new Date(checkIn).toDateString(), checkOut: new Date(checkOut).toDateString()});  
      }

      setTrips(tokens);
    }
  };

  useEffect(async () => {

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    setProvider(provider);
    setAccount(provider.getSigner());

  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadProperties();
    loadTrips();
    setIsLoading(false);
  }, [account]);

  useEffect(() => {
    setIsLoading(true);
    getData(bound, "hotels").then((data) => {
      setPlaces(data?.filter((place) => place.name));
      setIsLoading(false);
    });
  }, [bound]);

  useEffect(() => {
    setIsLoading(true);
    loadRentals();
    setIsLoading(false);
  }, [bound, provider]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            destination={destination}
          />
        }
      />
      <Route
        path="/rentals"
        element={
          <Rentals
            isLoading={isLoading}
            autocomplete={autocomplete}
            bound={bound}
            setAutocomplete={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
            places={rentals}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setBound={setBound}
            childClicked={childClicked}
            setChildClicked={setChildClicked}
          />
        }
      />
      <Route path="/details" element={<Details />} />
      <Route path="/wrap" element={<Details />} />
      <Route path="/trip" element={<Trip trips={trips}/>} />
      <Route
        path="/properties"
        element={
          <Rentals
            isLoading={isLoading}
            autocomplete={autocomplete}
            setAutocomplete={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
            places={properties}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setBound={setBound}
            childClicked={childClicked}
            setChildClicked={setChildClicked}
          />
        }
      />
      <Route
        path="/wraps"
        element={
          <Rentals
            isLoading={isLoading}
            autocomplete={autocomplete}
            setAutocomplete={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
            places={places}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setBound={setBound}
            childClicked={childClicked}
            setChildClicked={setChildClicked}
          />
        }
      />
    </Routes>
  );
};

export default App;
