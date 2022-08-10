import axios from "axios";
// import data from "./data.json"

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export const getData = async (bound, type) => {
  try {

    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: bound.sw_lat,
          tr_latitude: bound.ne_lat,
          bl_longitude: bound.sw_lng,
          tr_longitude: bound.ne_lng,
        },
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_TRAVEL_ADVISOR_API_KEY,
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
        },
      }
    );
    // download(JSON.stringify(data), 'data.json', 'text/plain');

    return data;
  } catch (error) {
    console.log(error);
  }
};
