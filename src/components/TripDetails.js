import React from "react";
// import { Icon } from "web3uikit";
import { Link } from "react-router-dom";
import { Rating, Button, Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import { Divider } from "antd";

const TripDetails = ({ selected, trip, refProp, isMobile }) => {
  const isSmall = useMediaQuery("(max-width:420px)");
  const rentalsList = {
    attributes: {
      unoDescription: "2 Guests • 2 Beds • 1 Rooms",
      dosDescription: "Wifi • Kitchen • Living Area",
    },
  };

  if (selected) {
    refProp?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#EB4E5F",
    },
  });

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
    <Box sx={selected && styles.rentalDivH}>
      <Box sx={styles.rentalDiv}>
        <img
          style={styles.rentalImg}
          src={
            trip.place.photo
              ? trip.place.photo.images.large.url
              : "https://imgs.search.brave.com/eoIZlg2L0ttNGXCr45Nq_l3TtsSqY7MQ3YlS5n6jIqs/rs:fit:789:883:1/g:ce/aHR0cHM6Ly9sZWlm/ZXJwcm9wZXJ0aWVz/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/Tk8tSU1BR0UtQVZB/SUxBQkxFLmpwZw"
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
