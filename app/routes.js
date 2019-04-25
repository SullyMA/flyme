const fetch = require('node-fetch');
const getLocation = require('./latlonfinder.js');

const getDoor = require('./door.js')
const moment = require('moment')


module.exports = function (app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)

  var countryKey = "d4d969a6-283f-4700-96ba-7b2da4dc217f"
  var unirest = require('unirest');

  // google apikey
  const apiKey = "AIzaSyDgBZAdYVo1gCLfgZIg15VQf3ey9N3fdtg"
  //google api
  //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&=restaurant&keyword=attractions&key="+apiKey

  // "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-(need to replace -33.8670522,151.1957362&radius=1500)&=restaurant&keyword=attractions&key="+apiKey


  //attractions[i].photos[0].photo_reference %>&key=AIzaSyDgBZAdYVo1gCLfgZIg15VQf3ey9N3fdtg
  const countries = ["ALB-sky", "AUT-sky", "BGR-sky", "HRV-sky", "cyp-sky"]

  // const middleAirport =[
  //   {region:"Middle East", city:"DOHA", countryCode:"QA", airportCode:"DOH" },
  //   {region:"Middle East", city:"DUBAI", countryCode:"AE", airportCode:"DXB" },
  //   {region:"Middle East", city:"JEDDAH", countryCode:"SA", airportCode:"JED" },
  //   // {region:"Middle East", city:"RIYADH", countryCode:"SA", airportCode:"RUH" },
  // ]


  //attractions for destination.ejs here-desclare function
  function getAttractions(city, countrycode) {
    console.log("!!!!!!!getAttractions", city)
    const location = getLocation(city)
    console.log("location for city", city, " === ", location)
    const latitude = location.lat
    const longitude = location.lon
    const nearByUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&keyword=attractions&key=` + apiKey
    console.log("getAttractions", city, getLocation(city), location, latitude, longitude);

    // function getAttractions(city, countrycode, ) { //
    return new Promise((resolve, reject) => {
      unirest.get(nearByUrl)
        .end(function (result) {

          getLodging (city, countrycode).then(lodgings=>{
            console.log("LODGINGS INSIDE getAttractions", lodgings)
            resolve({ attractions: result,lodgings:lodgings});
          })

          //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&=restaurant&keyword=attractions&key=`+apiKey

        });
    });
  }

  function getLodging(city, countrycode) {
    console.log("!!!!!!!getLodging", city)
    const location = getLocation(city)
    console.log("location for city", city, " === ", location)
    const latitude = location.lat
    const longitude = location.lon
    const nearByUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=lodging&radius=5000&key=` + apiKey
    console.log("getLodging", nearByUrl, city, getLocation(city), location, latitude, longitude);

    // function getAttractions(city, countrycode, ) { //
    return new Promise((resolve, reject) => {
      fetch(nearByUrl)
						.then(result => result.json())
						.then(lodgings => {
          //new code
          //console.log(result)

          //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&=restaurant&keyword=attractions&key=`+apiKey
								resolve({ lodgings: lodgings });
						})
    })
  }

  app.post('/doors', function (req, res) {
    const airports = [];
    const flightquotes = [];
    // for (let i=0; i < 3; i++){

    // }

    //create 3 promises to make a door
    const door1 = getDoor(req.body.budget, req.body.date, 0);
    const door2 = getDoor(req.body.budget, req.body.date, 1);
    const door3 = getDoor(req.body.budget, req.body.date, 2);
    //wait for all three promises to finish making the door
    console.log("STARTING ALL")
    Promise.all([door1, door2, door3]).then(doors => {
      console.log("3 doors are: ", doors);
      //render door.ejs with all three doors
      req.session.doors = doors
      res.render('doors.ejs', { doors: doors });

    }).catch(err => {
      console.log(err); res.send(err)
    });
  })





  // unirest.get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/USA/GBP/en-GB/?query="+req.body.city)
  // .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
  // .header("X-RapidAPI-Key", "160f3735b9msh9637084419e062bp188764jsn5f2800e7df96")
  // .end(function (result) {
  //   console.log(result.status, result.headers, result.body);
  // });
  // db.collection('activities').save({
  //    city: req.body.city,
  //    departure: req.body.departure,
  //    arrival: req.body.arrival,
  //    budget: req.body.budget
  //    }, (err, result) => {
  //    if (err) return console.log(err)
  //    console.log('saved to database')
  //    res.redirect('/destination')
  //    })
  // })


  // api being fetched is work in progress****

  // get_activities = function(req) {
  //   let Url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyDgBZAdYVo1gCLfgZIg15VQf3ey9N3fdtg&query=attractions+near+"+req.body.city
  //   fetch(Url)
  //   .then(function(response) {
  //     return response.json();
  //   })
  //   .then(function(myJson) {
  //     console.log(JSON.stringify(myJson));
  //   });
  // }

  //api key
  ////////AIzaSyDgBZAdYVo1gCLfgZIg15VQf3ey9N3fdtg


  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/destination/:doornumber', function (req, res) {
    const doornumber = req.params.doornumber
    // console.log("we have this many doors in the session:", req.session.doors.length)
    const city = req.session.doors[doornumber].destination.city;
    const country = req.session.doors[doornumber].countryCode
    const lat = req.session.doors[doornumber].destination.lat;
    const lon = req.session.doors[doornumber].destination.lon;
    console.log("**************** looking for attractions for ", city, country, lat, lon)
    getAttractions(city, country, country, lat, lon)
      .then(function (attractions) {
					//NOT SURE IF THIS IS THE RIGHT WAY TO CODE THIS PART?
					console.log("about to log lodgings");
        console.log("LODGING after getAttractions", attractions.lodgings.lodgings.results)
        console.log('flights',req.session.doors[doornumber].flights)
        const departureDate = req.session.doors[doornumber].flights[0].OutboundLeg.DepartureDate
        const date = moment(departureDate).format('MMMM D YYYY')
        console.log(date)
        req.session.doors[doornumber].flights[0].OutboundLeg.DepartureDate = date
        res.render('destination.ejs',
          {
            quote: req.session.doors[doornumber].flights,
            airport: req.session.doors[doornumber].destination,
            carriers: req.session.doors[doornumber].carriers,
            lodgings: attractions.lodgings.lodgings.results,
            attractions: attractions.attractions.body.results
          });
      });
  });

  app.get('/favorites/:_id', isLoggedIn, function(req, res) {
    db.collection('activities').findOne({_id: ObjectId(req.params._id)}, (err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.render('favorites.ejs', {
        user : req.user,
        flights: result.flights,
        locationplace: result.location,
        lodgingplace: result.lodgings
      })
    })
  });


  app.post('/favorites', (req, res) => {
    console.log(req.body)
    const id = ObjectId()
    if('flights' in req.body) {
      for(var i=0;i<req.body.flights.length;i++) {
        req.body.flights[i] = JSON.parse(req.body.flights[i])
      }
    }
    db.collection('activities').save({
      _id: id,
      flights: req.body.flights,
      lodgings: req.body.lodgings,
      location: req.body.attractions
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/favorites/'+ id )
    })
  })

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('activities').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        travel: result
      })
    })
  });

  // Saved booking Flights ==================

  app.get('/destination', function (req, res) {
    db.collection('favorites').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('destination.ejs', {
        user: req.user,
        booking: result
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // cart routes ===============================================================


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  //need to see if I need to keep this code
  // app.use(express.static(__dirname + 'destination/public'));
  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  };

};
