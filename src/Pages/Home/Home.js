import { Text, View, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Geolocation from '@react-native-community/geolocation';
import useFetch from '../../hooks/useFetch';
import { debounce } from "lodash"
import { fetchWeatherForecast, fetchWeatherLocations } from '../../utils/Weather';

const Home = () => {
    const [myLat, setMyLat] = useState()
    const [myLon, setMyLong] = useState()
    const [forecast, setForecast] = useState()
    const [refreshing, setRefreshing] = useState(false)
    const [locations, setLocations] = useState([])
    const [weather, setWeather] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadLocatAndFetch()

    }, [])

    const loadLocatAndFetch = async () => {
        Geolocation.getCurrentPosition(info => {
            console.log(info)
            setMyLat(info.coords.latitude)
            setMyLong(info.coords.longitude)

        })

    }

    useEffect(() => {
        fetchWeatherData()
    }, [])

    const fetchWeatherData = async () => {
        fetchWeatherForecast({
            cityName: "Istanbul",
            days: "7"
        }).then(data => {
            setLoading(false)
            setWeather(data)
        })
    }


    const handleLocation = (loc) => {
        setLoading(true)
        setLocations([])
        fetchWeatherForecast({
            cityName: loc.name,
            days: "7"
        }).then(data => {
            setLoading(false)
            setWeather(data)
            console.log("fetch forecast", data)
        })
    }

    const handleSearch = (value) => {
        if (value.length > 2) {
            fetchWeatherLocations({ cityName: value }).then(data => {
                setLocations(data)
            })
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])


    const { current, location } = weather

    if (loading) {
        return <View style={{ backgroundColor: 'royalblue ', flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>Loading...</Text>
        </View>
    }

    return (
        <View style={{ backgroundColor: 'royalblue ', flex: 1 }}>
            <TextInput
                onChangeText={handleTextDebounce}
                placeholder='Search City'
                placeholderTextColor='white'
                style={{ borderWidth: 2, borderColor: 'white', marginVertical: 5, marginHorizontal: 5, borderRadius: 10 }}
            />
            {locations.length > 0 && <View style={{ position: 'absolute', width: '100%', backgroundColor: 'gray', marginTop: 10, borderRadius: 10 }}>{locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length
                let borderClass = showBorder ? "backgroundColor:azure" : ""
                return (
                    <TouchableOpacity
                        onPress={() => handleLocation(loc)}
                        key={index}
                        style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 5, padding: 3, margin: 2 + borderClass }}
                    >
                        <Text style={{ color: 'black', fontSize: 16 }}>{loc?.name}, {loc?.country}</Text>
                    </TouchableOpacity>
                )
            })}

            </View>}

            <View style={{ margin: 5, justifyContent: 'space-around', }}>
                <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{location?.name},
                    <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', }}> {location?.country}</Text>
                </Text>
                <View style={{ alignItems: 'center', }}>
                    <Image source={{ uri: "https:" + current?.condition?.icon }} style={{ width: 200, height: 200 }} />
                    {/* <Image source={require("../../assets/partlycloudy.png")} style={{ width: 200, height: 200 }} /> */}
                </View>
                <View style={{ justifyContent: 'space-around' }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 35 }}>{current?.temp_c}</Text>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>{current?.condition?.text}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../../assets/wind.png")} resizeMode='contain' style={{ width: 50, height: 50 }} />
                        <Text style={{ color: 'white', fontSize: 16 }}>{current?.wind_kph}km</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../../assets/drop.png")} resizeMode='contain' style={{ width: 50, height: 50 }} />
                        <Text style={{ color: 'white', fontSize: 16 }}>{current?.humidity}%</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../../assets/sun.png")} resizeMode='contain' style={{ width: 50, height: 50 }} />
                        <Text style={{ color: 'white', fontSize: 16 }}>6:05 AM</Text>
                    </View>
                </View>

                <View style={{ marginTop: 40 }}>
                    <Text>Daily Forecast</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    >
                        {weather?.forecast?.forecastday?.map((item, index) => {
                            let date = new Date(item.date)
                            let options = { weekday: "long" }
                            let dayName = date.toLocaleDateString("en-US", options)
                            dayName = dayName.split(",")[0]
                            return (
                                <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20, padding: 5, margin: 5, backgroundColor: 'beige ' }}>
                                    {/* <Image source={require("../../assets/heavyrain.png")} style={{ width: 50, height: 50 }} /> */}
                                    <Image source={{ uri: "https:" + item?.day?.condition?.icon }} style={{ width: 50, height: 50 }} />

                                    <Text style={{ fontSize: 16, color: 'white' }}>{dayName}</Text>
                                    <Text style={{ fontSize: 16, color: 'white' }}>{item?.day?.avgtemp_c}</Text>
                                </View>
                            )
                        })}

                    </ScrollView>
                </View>

            </View>

        </View>
    )
}

export default Home
