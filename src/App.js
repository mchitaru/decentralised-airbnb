import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Account from "./pages/Account";

import { getData } from "./api";
import Details from "./pages/Details";
import { searchFilterContext } from "./Context";

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

  useEffect(() => {

    async function fetchData() {
      try{

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const accounts = await provider.listAccounts();  

        setProvider(provider);    
        setAccount(accounts[0]);  

        if (connection) {
          const handleAccountsChanged = (accounts) => {
            setAccount(accounts[0]);
            console.log("account changed...")
          };
      
          const handleChainChanged = (chainId) => {
            console.log("chain changed...")
          };
      
          const handleDisconnect = () => {
            setProvider(null);
            setAccount(null);
            console.log("disconnected...")
          };
      
          connection.on("accountsChanged", handleAccountsChanged);
          connection.on("chainChanged", handleChainChanged);
          connection.on("disconnect", handleDisconnect);
      
          return () => {
            if (connection.removeListener) {
              connection.removeListener("accountsChanged", handleAccountsChanged);
              connection.removeListener("chainChanged", handleChainChanged);
              connection.removeListener("disconnect", handleDisconnect);
            }
          };
        }
    
      }catch(e){
        console.log("Contract call error!");
      }

      console.log('connecting...');
    }

    fetchData();

  }, []);

  useEffect(() => {

    const loadProperties = async () => {

      if(account){
        setIsLoading(true);
  
        const contract = new ethers.Contract(calendarAddress, Calendar.abi, provider.getSigner());
        const balance = ethers.utils.formatUnits(await contract.balanceOf(account), 0);
  
        let tokens = [];
  
        for(let i = 0; i < balance; i++){
  
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const tokenURI = await contract.tokenURI(tokenId);
          const meta = await axios.get(tokenURI);
  
          tokens.push({...meta.data, token: tokenId});
        }
  
        setProperties(tokens);
        setIsLoading(false);

        console.log('loading properties...');
      }
    };

    const loadTrips = async () => {

      if(account){
        setIsLoading(true);
  
        const calendar = new ethers.Contract(calendarAddress, Calendar.abi, provider.getSigner());
        const contract = new ethers.Contract(reservationAddress, Reservation.abi, provider.getSigner());
  
        const balance = ethers.utils.formatUnits(await contract.balanceOf(account), 0);
  
        let tokens = [];
  
        for(let i = 0; i < balance; i++){
  
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const {startTime, stopTime, calendarId} = await calendar.reservationOfOwnerByIndex(account, i);
          const tokenURI = await calendar.tokenURI(calendarId);
          const meta = await axios.get(tokenURI);
  
          const checkIn = Number(ethers.utils.formatUnits(startTime, 0));
          const checkOut = Number(ethers.utils.formatUnits(stopTime, 0));
  
          tokens.push({place: meta.data, token: tokenId, checkIn: new Date(checkIn).toDateString(), checkOut: new Date(checkOut).toDateString()});  
        }
  
        setTrips(tokens);

        setIsLoading(false);

        console.log('loading trips...');

      }
    };  
  
    loadProperties();
    loadTrips();
  }, [account, provider]);

  useEffect(() => {
    setIsLoading(true);
    getData(bound, "hotels").then((data) => {
      setPlaces(data?.filter((place) => {
        return place.name &&
          checkBound(place.latitude, 
            place.longitude,
            bound)
      }));
      setIsLoading(false);
    });
  }, [bound]);

  useEffect(() => {

    const loadRentals = async () => {

      if(provider){
        
        setIsLoading(true);
  
        const contract = new ethers.Contract(calendarAddress, Calendar.abi, provider);
  
        const balance = ethers.utils.formatUnits(await contract.totalSupply(), 0);
    
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
        setIsLoading(false);

        console.log('loading rentals...');

      }else{
        setRentals([]);  
      }
    };
  
    loadRentals();
  }, [bound, account, provider]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            account={account}
            provider={provider}
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
            account={account}
            provider={provider}
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
      <Route 
        path="/details" 
        element={
          <Details 
            account={account}
            provider={provider}
          />
        } 
      />
      <Route 
        path="/claim" 
        element={
          <Details 
            account={account}
            provider={provider}
          />
        } 
      />
      <Route 
        path="/property" 
        element={
          <Details 
            account={account}
            provider={provider}
          />
        } 
      />
      <Route 
        path="/account" 
        element={
          <Account 
            account={account}
            provider={provider}
            trips={trips}
            properties={properties}
            isLoading={isLoading}
          />
        } 
      />
      <Route
        path="/claims"
        element={
          <Rentals
            account={account}
            provider={provider}
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
            onLoad={onLoad}
          />
        }
      />
    </Routes>
  );
};

export default App;
