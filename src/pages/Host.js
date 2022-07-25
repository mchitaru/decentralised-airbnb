import {
    Box,
    Container,
    Divider,
    useMediaQuery,
    Typography,
    Button,
    Grid,
  } from "@mui/material";

  import ReactLoading from "react-loading";
  import React, { useEffect, useState } from "react";
  // import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
  import { Link, useNavigate } from "react-router-dom";
  // import { ConnectButton } from "web3uikit";
  import logo from "../images/airbnbRed.png";
  import mobileLogo from "../images/mobileLogoRed.png";

  import { ethers } from 'ethers'
  import Web3Modal from "web3modal" 
  import axios from 'axios'

  import {
    marketplaceAddress
  } from '../artifacts/config' 
  
  import Calendar from '../artifacts/contracts/Calendar.sol/Calendar.json'

  const Host = () => {
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
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [account, setAccount] = useState(null);
    const contractProcessor = null;//useWeb3ExecuteFunction();
    const createProperty = async () => {

      if(account != null){

        const contract = new ethers.Contract(marketplaceAddress, Calendar.abi, account);
        await contract.mint("https://pinepipe.com/wp-content/uploads/2020/11/1.-Client-1.png");
      }
    }
    const loadProperties = async () => {

      if(account != null){

        const contract = new ethers.Contract(marketplaceAddress, Calendar.abi, account);
        const address = await account.getAddress();

        const balance = await contract.balanceOf(address);

        console.log(`Balance: ${balance}`);

        let tokens = [];

        for(let i = 0; i < balance; i++){

          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const tokenURI = await contract.tokenURI(tokenId);
          //const meta = await axios.get(tokenURI);

          tokens.push({id:ethers.utils.formatUnits(tokenId, 0), uri: tokenURI});
        }

        setProperties(tokens);
  
        console.log(`TokenIds: ${tokens}`);
        // const items = await Promise.all(data.map(async i => {
        //   const tokenURI = await contract.tokenURI(i.tokenId)
        //   const meta = await axios.get(tokenURI)
        //   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        //   let item = {
        //     price,
        //     tokenId: i.tokenId.toNumber(),
        //     seller: i.seller,
        //     owner: i.owner,
        //     image: meta.data.image,
        //     tokenURI
        //   }
        //   return item
        // }))
  
        // setProperties(...properties, data);  
      }
    };

    useEffect(async () => {

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      
      setAccount(provider.getSigner());
  
    }, []);
  
    useEffect(() => {
      setIsLoading(true);
      loadProperties();
      setIsLoading(false);
    }, [account]);
  
    return (
      <Box>
        <Container
          minWidth="xl"
          sx={{
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
        <Container minWidth="xl">
          <Typography
            variant="h4"
            sx={{ mt: "2rem", mb: "2rem" }}
            color="initial"
          >
            Properties
            <Button onClick={createProperty}>+</Button>
          </Typography>

          <Divider />
  
          {isLoading ? (
            <ReactLoading
              type="bubbles"
              color="  #EB4E5F"
              height={200}
              width={100}
            />
          ) : properties ? (
            <Box sx={{ mt: "2rem" }}>
              <Grid container spacing={0}>
                {properties?.map((property) => (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      width: "350px  ",
                      height: "300px ",
                      p: "3rem",
                    }}
                  >
                    <img
                      src={property.uri}
                      alt="place"
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        height: "100%",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <center>
                      <Typography variant="body1" color="initial">
                        {property.id}
                      </Typography>
                      <Typography variant="body2" color="gray">
                        From 22.07.2022 to 27.05.2024
                      </Typography>
                    </center>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ mt: "2rem", mb: "2rem" }}>
              <Typography variant="h5" color="initial" gutterBottom>
                No properties created ... yet!
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
      </Box>
    );
  };
  
  export default Host;
  