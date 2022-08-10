import React, { useContext, useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { withSnackbar } from "../components/Snackbar";
import {
  Box,
  Divider,
  useMediaQuery,
  Paper,
} from "@mui/material";

import { userContext } from "../Context";
import { claimProperty } from "../utils"

const ClaimDetails = ({place, rentals, ShowMessage}) => {

  async function onClick()
  {
    if(account != null){

      setLoading(true);
  
      const res = await claimProperty(place, provider);  
      
      if(res)
        ShowMessage(`Nice! You just tokenized your first property!!`, "success");
      else
        ShowMessage("Sorry, but this property could not be claimed!", "error");
      
      setClaimable(!res);

      setLoading(false);
    }  
  }

  const { account, provider } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [claimable, setClaimable] = useState(false);

  let isMobile = useMediaQuery("(max-width:850px)");

  useEffect(() => {

    setClaimable(!rentals.find((otherPlace) => (otherPlace.geometry.location.lat === place.geometry.location.lat &&
                                                otherPlace.geometry.location.lng === place.geometry.location.lng)));

  }, [place, rentals])

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
      <LoadingButton
      loading={loading}
      disabled = {!claimable}
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
      <Divider sx={{ mt: 2 }} />
      <Box
      sx={{
          display: "flex",
          flexDirection: "column",
      }}
      >
      <LoadingButton
          fullWidth
          loading={loading}
          disabled = {!claimable}
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
          Claim this property
      </LoadingButton>
      </Box>
  </Box>
  )
}

export default withSnackbar(ClaimDetails);
