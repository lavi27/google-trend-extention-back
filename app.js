const express = require('express');
const cors = require("cors");
const googleTrends = require('google-trends-api');

const port = 3000;
let result;

const app = express();
app.use(cors());

function getTrends(date, resExpress) {
  googleTrends.dailyTrends({ trendDate: date, geo: 'KR' }, (err, resTrends) => {
    let response = [];

    if (err) {
      console.error(err);
    } else {
      result = JSON.parse(resTrends).default.trendingSearchesDays[0].trendingSearches;
      result.forEach(item => {
        const data = new Object;

        data.title = item.title.query;
        data.traffic = item.formattedTraffic;

        response.push(data);
      });

      resExpress.json(response);
    }
  });
}

app.get('/api/main/:year/:month/:day', (req, resExpress) => {
  let {
    year: yr,
    month: mh,
    day: dy
  } = req.params;

  mh = mh.padStart(2, "0");
  dy = dy.padStart(2, "0");

  getTrends(new Date(`${yr}-${mh}-${dy}`), resExpress);
});

app.listen(port, () => {
  console.log(`App listening on http://127.0.0.1:${port}/api/main`)
});