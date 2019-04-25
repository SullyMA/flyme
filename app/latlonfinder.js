const csv = require('csv-parser');
const fs = require('fs');

const city2Latlon = new Map();

function getLocation(city) {
  return city2Latlon.get(city);
}
fs.createReadStream('worldcities.csv')
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row);
    if (! row.population || row.population === '' || parseInt(row.population) < 100000) {
      return;
    }
    city2Latlon.set(row.city_ascii.toUpperCase(), {lat: row.lat, lon: row.lng})
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log(city2Latlon.get("Boston"))
  });


 module.exports = getLocation;
