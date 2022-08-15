import React, { useContext, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { withSnackbar } from "../components/Snackbar";
import styled from "styled-components";
import {
  InputBase,
  Rating,
  TextField,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { userContext, searchFilterContext } from "../Context";
import { isRentalAvailable, bookRental } from "../utils"

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#EB4E5F",
  },
});

const RentDetails = ({place, ShowMessage}) => {

  async function onClick(){

    if(account != null){

      setLoading(true);
    
      const res = await bookRental(place, checkIn, checkOut, provider);

      if(res)
        ShowMessage(`Nice! You are going to ${place.location_string}!!`, "success");
      else
        ShowMessage("Sorry, but your booking could not be made!", "error");
      
      setAvailable(!res);

      setLoading(false);

      // navigate("/account");  
    }
  }

  const { account, provider } = useContext(userContext);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  let isMobile = useMediaQuery("(max-width:850px)");
  const { checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests } =
    useContext(searchFilterContext);

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

  const [noOfDays, setNoOfDays] = useState();

  //****************************  code for no of days ***********************************
  useEffect(() => {
    async function fetchData() {

      var today = new Date(
        checkIn.split("-")[0],
        checkIn.split("-")[1] - 1,
        checkIn.split("-")[2]
      );

      var date2 = new Date(
        checkOut.split("-")[0],
        checkOut.split("-")[1] - 1,
        checkOut.split("-")[2]
      );

      var timeDiff = Math.abs(date2.getTime() - today.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      setNoOfDays(diffDays);

      if(provider){

        const res = await isRentalAvailable(place.token, (new Date(checkIn)).getTime(), (new Date(checkOut)).getTime(), provider);
        setAvailable(res);
      }
    }
    fetchData();    

  }, [checkIn, checkOut, place, provider]);

  return isMobile ? (
  <Paper
      sx={{
      display: "flex",
      position: "fixed",
      justifyContent: "space-between",
      alignItems: "center",
      bottom: 0,
      width: "100%",
      p: 3,
      ml: -3,
      }}
  >
      <Box style={{ display: "flex" }}>
      {/* <Icon fill="#808080" size={16} svg="matic" /> &nbsp; */}
      {(
          (place.rating ? Number(place.rating) / 50 : 0.07) * noOfDays
      ).toFixed(2)}
      </Box>
      <LoadingButton
      loading={loading}
      disabled = {!available}
      onClick={() => {onClick()}}
      variant="text"
      sx={{
          color: "#fff",
          bgcolor: "#d44957",
          borderRadius: "0.2rem",
          mr: 4,
          ":hover": {
          backgroundColor: "#b4414c",
          },
      }}
      >
      Book Now
      </LoadingButton>
  </Paper>
  ) : (
  <Box sx={styles.card}>
      <Box sx={styles.card_top}>
      <Box display="flex">
          {/* <Icon fill="#808080" size={20} svg="matic" /> */}
          <Box sx={styles.price_div}>
          {place.rating ? Number(place.rating) / 50 : 0.07} / Day
          </Box>
      </Box>
      <Box sx={styles.card_rating}>
          <StyledRating
          name="read-only"
          value={place.rating / 5}
          precision={0.1}
          readOnly
          max={1}
          />
          <span
          style={{
              marginLeft: "5px",
              fontSize: "1rem",
          }}
          >
          {place.rating}
          </span>
          <span
          style={{
              color: "gray",
              marginLeft: "5px",
              fontSize: "0.8rem",
          }}
          >
          ({place.num_reviews} reviews)
          </span>
      </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box sx={styles.description}>
      <Box style={{ display: "flex", flexDirection: "column" }}>
          <Box sx={styles.input}>
          Check-in
          <TextField
              variant="standard"
              type="date"
              fullWidth
              InputProps={{ disableUnderline: true }}
              onChange={(e) => {
              setCheckIn(e.target.value);
              }}
              value={checkIn}
          />
          </Box>
          <Box sx={styles.input}>
          Check Out
          <TextField
              variant="standard"
              type="date"
              fullWidth
              InputProps={{ disableUnderline: true }}
              onChange={(e) => {
              setCheckOut(e.target.value);
              }}
              value={checkOut}
          />
          </Box>
      </Box>
      <Box sx={styles.input}>
          Guests
          <InputBase
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          type="number"
          fullWidth
          inputProps={{ min: 1 }}
          sx={{ padding: "5px" }}
          />
      </Box>
      </Box>
      <Box
      sx={{
          display: "flex",
          flexDirection: "column",
      }}
      >
      <Box
          style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2.75rem",
          marginTop: "1.75rem",
          }}
      >
          <Box style={{ display: "flex" }}>
          {/* <Icon fill="#808080" size={16} svg="matic" /> &nbsp; */}
          {place.rating ? Number(place.rating) / 50 : 0.07} x{" "}
          {noOfDays}
          &nbsp; Days
          </Box>
          <Box style={{ display: "flex" }}>
          {/* <Icon fill="#808080" size={16} svg="matic" /> &nbsp; */}
          {(
              (place.rating ? Number(place.rating) / 50 : 0.07) *
              noOfDays
          ).toFixed(2)}
          </Box>
      </Box>
      <Divider sx={{ mb: "1.75rem" }} />
      <Box
          style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          }}
      >
          <Typography variant="h6" color="initial">
          Total :
          </Typography>
          <Box style={{ display: "flex", alignItems: "center" }}>
          {/* <Icon fill="#808080" size={16} svg="matic" /> &nbsp; */}
          {(
              (place.rating ? Number(place.rating) / 50 : 0.07) *
              noOfDays
          ).toFixed(2)}
          </Box>
      </Box>
      <LoadingButton
          fullWidth
          loading={loading}
          disabled = {!available}
          onClick={() => {onClick()}}
          variant="text"
          sx={{
          color: "#fff",
          bgcolor: "#d44957",
          borderRadius: "0.5rem",
          ":hover": {
              backgroundColor: "#b4414c",
          },
          }}
      >
          Book Now
      </LoadingButton>
      </Box>
  </Box>
  )
}

export default withSnackbar(RentDetails);
