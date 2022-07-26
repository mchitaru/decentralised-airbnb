import React from "react";
// import { Icon } from "web3uikit";
import { Link } from "react-router-dom";
import { Button, Box, useMediaQuery } from "@mui/material";
import placeholder from "../images/placeholder.png";

const TripDetails = ({ trip, isMobile }) => {
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
            <Link
              to="/trip"
              style={{ textDecoration: "none" }}
              state={trip}
            >
              <Button
                size="small"
                variant="outlined"
                sx={{
                  color: "#d44957",
                  borderColor: "#d44957",
                  ":hover": {
                    borderColor: "#d44957",
                  },
                }}
              >
                "Details"
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TripDetails;
