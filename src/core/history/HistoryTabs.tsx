import './HistoryTabs.scss'
import React, { useEffect, useState } from "react";
import apiService from "../../shared/services/weather.service.tsx";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';

const HistoryTabs = () => {
    const [cities, setCities] = useState<string[]>([]);
    const [deletedCities, setDeletedCities] = useState<string[]>([]);

    const onCityClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        apiService.setCityValue(event.currentTarget.textContent);
    };

    const onCityDelete = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        event.stopPropagation();
        setCities(prevCities => {
            const updatedCities = [...prevCities];
            const deletedCity = event.currentTarget.parentElement.innerText;
            updatedCities.splice(prevCities.indexOf(deletedCity),1);
            setDeletedCities((prevDeletedCities) => [...prevDeletedCities, deletedCity]);
            return updatedCities;
        });
    };

    const onReverseChanges = () => {
        if (deletedCities.length > 0) {
            const lastDeletedCity = deletedCities[deletedCities.length - 1];
            setCities((prevCities) => [...prevCities, lastDeletedCity]);
            setDeletedCities((prevDeletedCities) => prevDeletedCities.slice(0, -1));
        }
    }

    useEffect(() => {
        const allInsertedCities = apiService.subscribeToNewCityUpdates().subscribe((newCity: string) => {
            setCities(prevCities => {
                if (newCity && prevCities.indexOf(newCity) === -1) {
                    return [...prevCities, newCity];
                }
                return prevCities;
            });
        })
        return () => {
            allInsertedCities.unsubscribe();
        };
    },[])

    return (
        <div className="history-container">
            {cities.length > 0 && (
                <div className="single-city">
                    {cities.map((city:string, index) => (
                        <div
                            onClick={onCityClick}
                            className="single-city__block"
                            key={index}>
                            <span
                                className="single-city__block__name">
                                {city}
                            </span>
                            <IconButton
                            aria-label="remove city from history"
                            onClick={onCityDelete}
                            edge="end"
                            >
                            <DeleteOutlineOutlinedIcon/>
                            </IconButton>
                        </div>
                    ))}
                </div>
            )}
            <div
                onClick={onReverseChanges}
                className="history-container__reverse">
                <div className="history-container__reverse__text">
                    Reverse changes?
                </div>
                <IconButton
                    aria-label="reverse to last step"
                    edge="end"
                >
                    <SettingsBackupRestoreOutlinedIcon/>
                </IconButton>
            </div>
        </div>
    );

}

export default HistoryTabs;