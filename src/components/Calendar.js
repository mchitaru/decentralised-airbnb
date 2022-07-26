import React, { useContext, useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listViewPlugin from '@fullcalendar/list' // a plugin!
import {
  InputBase,
  Rating,
  TextField,
  Typography,
  Box,
  Divider,
  Container,
  useMediaQuery,
  Paper,
  IconButton,
} from "@mui/material";

import { ethers } from 'ethers'
import axios from 'axios'

import {
  calendarAddress
} from '../artifacts/config' 

import CalendarABI from '../artifacts/contracts/Calendar.sol/Calendar.json'


const Calendar = ({account, provider, place}) => {

  const [events, setEvents] = useState([]);

  function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

  function intToRGB(i){
      var c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();

      return "#00000".substring(1, 6 - c.length) + c;
  }

  useEffect(async () => {

    if(account){

      try{

        const contract = new ethers.Contract(calendarAddress, CalendarABI.abi, provider.getSigner());     
        const balance = ethers.utils.formatUnits(await contract.reservationBalanceOf(place.token), 0);
  
        let tokens = [];
  
        for(let i = 0; i < balance; i++){
  
          const {reservationId, startTime, stopTime, owner} = await contract.reservationOfCalendarByIndex(place.token, i);
  
          const tokenURI = await contract.tokenURI(place.token);
          const meta = await axios.get(tokenURI);
  
          const checkIn = Number(ethers.utils.formatUnits(startTime, 0));
          const checkOut = Number(ethers.utils.formatUnits(stopTime, 0));
  
          tokens.push({
            start: new Date(checkIn).toISOString(), 
            end: new Date(checkOut).toISOString(), 
            allDay: true, 
            color: intToRGB(hashCode(account)), 
            display: 'background'});
        }
  
        // console.log(tokens);
  
        setEvents(tokens);  
      
      }catch(e){
        console.log("Copntract call error!");
      }
    }

  }, [account]);

  const styles = {
    line: {
      borderTop: "1px solid rgb(230, 229, 229)",
      mb: "0px",
    },
    image_div: {
      marginTop: 4,
    },
    card: {
      padding: "1.5rem",

      width: "100%",
      minHeight: 600,
      border: "1.5px solid rgb(242, 242, 242)",
      borderRadius: "15px",
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 20px",
      mb: 4,
    }
  }

  return (
    <Box sx={styles.card}>
      <FullCalendar
        plugins={[ dayGridPlugin, listViewPlugin ]}
        initialView="dayGridMonth"
        editable={true}
        events={events}
      />
    </Box>
  )
}

export default Calendar;