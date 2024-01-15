import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({
    celcius: 0,
    name: 'Город',
    humidity: 0,
    speed: 0,
    image: 'weather.png',
    current: ''
  })
  const [name, setName] = useState('');

  const [time, setTime] = useState('');

  const [dayweekend, setDayweekend] = useState('');

  function formatTime(val) {
    if (val < 10) {
      return '0'
    } else {
      return '';
    }
  }

  useEffect(() => {
    const timerID = setInterval(
      () => tick(), 1000)
    return function cleanup() {
      clearInterval(timerID)
    }
  })

  function tick() {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();

    
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const month = months[d.getMonth()];

    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const dayOfWeek = daysOfWeek[d.getDay()];

    const dayOfMonth = d.getDate();

    setTime(formatTime(h) + h + ':' + formatTime(m) + m);
    setDayweekend(`${dayOfWeek}, ${dayOfMonth} ${month}`);
  }

  const handleClick = () => {
    if (name !== '') {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=ec4cb39379bee03d7c959854916c4844&units=metric&lang=ru`
      axios.get(apiUrl)
        .then(res => {
          let currentWeather = '';
          let imagePath = '';
          if (res.data.weather[0].main == 'Clouds') {
            imagePath = 'weather.png'
            currentWeather = 'Облачно'
          } else if (res.data.weather[0].main == 'Clear') {
            imagePath = ''
            currentWeather = 'Солнечно'
          } else if (res.data.weather[0].main == 'Rain') {
            imagePath = ''
            currentWeather = 'Дождливо'
          } else if (res.data.weather[0].main == 'Drizzle') {
            imagePath = ''
            currentWeather = 'Дождливо'
          } else if (res.data.weather[0].main == 'Mist') {
            imagePath = ''
            currentWeather = 'Туманно'
          } else {
            imagePath = ''
            currentWeather = 'Ясно'
          }
          setData({
            ...data, celcius: res.data.main.temp, name: res.data.name,
            humidity: res.data.main.humidity, speed: res.data.wind.speed, image: imagePath, current: currentWeather
          })
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
              />
          <button><img src='location.png' alt='' onClick={handleClick}></img></button>
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
            <img src='weather.png' alt='weather'></img>
            <h1>{Math.round(data.celcius)}℃</h1>
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