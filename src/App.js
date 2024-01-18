import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Состояние для хранения погодных данных
  const [data, setData] = useState({
    celcius: 0,
    name: 'Город',
    humidity: 0,
    speed: 0,
    image: 'Sunnynew.png',
    current: ''
  });

  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [dayweekend, setDayweekend] = useState('');

  // Функция для форматирования времени
  function formatTime(val) {
    return val < 10 ? '0' + val : val;
  }

  // Функция для обновления времени каждую секунду
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  // Функция для установки текущего времени и даты
  function tick() {
    const d = new Date();
    const h = formatTime(d.getHours());
    const m = formatTime(d.getMinutes());
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const month = months[d.getMonth()];
    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const dayOfWeek = daysOfWeek[d.getDay()];
    const dayOfMonth = d.getDate();
    setTime(`${h}:${m}`);
    setDayweekend(`${dayOfWeek}, ${dayOfMonth} ${month}`);
  }

  // Функция для получения текущего местоположения пользователя
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeatherForCurrentLocation, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // Функция для получения данных о погоде для текущего местоположения
  const getWeatherForCurrentLocation = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ec4cb39379bee03d7c959854916c4844&units=metric&lang=ru`;
    axios.get(apiUrl)
      .then(res => {
        updateWeatherData(res);
      })
      .catch(err => console.log(err));
  };

  // Функция обновления погодных данных
  const updateWeatherData = (res) => {
    let currentWeather = '';
    let imagePath = '';
    switch (res.data.weather[0].main) {
      case 'Clouds':
        imagePath = 'Cloudsnew.png';
        currentWeather = 'Облачно';
        break;
      case 'Clear':
        imagePath = 'Clearsnew.png';
        currentWeather = 'Солнечно';
        break;
      case 'Rain':
      case 'Drizzle':
        imagePath = 'Rainnew.png';
        currentWeather = 'Дождливо';
        break;
      case 'Mist':
        imagePath = 'Mistnew.png';
        currentWeather = 'Туманно';
        break;
      default:
        imagePath = 'Sunnynew.png';
        currentWeather = 'Ясно';
    }
    setData({
      ...data, 
      celcius: res.data.main.temp, 
      name: res.data.name,
      humidity: res.data.main.humidity, 
      speed: res.data.wind.speed, 
      image: imagePath, 
      current: currentWeather
    });
  }

  // Функция для обработки ошибок геолокации
  const showError = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }

  // Выборка местоположения пользователя при монтировании компонента
  useEffect(() => {
    getLocation();
  }, []);

  // Функция для обработки поиска по городу
  const handleClick = () => {
    if (name !== '') {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=ec4cb39379bee03d7c959854916c4844&units=metric&lang=ru`;
      axios.get(apiUrl)
        .then(res => {
          updateWeatherData(res);
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <div className='container'>
      <div className='small-container'>
        <div className='searchbox'>
          <div className='weather-header__current_weather'>
            <h3>{data.current}</h3>
          </div>
          <div className='namesearch'>
            <h2>Введите город</h2>
            <div className='search'>
              <input
                type='text'
                placeholder='Поиск города'
                className='search_input'
                onChange={e => setName(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleClick();
                  }
                }}
              />
          <button onClick={handleClick}><img src='location.png' alt=''></img></button>
            </div>
          </div>
          <div className='weather-header-current-date'>
            <h3 className='time'>Текущее время: {time}</h3>
            <div className='weather-header-current-date__weekend'>
              <h3 className='dayweekend'>{dayweekend}</h3>
            </div>
          </div>
        </div>
        <div className='weather-footer'>
          <div className='weather-footer__main'>
            <h2>{data.name}</h2>
            <img src={data.image} alt='weather'></img>
            <h2>{Math.round(data.celcius)}℃</h2>
          </div>
          <div className='weather-footer-container'>
          <div className='weather-footer__wind'>
            <img src='wind.png' alt='wind'></img>
            <h2>{data.speed} м/с</h2>
          </div>
          <div className='weather-footer__humidity'>
            <img src='wet.png' alt='wet'></img>
            <h2>{data.humidity}%</h2>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default App