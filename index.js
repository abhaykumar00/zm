const axios = require("axios");
const { type } = require("os");
const fs = require("fs").promises;

const fetchData = async (latitude, longitude) => {
  const url = `https://api.zap-map.io/locations/v1/search/bounding-box?latitude=${latitude}&longitude=${longitude}&page=1`;
  const params = {
    access: 1,
    count: 10000,
    latitude: latitude,
    longitude: longitude,
    minimal: 0,
   
    spanLat: 0.5,
    spanLng: 0.5,
  };
  const headers = {
    Accept: "*/*",
    Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ6YXAtbWFwLmNvbSIsImp0aSI6IkczdG8zUDFnRU1WUFRqRGVqWFN4TlBHdWdxV2ZodXU5aFhMQ0MyUk5BN2gycWRHUHFRTGFlNGxGVlZHdFVmYXBMakJtM2Z6Yk1INGNqN2h0Iiwic2NvcGVzIjpbInVzZXIucm9sZTpndWVzdCIsImxvY2F0aW9uczpyZWFkIiwicm91dGU6cmVhZCIsImFwcDpyZWFkIl0sImlhdCI6MTcxNjY5MTU4OC44MTc1OTksIm5iZiI6MTcxNjY5MTU4OC44MTc2NzEsImlzcyI6InphcC1tYXAuY29tIiwiZXhwIjoxNzE3Mjk2Mzg5LjgwNjAyNywiY2xpZW50X2lkIjoxMzZ9.Wgo4WKz7y8oUafmh_M-krI3AocbvXsqnxf86N5Ok0HvKGi7HGHPaZ8q7z2vnJ6Yc64mn2UBF5mpuN8eKqkimSX0Pp-_2q-QtM8uPjx-P3E6kx0USlxKKIHdfXRh_oBxDMXY6wd-HZrRA6cBPl5t1dCDrMwU-_bLAkGmueL9KjSEulTl9bZGI5U_6DDYwOV2k0nKJI2SU40HS-zuYw427i6z-mot5obo89yONPsLsPRfrVxLr2rIxoM9fizi2cqJHhjjJjixnCDf6amKd9utjmwt9LQ9cUloO9eVCXbHAiejAXHuOW1pVHFM2r_0rwJ9Wej9xA1tEN17ANsipB1-ZTrR5zgNSBLRvb_SNHjDp3yTSifNlG4VX58Sw-qwrPk_guekupOX1HnkMajLgtvVTXBLzNw_BCG6_H4KOkraUcR2v_2LX4OkjcAiR3QjS6cq-ClTACT5AVNXtFRTer1v1Q7xxOkWaA_CySUZYIuP7rPocONatzo6e-FJhSsjUZ4qdBGuI3litgI81odH-ZsIXGO8bRSEM0YVeaxz7jIW4RM4Wjo12jTSoFh_09Qv9Qo_L9dFRAZMqxtEcXvOQH6X8jxNLLfa5-_6IjzuuG3ErcQ7wlYZqFx7rmgz7o4OFxKLcR507IVj90zmSUNEvvgKphcPGYmVZld4G20_6SlYAmWk",
     "User-Agent": "Thunder Client (https://www.thunderclient.com)" };

  try {
    const response = await axios.get(url, { params, headers });

    let existingData = [];
    try {
      const data = await fs.readFile(`${parseInt(latitude)}.json`, "utf-8");
      existingData = JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    console.log(response.data)
    existingData.push(...response.data.data);

    await fs.writeFile(`${parseInt(latitude)}.json`, JSON.stringify(existingData, null, 2));

    console.log(`Data saved for latitude: ${latitude}, longitude: ${longitude}`);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // rethrow the error to be caught in the run function
  }
};

const aaaa = [];
const run = async () => {
  try {
    let latitude = parseFloat(await fs.readFile("latitude.txt", "utf8")).toFixed(2);
    let longitude = parseFloat(await fs.readFile("longitude.txt", "utf8")).toFixed(2);
   
    await fetchData(latitude, longitude);
console.log("type of",typeof(latitude),typeof(longitude));
 latitude = Number(latitude);
    longitude = Number(longitude);
    longitude += 0.1;
    await fs.writeFile("longitude.txt", longitude.toString());

    console.log(`Updated longitude: ${longitude}`);
  } catch (error) {
    console.error("Error in run function:", error);
    aaaa.push(longitude);
    throw error; // rethrow the error to be caught in the start function
  }
};

const INTERVAL = 0;
const REQUESTS = 76;
const MAX_ERRORS = 2; // Maximum number of consecutive errors allowed

const start = async (requests) => {
  let latitude;
  let errorCount = 0;

  try {
    latitude = parseFloat(await fs.readFile("latitude.txt", "utf8"));
  } catch (e) {
    console.log("Error reading latitude file:", e);
    return; // exit if there is an error reading the latitude file
  }

  for (let j = 0; j < 90; j++) {
    for (let i = 0; i < REQUESTS; i++) {
      try {
        await run();
        errorCount = 0; // reset error count on successful request
        await new Promise((resolve) => setTimeout(resolve, INTERVAL));
      } catch (error) {
        errorCount++;
        console.error(`Consecutive errors: ${errorCount}`);
        if (errorCount >= MAX_ERRORS) {
          console.error("Maximum consecutive errors reached. Stopping execution.");
          return;
        }
      }
    }
     // latitude = Number(latitude);
    
    latitude += 0.1;
    await fs.writeFile("latitude.txt", latitude.toString());

    longitude = -5.6;
    await fs.writeFile("longitude.txt", longitude.toString());
  }
};

// Start the loop with the specified number of requests
start(REQUESTS);