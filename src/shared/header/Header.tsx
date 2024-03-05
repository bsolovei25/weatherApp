import React, { useState } from 'react';
import open_weather from '../assets/open_weather.png'
import './Header.scss'
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import SearchIcon from '@mui/icons-material/Search';
import apiService from './../../shared/services/weather.service.tsx';

const Header: React.FC = () => {
    const [city, setCity] = useState('');
    const handleClickOnCityChoose = () => {
        apiService.setCityValue(city);
    }

    return (
        <div className="headerBlock">
            <div className="headerBlock__image">
                <img className="headerBlock__image__picture" src={open_weather} alt="open_logo"/>
            </div>
            <div className="headerBlock__select">
                <FormControl className='input-box' sx={{ m: 1, width: '25ch' }} variant="filled">
                    <InputLabel htmlFor="filled-adornment-password">Enter city</InputLabel>
                    <FilledInput
                        id="city-id"
                        disableUnderline
                        className="input-text"
                        type={'text'}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickOnCityChoose}
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
        </div>
    );
};

export default Header;