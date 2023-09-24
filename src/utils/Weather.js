import axios from "axios"

const weatherKey = "12f13014aabe412eb2f171032232309"

const forcastEndPoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`

const locationsEndPoint = params => `https://api.weatherapi.com/v1/search.json?key=${weatherKey}&q=${params.cityName}`

const apiCall = async (endpoint) => {
    const options = {
        method: "GET",
        url: endpoint
    }
    try {
        const response = await axios.request(options)
        return response.data
    } catch (error) {
        console.log("error", error)
        return null
    }
}

export const fetchWeatherForecast = params => {
    let forecastUrl = forcastEndPoint(params)
    return apiCall(forecastUrl)
}
export const fetchWeatherLocations = params => {
    let locationsUrl = locationsEndPoint(params)
    return apiCall(locationsUrl)
}