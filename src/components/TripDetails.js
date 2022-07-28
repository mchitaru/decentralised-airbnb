import React, { useState, useContext } from "react";
import { Box, useMediaQuery } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import placeholder from "../images/placeholder.png";
import { withSnackbar } from "../components/Snackbar";

import { userContext } from "../Context";
import { getTripsBalance, cancelBooking } from "../utils"

const TripDetails = ({ trip, setTripsBalance, isMobile, ShowMessage }) => {

  async function onCancelClick(){

    setLoading(true);

    const res = await cancelBooking(trip.place.token, trip.token, provider);

    if(res)
      ShowMessage(`Sad to see you're not going to ${trip.place.location_string} anymore!!`, "success");
    else
      ShowMessage("Sorry, but your booking could not be canceled!", "error");

    setTripsBalance(getTripsBalance());

    setLoading(false);
  }

  const { provider } = useContext(userContext);
  const [loading, setLoading] = useState(false);

  const isSmall = useMediaQuery("(max-width:420px)");

  const styles = {
    rentalDivH: {
      animation: "mymove 5s",
      borderRadius: "20px",
      "@keyframes mymove": {
        from: {
          backgroundColor: "#dddddd",
        },

        to: {
          backgroundColor: "#dddddd00",
        },
      },
    },

    rentalDiv: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      ...(isMobile && {
        flexDirection: "column",
      }),
    },
    rentalImg: {
      height: "200px",
      minWidth: "300px",
      borderRadius: "20px",
      marginRight: "20px",
      ...(isMobile && {
        width: "100%",
        m: 0,
        height: "300px",
      }),
      ...(isSmall && {
        height: "200px",
      }),
    },
    rentalInfo: {
      padding: "10px",
      width: "100%",
    },
    rentalTitle: {
      fontSize: "23px",
      marginBottom: "15px",
      ...(isMobile && {
        fontSize: "18px",
        mb: 1,
      }),
    },
    rentalDesc: {
      color: "gray",
      marginTop: "5px",
      ...(isMobile && {
        fontSize: "14px",
      }),
    },
    bottomButton: {
      marginTop: "20px",
      justifyContent: "space-between",
      display: "flex",
      width: "100%",
      alignItems: "center",
      ...(isMobile && {
        fontSize: "18px",
        mt: 1,
      }),
    },
    price: {
      display: "flex",
      justifyContent: "end",
      gap: "5px",
      color: "#808080",
      fontSize: "12px",
    },
  };

  return (
    <Box>
      <Box sx={styles.rentalDiv}>
        <img
          style={styles.rentalImg}
          src={
            trip.place.photo
              ? trip.place.photo.images.large.url
              : placeholder
          }
          alt="place"
        />
        <Box sx={styles.rentalInfo}>
          <Box sx={styles.rentalTitle}>{trip.place.name}</Box>
          <Box sx={styles.rentalDesc}>
            From <b>{trip.checkIn}</b> to <b>{trip.checkOut}</b>
          </Box>
          <Box sx={styles.rentalDesc}>{trip.place.location_string}</Box>
          <Box sx={styles.bottomButton}>
            <LoadingButton
              loading={loading}
              size="small"
              variant="outlined"
              onClick={() => onCancelClick()}
              sx={{
                color: "#d44957",
                borderColor: "#d44957",
                ":hover": {
                  borderColor: "#d44957",
                },
              }}
            >
              Cancel
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withSnackbar(TripDetails);
