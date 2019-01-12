const knex = require('../../db/knex');
const uuidV4 = require('uuid/v4');
const request = require('request');
const apiKey = '2de07f562ab3e98cd99852c6bd96af8c';
const nodeGeocoder = require('node-geocoder');

exports.searchGeo = (req, res, next) => {
    const lat = req.body.lat;
    const long = req.body.long; 
    let userId = req.body.user_id;
    let location = {};

    if(!lat || !long || !userId)
        return res.status(400).json({
            status: "error",
            error: "Missing input parameter(s) : location, user_id"
    });
    const options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: 'AIzaSyC20cZRHZ4mYOVNqwZtK5tejss1aDtodK4', 
        formatter: 'json'
    };

    const geocoder = nodeGeocoder(options);

    geocoder.reverse({lat:lat, lon:long})
    .then((entry) =>{
        console.log(entry[0].city);
        location = entry[0].city;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
        let weatherDetails = {};

        request(url, (err, response, body) => {
            if(err)
            {
                return res.status(500).json({
                    status: "error",
                    error: "Please try again!"
                });
            } 
            else 
            {
                let weather = JSON.parse(body)
                if(weather.main == undefined)
                {
                    return res.status(500).json({
                        status: "error",
                        error: "Please try again!"
                    });
                } 
                else 
                {
                    console.log(weather);
                    weatherDetails = {
                        "temperature": weather.main.temp,
                        "humidity": weather.main.humidity,
                        "wind_speed": weather.wind.speed,
                        "condition": weather.weather[0].description,
                        "place": weather.name,
                        "id": weather.weather[0].id
                    };
                    let weatherText = `Its ${weather.main.temp}°F with humidity: ${weather.main.humidity} and wind_speed: ${weather.wind.speed}!`;
                    res.status(200).json({
                        status: "success",
                        weather: weatherDetails
                    })

                    knex('search_history').insert({
                        id: uuidV4(),
                        user_id: req.body.user_id,
                        location: location,
                        weather: weatherText,
                        created_at: new Date(),
                        updated_at: new Date()
                    })
                    .then(() => {
                        return;
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            status: "error",
                            error: err
                        });
                    })
                }
            }
        }); 
    })
    .catch((err) =>{
        console.log(err);
    })

    
};

exports.search = (req, res, next) => {
    let location = req.body.location;
    let userId = req.body.user_id;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
    let weatherDetails = {};
    if(!location || !userId)
        return res.status(400).json({
            status: "error",
            error: "Missing input parameter(s) : location, user_id"
        });

    request(url, (err, response, body) => {
        if(err)
        {
            return res.status(500).json({
                status: "error",
                error: "Please try again!"
            });
        } 
        else 
        {
            let weather = JSON.parse(body)
            if(weather.main == undefined)
            {
                return res.status(500).json({
                    status: "error",
                    error: "Please try again!"
                });
            } 
            else 
            {
                console.log(weather);
                weatherDetails = {
                    "temperature": weather.main.temp,
                    "humidity": weather.main.humidity,
                    "wind_speed": weather.wind.speed,
                    "condition": weather.weather[0].description,
                    "place": weather.name,
                    "id": weather.weather[0].id
                };
                let weatherText = `Its ${weather.main.temp}°F with humidity: ${weather.main.humidity} and wind_speed: ${weather.wind.speed}!`;
                res.status(200).json({
                    status: "success",
                    weather: weatherDetails
                })

                knex('search_history').insert({
                    id: uuidV4(),
                    user_id: req.body.user_id,
                    location:  req.body.location,
                    weather: weatherText,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                .then(() => {
                    return;
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({
                        status: "error",
                        error: err
                    });
                })
            }
        }
    });
};

exports.searchHistory = (req, res, next) => {
    const userId = req.params.userId;
    knex.select(['id', 'location', 'weather', 'created_at'])
        .from('search_history')
        .where('user_id', userId)
        .orderBy('created_at', 'desc')
        .then( result => {
            if(result.length >= 0) {
                return res.status(200).json({
                    status: "success",
                    history: result
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    error: "No result found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                status: "error",
                error: err
            });
        })
};






