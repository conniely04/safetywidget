import { BaseSideService } from "@zeppos/zml/base-side";

const padStart = (str, maxLength, fillStr = "0") => {
  return str.toString().padStart(maxLength, fillStr);
};
const formatDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const mm = date.getMinutes();
  const s = date.getSeconds();

  return `${y}-${padStart(m, 2)}-${padStart(d, 2)} ${padStart(h, 2)}:${padStart(
    mm,
    2
  )}:${padStart(s, 2)}`;
};

// Simulating an asynchronous network request using Promise
async function mockAPI() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        body: {
          data: {
            text: "Location: " + formatDate(),
          },
        },
      });
    }, 1000);
  });
}

async function fetchData(res, lat, lon) {
  try {
    // Requesting network data using the fetch API
    // The sample program is for simulation only and does not request real network data, so it is commented here
    // Example of a GET method request

    const apiKey = "AIzaSyBHqGILdbKvAbh--iHABzjvCl2fURBu_zQ";
    // const latitude = lattext.getCurrent();
    // const longitude = lontext.getCurrent();
    // const radius = 1000;
    // const businessType = "restaurant";
    // const currentTime = new Date().toISOString();
    // const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${latitude},${longitude}&radius=${radius}&type=${businessType}&opennow=true&keyword=&rankby=distance&time=${currentTime}`;
    const apiUrl =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBHqGILdbKvAbh--iHABzjvCl2fURBu_zQ&location=37.7749,-122.4194&radius=1000&type=restaurant";

    const { body: { data = {} } = {} } = await fetch({
      url: apiUrl,
      method: "GET",
    }).then((data) => {
      //returns whole list based on location here
      console.log(data.body.results);
      console.log(lat);
      console.log(lon);
      // find closest range here
      const safelat = [];
      const safelon = [];
      const safeName = [];
      for (let i = 0; i < 20; i++) {
        //change back to true
        if (data.body.results[i].opening_hours.open_now === true) {
          //console.log(data.body.results[i].name);
          safelat.push(data.body.results[i].geometry.location.lat);
          safelon.push(data.body.results[i].geometry.location.lng);
          safeName.push(data.body.results[i].name);

          //res(null, data.body.results[i].name);
        }
      }
      console.log("safe lat: ", safelat);
      console.log("safe lon: ", safelon);

      const diff = [];
      for (let i = 0; i < safelat.length; i++) {
        safelat[i] = Math.abs(safelat[i]);
        safelon[i] = Math.abs(safelon[i]);
        safelat[i] -= Math.abs(lat);
        safelon[i] -= Math.abs(lon);
        diff.push(safelat[i] + safelon[i]);
      }

      let minIndex = 0; // Initialize with the index of the first value

      for (let i = 1; i < diff.length; i++) {
        if (diff[i] < diff[minIndex]) {
          minIndex = i;
        }
      }

      console.log(safeName[minIndex]);
      res(null, safeName[minIndex]);
      /*for (let i = 0; i < 20; i++) {
        //change back to true
        if (data.body.results[i].opening_hours.open_now === false) {
          console.log(data.body.results[i].name);
          const safelat = data.body.results[i].geometry.location.lat;
          const safelon = data.body.results[i].geometry.location.lng;
          console.log("safe lat: ", safelat);
          console.log("safe lon: ", safelon);
          var temp;
          res(null, data.body.results[i].name);
        }
      }*/

      //res(null, safeName[minIndex]);

      //this line returns the name on watch
    });
  } catch (error) {
    console.log(error);
    return res(null, {
      result: "bruh",
    });
  }
}

// A network request is simulated here

AppSideService(
  BaseSideService({
    onInit() {},

    onRequest(req, res) {
      if (req.method === "GET_DATA") {
        console.log("fetch data");
        fetchData(res, req.lat, req.lon);
        console.log("done");
      }
    },

    onRun() {},

    onDestroy() {},
  })
);
