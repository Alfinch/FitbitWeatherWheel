import document from 'document';
import dateFormat from 'dateformat';

const elements = [
    document.getElementById('secondaryDisplayA'),
    document.getElementById('secondaryDisplayB')
];

function setSecondaryDisplay(index, type, weather) {

    switch (type) {

        case 0: // Hidden
            elements[index].style.visibility = 'hidden';
            break;

        case 1: // Temperature
            elements[index].style.visibility = 'visible';
            elements[index].text = `${weather.hourlyTemp[0].toFixed(1)}°C`;
            break;

        case 2: // Weather
            elements[index].style.visibility = 'visible';
            elements[index].text = getWeatherDescription(weather.currentWeather);
            break;

        case 3: // Date
            elements[index].style.visibility = 'visible';
            elements[index].text = dateFormat(new Date(), 'mmm dS');
            break;
    }
}

function getWeatherDescription(weatherId) {

    if (200 <= weatherId && weatherId < 300) {
        return 'Thunderstorm';

    } else if (300 <= weatherId && weatherId < 400) {
        return 'Drizzle';

    } else if (400 <= weatherId && weatherId < 500) {
        return 'Rain';

    } else if (611 <= weatherId && weatherId <= 613) {
        return 'Sleet';

    } else if (600 <= weatherId && weatherId < 700) {
        return 'Snow';
        
    } else if (weatherId === 701) {
        return 'Mist';
        
    } else if (weatherId === 711) {
        return 'Smoke';
        
    } else if (weatherId === 721) {
        return 'Haze';
        
    } else if (weatherId === 731 || weatherId === 761) {
        return 'Dust';
        
    } else if (weatherId === 741) {
        return 'Fog';
        
    } else if (weatherId === 751) {
        return 'Sand';
        
    } else if (weatherId === 762) {
        return 'Ash';
        
    } else if (weatherId === 771) {
        return 'Squall';
        
    } else if (weatherId === 781) {
        return 'Tornado';
        
    } else if (weatherId === 800) {
        return 'Clear';
        
    } else if (weatherId === 801) {
        return 'Few clouds';

    } else if (weatherId === 802 || weatherId == 803) {
        return 'Clouds';

    } else if (weatherId === 804) {
        return 'Overcast';
    }
}

export default setSecondaryDisplay;