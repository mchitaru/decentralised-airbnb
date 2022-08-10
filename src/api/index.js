import axios from "axios";
import data from "./data.json"

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

async function fetchPhoto(ref){

  try{

    const res = await axios.get(
      `/photo`,
      {
        params: {
          photo_reference: ref,
          maxwidth: '1024',
          maxheight: '1024',
          key: process.env.REACT_APP_GOOGLE_MAP_API_KEY
        },
        headers: { },
        secure: false //important
      }
    );

    return res.request.responseURL;
  
  } catch (error) {
    console.log(error);
  }
}

export const getData = async (coordinates, bound, type) => {
  try {

    // const res = await axios.get(
    //   `/nearbysearch/json`,
    //   {
    //     params: {
    //       type:'lodging',
    //       location: `${coordinates.lat},${coordinates.lng}`, 
    //       radius: '300', 
    //       language: 'en',
    //       key: process.env.REACT_APP_GOOGLE_MAP_API_KEY
    //     },
    //     headers: { },
    //     secure: false //important
    //     // params: {
    //     //   bl_latitude: bound.sw_lat,
    //     //   tr_latitude: bound.ne_lat,
    //     //   bl_longitude: bound.sw_lng,
    //     //   tr_longitude: bound.ne_lng,
    //     // },
    //     // headers: {
    //     //   "x-rapidapi-key": process.env.REACT_APP_TRAVEL_ADVISOR_API_KEY,
    //     //   "x-rapidapi-host": "google-maps28.p.rapidapi.com",
    //     // },
    //   }
    // );

    // const data = await Promise.all(res.data.results.map(async (place) => (
    //   {
    //     ...place,
    //     photos: place.photos?await Promise.all(place.photos.map((photo) => fetchPhoto(photo.photo_reference))): place.photos
    //   }
    // )));

    console.log(data);

    // if(data.length)
    //   download(JSON.stringify(data), 'data.json', 'text/plain');

    return data;

  } catch (error) {
    console.log(error);
  }
  
};
