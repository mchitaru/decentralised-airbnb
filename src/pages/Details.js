import { LocalParkingOutlined, MeetingRoomOutlined } from "@mui/icons-material";
import RentDetails from "../components/RentDetails";
import ClaimDetails from "../components/ClaimDetails";
import Calendar from "../components/Calendar"
import placeholder from "../images/placeholder.png";
import { ethers } from "ethers";
import {
  Rating,
  Typography,
  Box,
  Divider,
  Container,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import logo from "../images/airbnbRed.png";
import mobileLogo from "../images/mobileLogoRed.png";
import { useNavigate } from "react-router-dom";

import { create as ipfsHttpClient } from 'ipfs-http-client'

import {
  calendarAddress
} from '../artifacts/config' 

import CalendarABI from '../artifacts/contracts/Calendar.sol/Calendar.json'

const Details = ({account, provider, places}) => {
  const rentalsList = {
    attributes: {
      unoDescription: "2 Guests • 2 Beds • 1 Rooms",
      dosDescription: "Wifi • Kitchen • Living Area",
    },
  };

  function isRent() {
    return window.location.pathname === '/details';
  }

  function isClaim() {
    return window.location.pathname === '/claim';
  }

  function isProperty() {
    return window.location.pathname === '/property';
  }

  let isMobile = useMediaQuery("(max-width:850px)");

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#EB4E5F",
    },
  });

  const navigate = useNavigate();
  const { state: place } = useLocation();
  const [claimable, setClaimable] = useState(false);
  const [available, setAvailable] = useState(false);

  // const contractProcessor = useWeb3ExecuteFunction();


  //***********************************   Styles *****************************************

  const styles = {
    logo: {
      width: "6vw",
      marginRight: "3rem",
      minWidth: "6rem",
      ...(isMobile && {
        minWidth: "0.5rem ",
      }),
    },
    line: {
      borderTop: "1px solid rgb(230, 229, 229)",
      mb: "0px",
    },
    image_div: {
      marginTop: 4,
    },
    card: {
      padding: "1.5rem",

      width: "30%",
      border: "1.5px solid rgb(242, 242, 242)",
      borderRadius: "15px",
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 20px",
      mb: 4,
    },
    card_top: {
      display: "flex",
      marginTop: "1.5rem",
      justifyContent: "space-between",
      alignItems: "center",
    },
    price_div: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "black",
      marginLeft: "10px",
    },
    card_rating: {
      alignItems: "center",
      display: "flex",
    },
    description: {
      mt: 2,
    },
    input: {
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.842)",
      padding: "0.75rem",
      margin: 1,
      height: "2.75rem",
    },
  };

  useEffect(() => {

    if(places){

      setClaimable(places.find((otherPlace) => (otherPlace.latitude === place.latitude &&
                                                  otherPlace.longitude === place.longitude)));
    }

  }, [place, places])

  // ****************** Connecting with Blockchain and functions **************************

  async function uploadToIPFS(place) {

    const data = JSON.stringify(place);

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  

    return '';
  }

  const claimProperty = async (place) => {

    if(account != null){

      setLoading(true);

      const url = uploadToIPFS(place);

      // console.log(`Url: ${url}`);

      try{

        const contract = new ethers.Contract(calendarAddress, CalendarABI.abi, provider.getSigner());
        const transaction = await contract.mint(url);
        await transaction.wait();  

        setClaimable(false);
  
      }catch(e){
        console.log("Error during contract call!")
      }
      
      setLoading(false);
    }
  }

  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

  const [loading, setLoading] = useState(false);
  // const dispatch = useNotification();
  // const handleSuccess = () => {
  // //   dispatch({
  // //     type: "success",
  // //     message: `Nice! You are going to ${place.location_string}!!`,
  // //     title: "Booking Succesful",
  // //     position: "topR",
  // //   });
  // };
  // const handleAccount = () => {
  // //   dispatch({
  // //     type: "error",
  // //     message: "To book a rental you must connect a wallet",
  // //     title: "Connect Your Wallet",
  // //     position: "topR",
  // //   });
  // };

  // const handleError = (msg) => {
  //   // dispatch({
  //   //   type: "error",
  //   //   message: `${msg}`,
  //   //   title: "Booking Failed",
  //   //   position: "topR",
  //   // });
  // };

  const cancelBooking = async (reservationId) => {

    if(account != null){

      setLoading(true);

      try{

        const contract = new ethers.Contract(calendarAddress, CalendarABI.abi, provider.getSigner());

        const transaction = await contract.cancel(place.token, reservationId);
        await transaction.wait();  

      }catch(e){
        console.log("Error during contract call!")
      }
      
      setLoading(false);

      // navigate("/account");
    }
  };

  const bookRental = async (place, checkIn, checkOut) => {

    if(account != null){

      setLoading(true);

      try{

        const contract = new ethers.Contract(calendarAddress, CalendarABI.abi, provider.getSigner());

        const transaction = await contract.reserve(place.token, (new Date(checkIn)).getTime(), (new Date(checkOut)).getTime());
        await transaction.wait();  

        setAvailable(false);

      }catch(e){
        console.log("Error during contract call!")
      }
      
      setLoading(false);

      // navigate("/account");
    }
  };

  return (
    <Box>
      <Container
        sx={{
          minWidth: "xl",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <Box>
          <Link to="/">
            <img
              style={styles.logo}
              src={isMobile ? mobileLogo : logo}
              alt="logo"
            ></img>
          </Link>
        </Box>
        <Box display="flex" alignItems="center">
          {/* <ConnectButton /> */}
          {account && (
            <IconButton
              sx={{ color: "#EB4E5F" }}
              onClick={() => navigate("/account")}
            >
              <PersonIcon />
            </IconButton>
          )}
        </Box>
      </Container>

      <Divider />
      <Container
        sx={{ mt: 2 }}
        // style={{ margin: "0 15vw 0 15vw", marginTop: "2vh" }}
      >
        <Typography variant={isMobile ? "h5" : "h4"}>
          {isRent()?place.autobroaden_label:place.name}
        </Typography>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
            marginTop: 2,
          }}
        >
          <StyledRating
            name="read-only"
            value={Number(place.rating)}
            readOnly
            precision={0.5}
            size="small"
          />
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "15px",
            }}
          >
            {Number(place.rating)}
          </span>
          <span
            style={{ color: "gray", marginLeft: "0.2rem", fontSize: "17px" }}
          >
            ({place.num_reviews} reviews)
          </span>

          <Box
            style={{
              color: "gray",
              marginLeft: "0.75rem",
              fontSize: "17px",
            }}
          >
            {place.location_string.substr(0, 15)}
          </Box>
        </Box>

        <Box sx={styles.image_div}>
          <img
            style={{
              width: "50rem",
              maxHeight: "35rem",
              borderRadius: "15px",
              ...(isMobile && {
                width: "100%",
              }),
            }}
            src={
              place.photo
                ? place.photo.images.original.url
                : placeholder
            }
            alt="place"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "60%",
              ...(isMobile && {
                width: "100%",
                mb: 4,
              }),
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"}>
              {place.name}
            </Typography>
            <Typography variant="body1" color="gray">
              {rentalsList.attributes.unoDescription}
            </Typography>
            <Typography variant="body1" color="gray">
              {rentalsList.attributes.dosDescription}
            </Typography>
            <Divider sx={{ mt: 3, mb: 3 }} />

            <Box display="flex" sx={{ mb: 2 }}>
              <MeetingRoomOutlined />
              <Typography variant="body1" color="initial" sx={{ ml: 2 }}>
                Self check-in
              </Typography>
            </Box>
            <Box display="flex" sx={{ mb: 2 }}>
              <LocalParkingOutlined />
              <Typography variant="body1" color="initial" sx={{ ml: 2 }}>
                Park for free
              </Typography>
            </Box>
            <Divider sx={{ mt: 3, mb: 3 }} />

            <Typography variant="body1" color="black">
              FREE NETFLIX . Private, Cozy, Clean, Comfortable Room <br />
              We offer Weakly and Monthly Discounts
              <br />
              Central A/C and Heat. Flat Screen TV w many free channels. Fast
              WiFi.
            </Typography>
          </Box>
        {(isRent() &&
        <RentDetails 
          account={account}
          provider={provider}
          place={place}
          bookRental={bookRental}
          loading={loading}
          setLoading={setLoading}
          available={available}
          setAvailable={setAvailable}
        />) ||
        (isClaim() &&
        <ClaimDetails 
          account={account}
          provider={provider}
          place={place}
          claimable={claimable}
          claimProperty={claimProperty}
          loading={loading}
          setLoading={setLoading}
        />)||
        (isProperty() &&
        <Calendar 
          account={account}
          provider={provider}
          place={place}
          cancelBooking={cancelBooking}
        />)}
        </Box>
      </Container>
    </Box>
  );
};

export default Details;
