const axios = require("axios");
const fs = require("fs").promises;
let counting=51;
const fetchData = async (id) => {
    console.log(id)
  const url = `https://api.zap-map.io/locations/v1/location/${id.uuid}`;
  const headers = {
    Accept: "*/*",
    Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ6YXAtbWFwLmNvbSIsImp0aSI6IkczdG8zUDFnRU1WUFRqRGVqWFN4TlBHdWdxV2ZodXU5aFhMQ0MyUk5BN2gycWRHUHFRTGFlNGxGVlZHdFVmYXBMakJtM2Z6Yk1INGNqN2h0Iiwic2NvcGVzIjpbInVzZXIucm9sZTpndWVzdCIsImxvY2F0aW9uczpyZWFkIiwicm91dGU6cmVhZCIsImFwcDpyZWFkIl0sImlhdCI6MTcxNjY5MTU4OC44MTc1OTksIm5iZiI6MTcxNjY5MTU4OC44MTc2NzEsImlzcyI6InphcC1tYXAuY29tIiwiZXhwIjoxNzE3Mjk2Mzg5LjgwNjAyNywiY2xpZW50X2lkIjoxMzZ9.Wgo4WKz7y8oUafmh_M-krI3AocbvXsqnxf86N5Ok0HvKGi7HGHPaZ8q7z2vnJ6Yc64mn2UBF5mpuN8eKqkimSX0Pp-_2q-QtM8uPjx-P3E6kx0USlxKKIHdfXRh_oBxDMXY6wd-HZrRA6cBPl5t1dCDrMwU-_bLAkGmueL9KjSEulTl9bZGI5U_6DDYwOV2k0nKJI2SU40HS-zuYw427i6z-mot5obo89yONPsLsPRfrVxLr2rIxoM9fizi2cqJHhjjJjixnCDf6amKd9utjmwt9LQ9cUloO9eVCXbHAiejAXHuOW1pVHFM2r_0rwJ9Wej9xA1tEN17ANsipB1-ZTrR5zgNSBLRvb_SNHjDp3yTSifNlG4VX58Sw-qwrPk_guekupOX1HnkMajLgtvVTXBLzNw_BCG6_H4KOkraUcR2v_2LX4OkjcAiR3QjS6cq-ClTACT5AVNXtFRTer1v1Q7xxOkWaA_CySUZYIuP7rPocONatzo6e-FJhSsjUZ4qdBGuI3litgI81odH-ZsIXGO8bRSEM0YVeaxz7jIW4RM4Wjo12jTSoFh_09Qv9Qo_L9dFRAZMqxtEcXvOQH6X8jxNLLfa5-_6IjzuuG3ErcQ7wlYZqFx7rmgz7o4OFxKLcR507IVj90zmSUNEvvgKphcPGYmVZld4G20_6SlYAmWk",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
  };

  try {
    const response = await axios.get(url, { headers });

    let existingData = [];
    try {
      const data = await fs.readFile(`${counting}d.json`, "utf-8");
      existingData = JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    existingData.push(response.data.data);

    await fs.writeFile(`${counting}d.json`, JSON.stringify(existingData, null, 2));
    console.log(`Data saved for id: ${id}`);
  } catch (error) {
    console.error(`Error fetching data for id ${id}:`, error.message);
    throw error; 
  }
};

const run = async (id) => {
  try {
    await fetchData(id);
  } catch (error) {
    console.error(`Error in run for id ${id}:`, error.message);
  }
};

const INTERVAL = 0;
const REQUESTS = 76;
const MAX_ERRORS = 2;

const start = async () => {
  let errorCount = 0;

  try {
   
    console.log("this is counting",counting)
    while(counting<59){
        const values = JSON.parse(await fs.readFile(`${counting}.json`, "utf-8"));
    for (let i = 0; i < values.length; i++) {
      if (errorCount >= MAX_ERRORS) {
        console.error("Maximum consecutive errors reached. Stopping execution.");
        return;
      }

      try {
        await run(values[i]);
        errorCount = 0;
        await new Promise((resolve) => setTimeout(resolve, INTERVAL));
      } catch (error) {
        errorCount++;
        console.error(`Consecutive errors: ${errorCount}`);
      }
    }
counting=counting+1;}
  } catch (error) {
    console.error("Error reading values from 50.json:", error.message);
  }
};

start();
