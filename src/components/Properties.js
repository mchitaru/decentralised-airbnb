import React from "react"
import {
    Box,
    Container,
    Divider,
    Card,
    Link,
    Typography,
    Button,
    Grid,
  } from "@mui/material";

export default function Properties(props){

    const myProperties =
      props.propIds &&
      props.propIds.map((tokenId, i) => (

        <Box sx={{ margin: 16 }}>
            <Card title={`Calendar ${tokenId || ""}`} loading={tokenId === null}>
            <Link to={`/meet/${tokenId}`}>
                /meet/
                {tokenId}
            </Link>
            </Card>
        </Box>
      ));

    return (
      <Box>
        <Divider>
            My Properties {props.balance > 0 && `(${props.balance})`} 
            <Button onClick={props.createProperty}>+</Button>
        </Divider>
        <Box sx={{ display: "flex" }}>{myProperties}</Box>
      </Box>
    );
}