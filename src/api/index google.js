import axios from "axios";

const places =
  [
    {
        "token": {
            "type": "BigNumber",
            "hex": "0x00"
        },
        "location_id": "23165045",
        "name": "Schuster Boarding House",
        "latitude": "45.63879",
        "longitude": "25.588844",
        "num_reviews": "21",
        "timezone": "Europe/Bucharest",
        "location_string": "Brasov, Brasov County, Central Romania, Transylvania",
        "photo": {
            "images": {
                "small": {
                    "width": "150",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-l/23/5c/16/d1/schuster-boarding-house.jpg",
                    "height": "150"
                },
                "thumbnail": {
                    "width": "50",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-t/23/5c/16/d1/schuster-boarding-house.jpg",
                    "height": "50"
                },
                "original": {
                    "width": "3300",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-o/23/5c/16/d1/schuster-boarding-house.jpg",
                    "height": "2200"
                },
                "large": {
                    "width": "550",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-s/23/5c/16/d1/schuster-boarding-house.jpg",
                    "height": "367"
                },
                "medium": {
                    "width": "250",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-f/23/5c/16/d1/schuster-boarding-house.jpg",
                    "height": "167"
                }
            },
            "is_blessed": true,
            "uploaded_date": "2022-05-10T09:01:16-0400",
            "caption": "",
            "id": "593237713",
            "helpful_votes": "0",
            "published_date": "2022-05-10T09:01:16-0400",
            "user": {
                "user_id": null,
                "member_id": "0",
                "type": "user"
            }
        },
        "awards": [],
        "preferred_map_engine": "default",
        "autobroaden_type": "category_integrated",
        "autobroaden_label": "Brasov Places to Stay",
        "raw_ranking": "3.3863701820373535",
        "ranking_geo": "Brasov",
        "ranking_geo_id": "295394",
        "ranking_position": "5",
        "ranking_denominator": "517",
        "ranking_category": "hotel",
        "ranking": "#5 Best Value of 517 places to stay in Brasov",
        "subcategory_type": "hotel",
        "subcategory_type_label": "Hotel",
        "distance": "0.2689380697844649",
        "distance_string": null,
        "bearing": "south",
        "rating": "4.5",
        "is_closed": false,
        "is_long_closed": false,
        "price_level": "$$",
        "price": "$99 - $142",
        "hotel_class": "0.0",
        "business_listings": {
            "desktop_contacts": [],
            "mobile_contacts": []
        },
        "special_offers": {
            "desktop": [],
            "mobile": []
        },
        "listing_key": "9cc89343-968f-4489-aaff-3ab0687f7b0a"
    },
    {
        "token": {
            "type": "BigNumber",
            "hex": "0x01"
        },
        "location_id": "623927",
        "name": "Hotel Casa Wagner",
        "latitude": "45.64255",
        "longitude": "25.589556",
        "num_reviews": "789",
        "timezone": "Europe/Bucharest",
        "location_string": "Brasov, Brasov County, Central Romania, Transylvania",
        "photo": {
            "images": {
                "small": {
                    "width": "150",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-l/0a/8d/61/21/hotel-casa-wagner.jpg",
                    "height": "150"
                },
                "thumbnail": {
                    "width": "50",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-t/0a/8d/61/21/hotel-casa-wagner.jpg",
                    "height": "50"
                },
                "original": {
                    "width": "3008",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-o/0a/8d/61/21/hotel-casa-wagner.jpg",
                    "height": "2000"
                },
                "large": {
                    "width": "550",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-s/0a/8d/61/21/hotel-casa-wagner.jpg",
                    "height": "366"
                },
                "medium": {
                    "width": "250",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-f/0a/8d/61/21/hotel-casa-wagner.jpg",
                    "height": "166"
                }
            },
            "is_blessed": true,
            "uploaded_date": "2016-03-10T13:10:15-0500",
            "caption": "Hotel Rooms",
            "id": "177037601",
            "helpful_votes": "1",
            "published_date": "2016-03-10T13:12:21-0500",
            "user": {
                "user_id": null,
                "member_id": "0",
                "type": "user"
            }
        },
        "awards": [
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2020",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2020_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2020"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2019",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2019_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2019"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2018",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2018_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2018"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2017",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2017_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2017"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2015",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2015_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2015"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2014",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2014_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2014"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2013",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2013_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2013"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2012",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2012_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2012"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2011",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2011_en_US-0-5.png"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2011"
            }
        ],
        "preferred_map_engine": "default",
        "autobroaden_type": "category_integrated",
        "autobroaden_label": "Brasov Places to Stay",
        "raw_ranking": "4.163819789886475",
        "ranking_geo": "Brasov",
        "ranking_geo_id": "295394",
        "ranking_position": "2",
        "ranking_denominator": "517",
        "ranking_category": "hotel",
        "ranking": "#2 Best Value of 517 places to stay in Brasov",
        "subcategory_type": "hotel",
        "subcategory_type_label": "Hotel",
        "distance": "0.04105741204091399",
        "distance_string": null,
        "bearing": "east",
        "rating": "4.0",
        "is_closed": false,
        "is_long_closed": false,
        "price_level": "$",
        "price": "$51 - $65",
        "hotel_class": "3.0",
        "hotel_class_attribution": "This property is classified according to Giata.",
        "business_listings": {
            "desktop_contacts": [],
            "mobile_contacts": []
        },
        "special_offers": {
            "desktop": [],
            "mobile": []
        },
        "listing_key": "205bfb3e-080e-4e07-af8f-693eb5802428"
    },
    {
        "token": {
            "type": "BigNumber",
            "hex": "0x02"
        },
        "location_id": "4098331",
        "name": "Armatti Hotel",
        "latitude": "45.64734",
        "longitude": "25.589018",
        "num_reviews": "221",
        "timezone": "Europe/Bucharest",
        "location_string": "Brasov, Brasov County, Central Romania, Transylvania",
        "photo": {
            "images": {
                "small": {
                    "width": "150",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-l/03/d8/25/0b/armatti-hotel.jpg",
                    "height": "150"
                },
                "thumbnail": {
                    "width": "50",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-t/03/d8/25/0b/armatti-hotel.jpg",
                    "height": "50"
                },
                "original": {
                    "width": "1064",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-o/03/d8/25/0b/armatti-hotel.jpg",
                    "height": "538"
                },
                "large": {
                    "width": "550",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-s/03/d8/25/0b/armatti-hotel.jpg",
                    "height": "278"
                },
                "medium": {
                    "width": "250",
                    "url": "https://media-cdn.tripadvisor.com/media/photo-f/03/d8/25/0b/armatti-hotel.jpg",
                    "height": "126"
                }
            },
            "is_blessed": true,
            "uploaded_date": "2013-05-01T22:40:04-0400",
            "caption": "Executive Room",
            "id": "64496907",
            "helpful_votes": "0",
            "published_date": "2013-05-01T22:40:04-0400",
            "user": {
                "user_id": null,
                "member_id": "0",
                "type": "user"
            }
        },
        "awards": [
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2019",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2019_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2019"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2018",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2018_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2018"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2017",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2017_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2017"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2016",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2016_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2016"
            },
            {
                "award_type": "CERTIFICATE_OF_EXCELLENCE",
                "year": "2015",
                "images": {
                    "small": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_small-0-5.jpg",
                    "large": "https://www.tripadvisor.com/img/cdsi/img2/awards/CERTIFICATE_OF_EXCELLENCE_2015_en_US_large-0-5.jpg"
                },
                "categories": [],
                "display_name": "Certificate of Excellence 2015"
            }
        ],
        "preferred_map_engine": "default",
        "autobroaden_type": "category_integrated",
        "autobroaden_label": "Brasov Places to Stay",
        "raw_ranking": "3.9300308227539062",
        "ranking_geo": "Brasov",
        "ranking_geo_id": "295394",
        "ranking_position": "6",
        "ranking_denominator": "517",
        "ranking_category": "hotel",
        "ranking": "#6 Best Value of 517 places to stay in Brasov",
        "subcategory_type": "hotel",
        "subcategory_type_label": "Hotel",
        "distance": "0.32275027290083563",
        "distance_string": null,
        "bearing": "north",
        "rating": "4.5",
        "is_closed": false,
        "is_long_closed": false,
        "price_level": "$",
        "price": "$63 - $74",
        "hotel_class": "3.0",
        "hotel_class_attribution": "This property is classified according to Giata.",
        "business_listings": {
            "desktop_contacts": [],
            "mobile_contacts": []
        },
        "special_offers": {
            "desktop": [],
            "mobile": []
        },
        "listing_key": "945faf10-94a9-4df7-bd8a-370d230e3033"
    }
]  

export const getData = async (coordinates, bound, type) => {
  try {

    // const axios = require("axios");

    // const options = {
    //   method: 'GET',
    //   url: 'https://google-maps28.p.rapidapi.com/maps/api/place/nearbysearch/json',
    //   params: {type:'lodging', location: `${coordinates.lat},${coordinates.lng}`, radius: '100', language: 'en'},
    //   headers: {
    //     'X-RapidAPI-Key': process.env.REACT_APP_TRAVEL_ADVISOR_API_KEY,
    //     'X-RapidAPI-Host': 'google-maps28.p.rapidapi.com'
    //   }
    // };
    
    // axios.request(options).then(function (response) {

    //   const data = response.data.results;

    //   console.log(data);

    //   return data;

    // }).catch(function (error) {
    //   console.error(error);
    // });

    // const data = places;

    const res = await axios.get(
      `https://google-maps28.p.rapidapi.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          type:'lodging',
          location: `${coordinates.lat},${coordinates.lng}`, 
          radius: '300', 
          language: 'en'
        },
        // params: {
        //   bl_latitude: bound.sw_lat,
        //   tr_latitude: bound.ne_lat,
        //   bl_longitude: bound.sw_lng,
        //   tr_longitude: bound.ne_lng,
        // },
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_TRAVEL_ADVISOR_API_KEY,
          "x-rapidapi-host": "google-maps28.p.rapidapi.com",
        },
      }
    );

    const data = res.data.results;

    console.log(data);

    return data;

  } catch (error) {
    console.log(error);
  }
  
};
