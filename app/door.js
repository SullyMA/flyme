unirest = require('unirest');
const promiseRetry = require('promise-retry');

const regions = ["Americas", "Europe", "Asia/Pacific"]

const americaAirport = [
  // {region:"Americas", city:"ATLANTA GA", countryCode:"US", airportCode:"ATL", lat: "33.1136", long: "-94.1672"},
  // {region:"Americas", city:"BALTIMORE MD", countryCode:"US", airportCode:"BWI", lat: "39.3051", long: "-76.6144" },
  // {region:"Americas", city:"BOSTON MA", countryCode:"US", airportCode:"BOS" },
  { region: "Americas", city: "BRASILIA", countryCode: "BR", airportCode: "BSB", lat: "-15.7833", long: "-47.9161" },
  // {region:"Americas", city:"CHARLOTTE NC", countryCode:"US", airportCode:"CLT", lat: "35.208", long: "-80.8308" },
  // {region:"Americas", city:"CHICAGO IL", countryCode:"US", airportCode:"MDW", lat: "35.208", long: "-80.8308"  },
  // {region:"Americas", city:"CHICAGO IL", countryCode:"US", airportCode:"ORD" },
  // {region:"Americas", city:"DALLAS/FORT WORTH TX", countryCode:"US", airportCode:"DFW" },
  // {region:"Americas", city:"DENVER CO", countryCode:"US", airportCode:"DEN" },
  // {region:"Americas", city:"DETROIT MI", countryCode:"US", airportCode:"DTW" },
  // {region:"Americas", city:"FORT LAUDERDALE", countryCode:"FL,US", airportCode:"FLL" },
  // {region:"Americas", city:"HOUSTON TX", countryCode:"US", airportCode:"IAH" },
  // {region:"Americas", city:"LAS VEGAS NV", countryCode:"US", airportCode:"LAS" },
  // {region:"Americas", city:"LOS ANGELES CA", countryCode:"US", airportCode:"LAX" },
  { region: "Americas", city: "MEXICO CITY", countryCode: "MX", airportCode: "MEX" },
  // {region:"Americas", city:"MIAMI FL", countryCode:"US", airportCode:"MIA" },
  // {region:"Americas", city:"MINNEAPOLIS MN", countryCode:"US", airportCode:"MSP" },
  // {region:"Americas", city:"NEWARK NJ", countryCode:"US", airportCode:"EWR" },
  // {region:"Americas", city:"NEW YORK NY", countryCode:"US", airportCode:"JFK" },
  // {region:"Americas", city:"NEW YORK NY", countryCode:"US", airportCode:"LGA" },
  // {region:"Americas", city:"ORLANDO FL", countryCode:"US", airportCode:"MCO" },
  // {region:"Americas", city:"PHILADELPHIA PA", countryCode:"US", airportCode:"PHL" },
  // {region:"Americas", city:"PHOENIX AZ", countryCode:"US", airportCode:"PHX" },
  { region: "Americas", city: "RIO DE JANEIRO", countryCode: "BR", airportCode: "GIG" },
  // {region:"Americas", city:"SALT LAKE CITY UT", countryCode:"US", airportCode:"SLC" },
  // {region:"Americas", city:"SAN DIEGO CA", countryCode:"US", airportCode:"SAN" },
  // {region:"Americas", city:"SAN FRANCISCO CA", countryCode:"US", airportCode:"SFO" },
  { region: "Americas", city: "SÃO PAULO", countryCode: "BR", airportCode: "CGH" },
  { region: "Americas", city: "SÃO PAULO", countryCode: "BR", airportCode: "GRU" },
  // {region:"Americas", city:"SEATTLE WA", countryCode:"US", airportCode:"SEA" },
  // {region:"Americas", city:"TAMPA FL", countryCode:"US", airportCode:"TPA" },
  // {region:"Americas", city:"TORONTO ON", countryCode:"CA", airportCode:"YYZ" },
  // {region:"Americas", city:"VANCOUVER BC", countryCode:"CA", airportCode:"YVR" },
  // {region:"Americas", city:"WASHINGTON", countryCode:"DC,US", airportCode:"IAD" },
  // {region:"Americas", city:"WASHINGTON DC", countryCode:"US", airportCode:"DCA" },
]

const asiaAirport = [
  { region: "Asia/Pacific", city: "AUCKLAND", countryCode: "NZ", airportCode: "AKL" },
  { region: "Asia/Pacific", city: "BANGKOK", countryCode: "TH", airportCode: "BKK" },
  { region: "Asia/Pacific", city: "BEIJING", countryCode: "CN", airportCode: "PEK" },
  { region: "Asia/Pacific", city: "BRISBANE", countryCode: "AU", airportCode: "BNE" },
  { region: "Asia/Pacific", city: "CHENGDU", countryCode: "CN", airportCode: "CTU" },
  { region: "Asia/Pacific", city: "FUKUOKA", countryCode: "JP", airportCode: "FUK" },
  { region: "Asia/Pacific", city: "GUANGZHOU", countryCode: "CN", airportCode: "CAN" },
  { region: "Asia/Pacific", city: "HANGZHOU", countryCode: "CN", airportCode: "HGH" },
  { region: "Asia/Pacific", city: "HONG KONG", countryCode: "HK", airportCode: "HKG" },
  { region: "Asia/Pacific", city: "INCHEON", countryCode: "KR", airportCode: "ICN" },
  { region: "Asia/Pacific", city: "JAKARTA", countryCode: "ID", airportCode: "CGK" },
  { region: "Asia/Pacific", city: "JEJU", countryCode: "KR", airportCode: "CJU" },
  { region: "Asia/Pacific", city: "KUALA LUMPUR", countryCode: "MY", airportCode: "KUL" },
  { region: "Asia/Pacific", city: "KUNMING", countryCode: "CN", airportCode: "KMG" },
  { region: "Asia/Pacific", city: "MANILA", countryCode: "PH", airportCode: "MNL" },
  { region: "Asia/Pacific", city: "MELBOURNE", countryCode: "AU", airportCode: "MEL" },
  { region: "Asia/Pacific", city: "MUMBAI", countryCode: "IN", airportCode: "BOM" },
  { region: "Asia/Pacific", city: "NEW DELHI", countryCode: "IN", airportCode: "DEL" },
  { region: "Asia/Pacific", city: "SAPPORO", countryCode: "JP", airportCode: "CTS" },
  { region: "Asia/Pacific", city: "SEOUL", countryCode: "KR", airportCode: "GMP" },
  { region: "Asia/Pacific", city: "SHANGHAI", countryCode: "CN", airportCode: "PVG" },
  { region: "Asia/Pacific", city: "SHANGHAI", countryCode: "CN", airportCode: "SHA" },
  { region: "Asia/Pacific", city: "SHENZHEN", countryCode: "CN", airportCode: "SZX" },
  { region: "Asia/Pacific", city: "SINGAPORE", countryCode: "SG", airportCode: "SIN" },
  { region: "Asia/Pacific", city: "SYDNEY", countryCode: "AU", airportCode: "SYD" },
  { region: "Asia/Pacific", city: "TAIPEI", countryCode: "TW", airportCode: "TPE" },
  { region: "Asia/Pacific", city: "TOKYO", countryCode: "JP", airportCode: "HND" },
  { region: "Asia/Pacific", city: "TOKYO", countryCode: "JP", airportCode: "NRT" },
  { region: "Asia/Pacific", city: "XIAMEN", countryCode: "CN", airportCode: "XMN" },
]

const europeAirport = [
  { region: "Europe", city: "AMSTERDAM", countryCode: "NL", airportCode: "AMS" },
  { region: "Europe", city: "ANTALYA", countryCode: "TR", airportCode: "AYT" },
  { region: "Europe", city: "ATHENS", countryCode: "GR", airportCode: "ATH" },
  { region: "Europe", city: "BARCELONA", countryCode: "ES", airportCode: "BCN" },
  { region: "Europe", city: "BERLIN", countryCode: "DE", airportCode: "TXL" },
  { region: "Europe", city: "BOGOTA", countryCode: "CO", airportCode: "BOG" },
  { region: "Europe", city: "BRUSSELS", countryCode: "BE", airportCode: "BRU" },
  { region: "Europe", city: "COPENHAGEN", countryCode: "DK", airportCode: "CPH" },
  { region: "Europe", city: "DUBLIN", countryCode: "IE", airportCode: "DUB" },
  { region: "Europe", city: "DÜSSELDORF", countryCode: "DE", airportCode: "DUS" },
  { region: "Europe", city: "FRANKFURT", countryCode: "DE", airportCode: "FRA" },
  { region: "Europe", city: "HELSINKI", countryCode: "FI", airportCode: "HEL" },
  { region: "Europe", city: "ISTANBUL", countryCode: "TR", airportCode: "IST" },
  { region: "Europe", city: "LISBON", countryCode: "PT", airportCode: "LIS" },
  { region: "Europe", city: "LONDON", countryCode: "GB", airportCode: "LGW" },
  { region: "Europe", city: "LONDON", countryCode: "GB", airportCode: "LHR" },
  { region: "Europe", city: "LONDON", countryCode: "GB", airportCode: "STN" },
  { region: "Europe", city: "MADRID", countryCode: "ES", airportCode: "MAD" },
  { region: "Europe", city: "MANCHESTER", countryCode: "GB", airportCode: "MAN" },
  { region: "Europe", city: "MILAN", countryCode: "IT", airportCode: "MXP" },
  { region: "Europe", city: "MOSCOW", countryCode: "RU", airportCode: "DME" },
  { region: "Europe", city: "MOSCOW", countryCode: "RU", airportCode: "SVO" },
  { region: "Europe", city: "MUNICH", countryCode: "DE", airportCode: "MUC" },
  { region: "Europe", city: "OSLO", countryCode: "NO", airportCode: "OSL" },
  { region: "Europe", city: "PALMA DE MALLORCA", countryCode: "ES", airportCode: "PMI" },
  { region: "Europe", city: "PARIS", countryCode: "FR", airportCode: "CDG" },
  { region: "Europe", city: "PARIS", countryCode: "FR", airportCode: "ORY" },
  { region: "Europe", city: "ROME", countryCode: "IT", airportCode: "FCO" },
  { region: "Europe", city: "STOCKHOLM", countryCode: "SE", airportCode: "ARN" },
  { region: "Europe", city: "VIENNA", countryCode: "AT", airportCode: "VIE" },
  { region: "Europe", city: "ZURICH", countryCode: "CH", airportCode: "ZRH" },
]

function randomAirport(region) {
  //creating a random region (num 0-4) because 4 is is the biggest from the index
  // const region = Math.floor(Math.random() * regions.length)
  //picking the list of aiports to pick from
  if (region === 0) {
    airportList = americaAirport
  } else if (region === 1) {
    airportList = europeAirport
  }
  // else if (region ===2){
  //   airportList= middleAirport
  // }
  else if (region === 2) {
    airportList = asiaAirport
  }

  // else if (region===4){
  //   airportList =africaAirports
  // }
  //Choice the ramdom index (num that gives you a position inside the array) inside the airport array for the region
  const airportIndex = Math.floor(Math.random() * airportList.length)
  // console.log(airportList)
  //Selecting the random airport within random region
  const airport = airportList[airportIndex]
  if (airport.region === "Europe") {
    airport.regionimg = "euro.png"
  } else if (airport.region === "Asia/Pacific") {
    airport.regionimg = "asia.png"
  } else if (airport.region === "Americas") {
    airport.regionimg = "Americas.png"
  }  else {
    airport.regionimg = "x.png";
    airport.region = "Try again with a lower budget";
  }
  return (airport)
}

function getOneDoor(budget, date, region) {
  return new Promise((resolve, reject) => {
    const airport = randomAirport(region)
    // // unirest.get("http://iatacodes.org/api/v6/autocomplete?api_key="+airport.countryCode+"&query="+ req.body.city)
    // .end(function (result){

    // for (var country of countries){
    //calling sky api for each countries
    const doorUrl = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/BOS-sky/" + airport.airportCode + "-sky/" + date;
    console.log("door url:", doorUrl)
    unirest.get(doorUrl)
      .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
      .header("X-RapidAPI-Key", "sCZtMmZfESmshiJiW2yVP1egCqdrp1DAfUXjsnMePjCLpYirRI")
      //old key 160f3735b9msh9637084419e062bp188764jsn5f2800e7df96
      .end(function (result) {
        //new code
        console.log(result.body)
        var places_array = result.body['Places'];
        for (i = 0; i < places_array.length; i++) {

          var quotes = result.body['Quotes'];
          var affordable_flights = [];
          console.log("budget", budget)
          quotes.forEach(function (affordable) {
            console.log("compare to", affordable.MinPrice)
            if (affordable.MinPrice <= budget) {
              affordable_flights.push(affordable);
            }
          })
          if (affordable_flights.length > 0) {
            resolve({ flights: affordable_flights, destination: airport, carriers: result.body['Carriers'] });
          } else {
            console.log("no affordable flights:", budget, airport, date)
            reject(null);
          }
        }
      });
  });
}

function getDoor(budget, date, region) {
  // Simple example
  return promiseRetry(function (retry, number) {
    console.log('attempt number', number);

    return getOneDoor(budget, date, region)
      .catch(retry);
  }, {retries:3})
    .then(function (door) {
      console.log("got A GOOD DOOR");
      return door
    }, function (err) {
      console.log("got A BAD!!!!! DOOR");
      return null;
    });
}

module.exports = getDoor;
