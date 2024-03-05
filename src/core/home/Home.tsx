import './Home.scss'
import HistoryTabs from '../history/HistoryTabs.tsx';
import React, {useEffect, useState } from 'react';
import apiService from './../../shared/services/weather.service.tsx';
import {ICountriesByCoordinates} from "../../shared/interfaces/contries.tsx";
import { format } from 'date-fns';

const Home = () => {
    const [latitude, setLatitude] = useState([]);
    const [longitude, setLongitude] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [weather, setWeather] = useState<ICountriesByCoordinates | null>(null);
    const [date, setDate] = useState(new Date());
    let isPromiseFufilled = false

    useEffect(() => {
        if (!dataFetched) {
            fetchData();
        }
        const fetchDataSubscription = apiService.subscribeToWeatherUpdates().subscribe((weather: ICountriesByCoordinates) => {
            if (!!Object.keys(weather).length) {
                setWeather(weather);
            }
        });
        return () => {
            fetchDataSubscription.unsubscribe();
        };
    }, [dataFetched]);

    const fetchData = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(position);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
            if (!isPromiseFufilled) {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setDataFetched(true);
                apiService.setDefaultLatAndLong(position.coords.latitude, position.coords.longitude);
                apiService.getWeatherByCoordinatesWithUpdates(Number(position.coords.latitude), Number(position.coords.longitude)).subscribe();

                isPromiseFufilled = true;
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="home-container">
            <HistoryTabs></HistoryTabs>
            <div className="weather-block">
                <div className="weather-block__current-date">
                    {format(date, 'EEEE, MMMM dd')}
                </div>
                <div className="weather-block__weather-details">
                    <div className="weather-block__weather-details__location">
                        Location: {weather?.name}
                    </div>
                    <div className="weather-block__weather-details__temperature">
                        Current Temperature: {weather?.main?.temp}C
                    </div>
                    <div className="weather-block__weather-details__description">
                        Weather : {weather?.weather[0]?.main}
                    </div>

                </div>
                <div className="weather-block__main-data">
                    <div className= "weather-block__main-data details-table-first-row">
                        <div className= "details-table-first-row__min">Min temperature : {weather?.main?.temp_min}</div>
                        <div className= "details-table-first-row__max">Max temperature : {weather?.main?.temp_max}</div>
                    </div>
                    <div className= "weather-block__main-data details-table-second-row">
                        <div className="wind-speed">Wind speed: {weather?.wind?.speed}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;