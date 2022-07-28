import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Container,
  Divider,
  useMediaQuery,
  Typography,
  Tabs,
  Tab,
  Button
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import PlaceDetails from "../components/PlaceDetails";
import TripDetails from "../components/TripDetails";

import logo from "../images/airbnbRed.png";
import mobileLogo from "../images/mobileLogoRed.png";
import { getProperties, getTrips } from "../utils"
import { userContext } from "../Context";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function Account() {

  let isMobile = useMediaQuery("(max-width:850px)");
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
  };

  const activeTab = localStorage.getItem("account-tabs");

  const navigate = useNavigate();

  const { account, provider } = useContext(userContext);
  const [value, setValue] = useState(activeTab?Number(activeTab):0);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripsBalance, setTripsBalance] = useState(null);

  const handleChange = (event, newValue) => {

    setValue(newValue);
    localStorage.setItem("account-tabs", newValue);
  };

  useEffect(() => {

    async function fetchData() {

      if(account){
    
        setLoading(true);

        console.log('loading properties...');
        const _properties = await getProperties(account, provider);
        setProperties(_properties.length?_properties:null);

        console.log('loading trips...');
        const _trips = await getTrips(account, provider);
        setTrips(_trips.length?_trips:null);

        setLoading(false);
      }
    }
  
    fetchData();
  }, [account, provider, tripsBalance])

  return (
    <Box sx={{ width: '100%' }}>
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
        </Box>
      </Container>
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Trips" {...a11yProps(0)} />
          <Tab label="Properties" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>        
        <Container sx={{minWidth:"xl"}}>
          {loading ? (
            <ReactLoading
              type="bubbles"
              color="  #EB4E5F"
              height={200}
              width={100}
            />
          ) : trips ? (
            <Box sx={{ mt: "2rem" }}>
                {trips?.map((trip, i) => (
                  <Box key={i}>
                    <Divider sx={{ margin: "30px 0px" }} />
                    <Box>
                      <TripDetails
                        trip={trip}
                        setTripsBalance={setTripsBalance}
                        isMobile={isMobile}
                      />
                    </Box>              
                  </Box>              
                ))}
            </Box>
          ) : (
            <Box sx={{ mt: "2rem", mb: "2rem" }}>
              <Typography variant="h5" color="initial" gutterBottom>
                No trips booked ... yet!
              </Typography>
              <Typography variant="subtitle1" color="gray" gutterBottom>
                Time to dust off your bags and start planning your next adventure
              </Typography>
              <Button
                onClick={() => navigate("/")}
                variant="outlined"
                sx={{
                  color: "#d44957",
                  borderColor: "#d44957",
                  ":hover": {
                    borderColor: "#d44957",
                  },
                }}
              >
                Start Searching
              </Button>
            </Box>
          )}
        </Container>        
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Container sx={{minWidth:"xl"}}>
          {loading ? (
            <ReactLoading
              type="bubbles"
              color="  #EB4E5F"
              height={200}
              width={100}
            />
          ) : properties ? (
            <Box sx={{ mt: "2rem" }}>
                {properties?.map((place, i) => (              
                  <Box key={i}>
                    <Divider sx={{ margin: "30px 0px" }} />
                    <Box>
                        <PlaceDetails
                          selected={false}
                          place={place}
                          isMobile={isMobile}
                        />
                    </Box>
                  </Box>
                ))}
            </Box>
          ) : (
            <Box sx={{ mt: "2rem", mb: "2rem" }}>
              <Typography variant="h5" color="initial" gutterBottom>
                No properties claimed ... yet!
              </Typography>
              <Typography variant="subtitle1" color="gray" gutterBottom>
                Time to claim your first property and start earning
              </Typography>
              <Button
                onClick={() => navigate("/claims")}
                variant="outlined"
                sx={{
                  color: "#d44957",
                  borderColor: "#d44957",
                  ":hover": {
                    borderColor: "#d44957",
                  },
                }}
              >
                Claim property
              </Button>
            </Box>
          )}
        </Container>        
      </TabPanel>
    </Box>
  );
}
