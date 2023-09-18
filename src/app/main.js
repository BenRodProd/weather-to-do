'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import requestWeather from './API/Request';
import {
  StyledInput,
  Button,
  MainDiv,
  Decision,
  StyledModal,
  BackgroundImage,
  SettingsButton,
  AddButton,
  ErrorMessage,
  CurrentMessage
} from './components/Styles';
import handleLogout from '@/service/logout';
import writeToDatabase from '@/service/write';
import fetchUserCityFromDatabase from '@/service/fetchCity';
import fetchUserTasksFromFirestore from '@/service/fetchTasks';
import DisplayTasks from './components/DisplayTasks';
import Settings from './components/Settings';
import AddTask from './components/AddTask';
import { TaskSelect } from './components/RandomTaskSelect';

export default function Main({ user }) {
  const [city, setCity] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [settings, setSettings] = useState(false);
  const [add, setAdd] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [rainy, setRainy] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [backgroundImageSrc, setBackgroundImageSrc] = useState('');

  useEffect(() => {
    fetchUserCityFromDatabase(user.email)
      .then((city) => {
        setCity(city);
      })
      .catch((error) => {});
    async function fetchData() {
      try {
        const weatherData = await requestWeather(city);
        setData(weatherData); // Update the state with fetched data
        setRainy(weatherData.current.condition.text.includes('rain'));

        if (rainy) {
          const randomImageNumber = Math.floor(Math.random() * 3);
          setBackgroundImageSrc(`/assets/rain${randomImageNumber}.webp`);
        } else {
          const randomImageNumber = Math.floor(Math.random() * 7);
          setBackgroundImageSrc(`/assets/sun${randomImageNumber}.webp`);
        }
      } catch (error) {
        if (error.code === 1006 || error.code === 400) {
          setData(null);
          setError(true);
        }
      }
    }

    if (city) {
      fetchData();
    }
  }, [city, user.email]);

  useEffect(() => {
    if (user) {
      fetchUserTasksFromFirestore(user.email).then((tasks) => {
        setAllTasks(tasks);
      });
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    if (today.getHours() > 7 && today.getHours() < 12) {
      setCurrentTime('Morgen');
    } else if (today.getHours() >= 12 && today.getHours() < 15) {
      setCurrentTime('Mittag');
    } else if (today.getHours() >= 15 && today.getHours() < 18) {
      setCurrentTime('Nachmittag');
    } else if (today.getHours() >= 18 && today.getHours() < 21) {
      setCurrentTime('Abend');
    } else {
      setCurrentTime('Nacht');
    }

    setDisplayTasks(
      allTasks.filter((task) => {
        const isTimeOptionMatch =
          task.timeOption === currentTime || task.timeOption === 'egal wann';
        const isWeatherOptionMatch =
          (task.weatherOption === 'schlechtes Wetter' && rainy) ||
          (task.weatherOption === 'gutes Wetter' && !rainy) ||
          task.weatherOption === 'jedes Wetter';
        if (
          task.repeatOption === 'no repeat' &&
          task.weatherOption === 'jedes Wetter' &&
          task.timeOption === 'egal wann'
        ) {
          return true;
        } else if (isTimeOptionMatch && isWeatherOptionMatch) {
          if (task.repeatOption !== 'no repeat') {
            if (task.repeatOption === 'täglich') {
              const lastDoneDate = task.done?.toDate();
              const oneDayAgo = new Date(today);
              oneDayAgo.setDate(today.getDate() - 1);
              return !lastDoneDate || lastDoneDate <= oneDayAgo;
            } else if (task.repeatOption === 'wöchentlich') {
              const lastDoneDate = task.done?.toDate();
              const oneWeekAgo = new Date(today);
              oneWeekAgo.setDate(today.getDate() - 7);

              return !lastDoneDate || lastDoneDate <= oneWeekAgo;
            }
          } else {
            return true;
          }
        }
        return false;
      })
    );
  }, [allTasks, data]);

  async function handleChangeCity(e) {
    e.preventDefault();
    const newCity = e.target.city.value;

    try {
      // Attempt to fetch weather data for the new city
      const weatherData = await requestWeather(newCity);

      if (weatherData.error) {
        // If the city is not recognized by the API, set the error state to true
        setError(true);
      } else {
        // If the city is recognized, update the state and clear the error
        setData(weatherData);
        setError(false);
        setCity(newCity);
        // Write the new city to the database
        writeToDatabase(user.email, newCity);
      }
    } catch (error) {
      // If there is an error while fetching data, set the error state to true
      setError(true);
    }
  }

  const randomTask = () => {
    if (displayTasks.length > 0) {
      // Randomly select a task index
      const randomIndex = Math.floor(Math.random() * displayTasks.length);
      const task = displayTasks[randomIndex];
      setSelectedTask(task);
    }
  };

  if (!city || !data) {
    // If the user's city is not found in the database or data is not available
    return (
      <StyledModal backdrop="blur" isOpen={true} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Willkommen {user.displayName}...</ModalHeader>
          <div>
            <form onSubmit={(e) => handleChangeCity(e)}>
              <StyledInput required type="text" name="city" placeholder="City"></StyledInput>
              <Button type="submit">Suche</Button>
            </form>
          </div>
          {error && <ErrorMessage>Stadt nicht gefunden</ErrorMessage>}
          <Button onClick={() => handleLogout()}>Logout</Button>
        </ModalContent>
      </StyledModal>
    );
  }

  // If the user's city is found in the database and data is available

  return (
    <>
      <MainDiv>
        <SettingsButton onClick={() => setSettings((prevSettings) => !prevSettings)}>
          <Image src="/settings.png" alt="settings" width="30" height="30" />
        </SettingsButton>
        <AddButton onClick={() => setAdd((prevSettings) => !prevSettings)}>
          <Image src="/add.png" alt="add" width="30" height="30" />
        </AddButton>
        <CurrentMessage>
          <h2>Es ist im Moment {rainy ? 'regnerisch' : 'nicht regnerisch'}</h2>
          {displayTasks.length > 0 ? (
            <h2>
              Für {currentTime === 'Nacht' ? 'diese' : 'diesen'} {currentTime} hast du{' '}
              {displayTasks.length > 1
                ? 'diese Aufgaben zur Auswahl:'
                : 'diese Aufgabe zu erledigen:'}
            </h2>
          ) : (
            'Du hast gerade keine Aufgaben...'
          )}
        </CurrentMessage>
        {displayTasks.length > 0 && (
          <>
            <DisplayTasks setAllTasks={setAllTasks} user={user} displayTasks={displayTasks} />
          </>
        )}
        <BackgroundImage
          priority
          alt="backgroundimage"
          height="1024"
          width="1024"
          src={backgroundImageSrc}
        ></BackgroundImage>
        <Decision>
          {displayTasks.length > 1 && (
            <Button onClick={() => randomTask()}>Ich kann mich nicht entscheiden</Button>
          )}
        </Decision>
      </MainDiv>
      {settings && (
        <Settings
          error={error}
          settings={settings}
          setSettings={setSettings}
          city={city}
          handleChangeCity={handleChangeCity}
        />
      )}
      {add && <AddTask user={user} add={add} setAdd={setAdd} setAllTasks={setAllTasks} />}
      {selectedTask && <TaskSelect setSelectedTask={setSelectedTask} selectedTask={selectedTask} />}
    </>
  );
}
