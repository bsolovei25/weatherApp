export interface ICountries {
    code: string;
    label: string;
    phone: string;
    suggested?: boolean;
}

export interface IWeather {
    "id": number,
    "main": string,
    "description": string,
    "icon": string
}

export interface IMain {
    "temp": number,
    "feels_like": number,
    "temp_min": number,
    "temp_max": number,
    "pressure": number,
    "humidity": number,
    "sea_level": number,
    "grnd_level": number
}

export interface IWind {
    "speed": number,
    "deg": number,
    "gust": number
}

export interface IRain {
    "1h": number
}

export interface IClouds {
    "all": number
}
export interface ISys {
    "type": number,
    "id": number,
    "country": string,
    "sunrise": number,
    "sunset": number
}

export interface ICountriesByCoordinates {
    "coord": {},
    "weather": IWeather[],
    "base": string,
    "main": IMain,
    "visibility": number,
    "wind": IWind,
    "rain": IRain,
    "clouds": IClouds,
    "dt": number,
    "sys": ISys,
    "timezone": number,
    "id": number,
    "name": string,
    "cod": number
}

export interface ICoordinatesByCityName {
    "name":string,
    "local_names":{},
    "lat":number,
    "lon":number,
    "country":string,
    "state":string
}

export interface ICityData {
    name: string;
    id: number;
}