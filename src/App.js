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
  calendarAddress
} from './artifacts/config' 

import Calendar from './artifacts/contracts/Calendar.sol/Calendar.json'

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
  const [loading, setLoading] = useState(false);
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

  async function cancelBooking (calendarId, reservationId) {

    if(account != null){

      console.log(calendarId);
      console.log(reservationId);

      try{

        const contract = new ethers.Contract(calendarAddress, Calendar.abi, provider.getSigner());

        const transaction = await contract.cancel(calendarId, reservationId);
        await transaction.wait();  

      }catch(e){
        console.log("Error during contract call!")
      }

      // navigate("/account");
    }
  };

  useEffect(() => {

    async function fetchData() {

      console.log('connecting...');

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
    }

    fetchData();

  }, []);

  useEffect(() => {

    const loadProperties = async () => {

      if(account){
  
        setLoading(true);

        console.log('loading properties...');
        
        let tokens = [];

        try{

          const contract = new ethers.Contract(calendarAddress, Calendar.abi, provider.getSigner());
          const balance = ethers.utils.formatUnits(await contract.balanceOf(account), 0);
        
          for(let i = 0; i < balance; i++){
    
            const tokenId = await contract.tokenOfOwnerByIndex(account, i);
            const tokenURI = await contract.tokenURI(tokenId);
            const meta = await axios.get(tokenURI);
    
            tokens.push({...meta.data, token: tokenId});
          }
  
        }catch(e){
          console.log("Contract call error!");
        }
  
        if(tokens.length)
          setProperties(tokens);
        else
          setProperties(null);

        setLoading(false);
      }
    };

    const loadTrips = async () => {

      if(account){
        setLoading(true);

        console.log('loading trips...');
        
        let tokens = [];

        try{

          const contract = new ethers.Contract(calendarAddress, Calendar.abi, provider.getSigner());  
          const balance = ethers.utils.formatUnits(await contract.reservationBalanceOfOwner(account), 0);
        
          for(let i = 0; i < balance; i++){
    
            const {reservationId, startTime, stopTime, calendarId} = await contract.reservationOfOwnerByIndex(account, i);
            const tokenURI = await contract.tokenURI(calendarId);
            const meta = await axios.get(tokenURI);
    
            const checkIn = Number(ethers.utils.formatUnits(startTime, 0));
            const checkOut = Number(ethers.utils.formatUnits(stopTime, 0));
    
            tokens.push({place: meta.data, token: reservationId, checkIn: new Date(checkIn).toDateString(), checkOut: new Date(checkOut).toDateString()});  
          }

        }catch(e){
          console.log("Contract call error!");
        }
  
        if(tokens.length)
          setTrips(tokens);
        else
          setTrips(null);

        setLoading(false);
      }
    };  
  
    loadProperties();
    loadTrips();
  }, [account, provider]);

  useEffect(() => {
    
    function loadPlaces(claims) {

      console.log('loading places...');

      getData(bound, "hotels").then((data) => {
        setPlaces(data?.filter((place) => {
          return place.name &&
            checkBound(place.latitude, place.longitude, bound) &&
            (!claims || !claims.find((claim) => (claim.latitude === place.latitude && claim.longitude === place.longitude)))
        }));
      });
    }

    const loadRentals = async () => {
      if(provider){
        
        setLoading(true);

        console.log('loading rentals...');
        
        let claims = [];
        let tokens = [];

        try{

          const contract = new ethers.Contract(calendarAddress, Calendar.abi, provider);
  
          const balance = ethers.utils.formatUnits(await contract.totalSupply(), 0);
            
          for(let i = 0; i < balance; i++){
      
            const tokenId = await contract.tokenByIndex(i);
            const tokenURI = await contract.tokenURI(tokenId);
            const meta = await axios.get(tokenURI);

            claims.push({...meta.data, token: tokenId});
            
            if(checkBound(meta.data.latitude, 
                          meta.data.longitude,
                          bound)){
    
              tokens.push({...meta.data, token: tokenId});
            }  
          }
  
        }catch(e){
          console.log("Contract call error!");
        }

        setRentals(tokens);  
        
        loadPlaces(claims);

        setLoading(false);

      }else{
        setRentals([]);  
      }
    };
  
    loadRentals();

  }, [bound, provider]);

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
            loading={loading}
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
            places={places}
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
            loading={loading}
            cancelBooking={cancelBooking}
          />
        } 
      />
      <Route
        path="/claims"
        element={
          <Rentals
            account={account}
            provider={provider}
            loading={loading}
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
