import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Account from "./pages/Account";

import { getData } from "./api";
import Details from "./pages/Details";
import { userContext, searchFilterContext } from "./Context";
import { getRentals, checkBound } from "./utils"

import { ethers } from 'ethers'
import Web3Modal from "web3modal" 

const App = () => {
  const [bound, setBound] = useState({});
  const [places, setPlaces] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [coordinates, setCoordinates] = useState({});
  const [autocomplete, setAutocomplete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [childClicked, setChildClicked] = useState(null);

  const { destination, setDestination } = useContext(searchFilterContext);
  const { account, setAccount, provider, setProvider } = useContext(userContext);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    setDestination(autocomplete.getPlace().formatted_address);
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    setCoordinates({ lat, lng });
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
    
    async function fetchData() {

      if(provider){
        
        setLoading(true);

        console.log('loading rentals...');
        const _rentals = await getRentals(bound, provider);
        setRentals(_rentals);  

        console.log('loading places...');
        getData(bound, "hotels").then((data) => {
          setPlaces(data?.filter((place) => {
            return place.name &&
              checkBound(place.latitude, place.longitude, bound) &&
              (!_rentals.find((rental) => (rental.latitude === place.latitude && rental.longitude === place.longitude)))
          }));
        });  
        
        setLoading(false);
      }
    }
  
    fetchData();

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
          path="/claims"
          element={
            <Rentals
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
        <Route path="/details" element={<Details />} />
        <Route path="/claim" element={<Details rentals={rentals} />} />
        <Route path="/property" element={<Details />} />
        <Route path="/account" element={<Account />} />
      </Routes>
  );
};

export default App;
