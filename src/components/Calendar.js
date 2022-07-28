import React, { useContext, useEffect, useState } from "react";
import { withSnackbar } from "../components/Snackbar";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listViewPlugin from '@fullcalendar/list' // a plugin!
import {
  Box,
  Menu,
  MenuItem
} from "@mui/material";

import { userContext } from "../Context";
import { getBookingsByCalendar, cancelBooking } from "../utils"

const Calendar = ({place, ShowMessage}) => {

  function handleClose() {

    setContextMenu(null);
    setEventId(null);
  };

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

  function onMouseEnter(info) {
    info.el.style.border = '1px solid black';
    setEventId(info.event.id);
  }

  function onMouseLeave(info) {
    if(!contextMenu){
      setEventId(null);
    }
    info.el.style.border = '0px solid black';
  }

  const handleContextMenu = (ev) => {

    if(eventId){
      ev.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: ev.clientX + 2,
              mouseY: ev.clientY - 6,
            }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
            // Other native context menus might behave different.
            // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null,
      );  
    }
  };

  async function onClick() {

    setLoading(true);

    const res = await cancelBooking(place.token, eventId);

    if(res)
      ShowMessage(`Sad to see you're not going to ${place.location_string} anymore!!`, "success");
    else
      ShowMessage("Sorry, but your booking could not be canceled", "error");

    setLoading(false);

    handleClose();
  }

  const { account, provider } = useContext(userContext);

  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    async function fetch(){

      if(account){

        const bookings = await getBookingsByCalendar(place.token, provider);
  
        const evts = bookings.map((book) => (
          {
            id: book.token,
            title: book.owner.slice(0, 6).concat('...'),
            start: new Date(book.checkIn).toISOString(), 
            end: new Date(book.checkOut).toISOString(), 
            allDay: true, 
            color: intToRGB(hashCode(book.owner)), 
            display: 'background'
          }
        ))
  
        // console.log(evts);  
        setEvents(evts);  
      }  
    }

    fetch();

  }, [account, place, contextMenu]);

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
    <Box sx={styles.card} onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
      <FullCalendar        
        plugins={[ dayGridPlugin, listViewPlugin ]}
        initialView="dayGridMonth"
        headerToolbar= {{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listWeek'
        }}
        events={events}
        eventMouseEnter={onMouseEnter}
        eventMouseLeave={onMouseLeave}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {onClick()}}>Cancel</MenuItem>
      </Menu>      
    </Box>
  )
}

export default withSnackbar(Calendar);