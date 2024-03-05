import { Observable, from, combineLatest } from 'rxjs';
import {ICoordinatesByCityName, ICountriesByCoordinates} from '../interfaces/contries';
import { BehaviorSubject } from 'rxjs';
import {fromFetch} from "rxjs/fetch";
import { catchError, switchMap, tap, map } from 'rxjs/operators';

class ApiService {
    public apiUrl = process.env.REACT_APP_API_URL;
    public apiKey = process.env.REACT_APP_API_KEY;
    private _weather = new BehaviorSubject<ICountriesByCoordinates>([]);
    private _cityHistory = new BehaviorSubject<{}>();
    private defaultLatitude = new BehaviorSubject();
    private defaultLongitude = new BehaviorSubject();

    public setCityValue(cityName) {
        this.getLatLongByName(cityName.trim().toLowerCase());
    }

    public setDefaultLatAndLong(latitude : number, longitude: number) {
        this.defaultLatitude.next(latitude);
        this.defaultLongitude.next(longitude);
    }

    public getLatLongByName(cityName) {
        fromFetch(`${this.apiUrl}/geo/1.0/direct?q=${cityName}&APPID=${this.apiKey}&units=metric`)
            .pipe(
                switchMap((response) => {
                    if (response.ok) {
                        return from(response.json());
                    } else {
                        throw new Error('Error fetching latitude and longitude by city name');
                    }
                }),
                switchMap((coordinates: ICoordinatesByCityName) => {
                    let lat = '';
                    let lon = '';
                    if (coordinates.length) {
                        lat = coordinates[0].lat;
                        lon = coordinates[0].lon;
                    }
                    else {
                        this.combinedValues$.subscribe(combinedValues => {
                            lat = combinedValues.lat;
                            lon = combinedValues.lon;
                        });
                    }
                    return this.getWeatherByCoordinatesWithUpdates(lat, lon);
                }),
                catchError(error => {
                    console.error('Error:', error);
                    throw error;
                })
            )
            .subscribe();
    }

    public combinedValues$ = combineLatest([this.defaultLatitude, this.defaultLongitude]).pipe(
        map(([lat, lon]) => {
            return { lat, lon };
        })
    );

    public getWeatherByCoordinatesWithUpdates(latitude: number, longitude: number) : Observable<ICountriesByCoordinates> {
        return fromFetch(`${this.apiUrl}/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${this.apiKey}&units=metric`).pipe(
            switchMap(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching data');
                }
            }),
            catchError(error => {
                console.error('Error:', error);
                throw error;
            }),
            tap((weather: ICountriesByCoordinates) =>
            {
                this._weather.next(weather);
                this._cityHistory.next(weather.name);
            })
        );
    }

    public subscribeToWeatherUpdates(): Observable<ICountriesByCoordinates> {
        return this._weather.asObservable();
    }

    public subscribeToNewCityUpdates(): Observable<string[]> {
        return this._cityHistory.asObservable();
    }

}

export default new ApiService();