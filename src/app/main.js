"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
  Button,
  Radio,
  RadioGroup
} from "@nextui-org/react";
import requestWeather from "./API/Request";
import styled from "styled-components";
import handleLogout from "@/service/logout";
import writeToDatabase from "@/service/write";
import fetchUserCityFromDatabase from "@/service/fetchCity";
import writeTaskToDatabase from "@/service/writeTask";
import fetchUserTasksFromFirestore from "@/service/fetchTasks";
const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8rem;
  min-height: 100vh;
`;

const RadioStyle = styled.div`
display:flex;
user-select: none;
label {
  margin-left: 1rem;
  user-select:none;
}
`

const TaskBoard = styled.div`
display:grid;

@media screen and (min-width: 768px) {
  
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: 1fr 1fr 1fr 1fr;
}
@media screen and (min-width: 450px) and (max-width: 768px) {
  
  grid-template-columns: repeat(3, 33%);
  grid-template-rows: 1fr 1fr 1fr;
}

@media screen and (max-width: 350px) {
  
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}


grid-gap: 1rem;
`



const TaskCard = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border: 2px solid black;
  border-radius: 10px;
  list-style: none;
  margin: 1rem;
`

const BackDropper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2rem);
  z-index:-1;
`;

const StyledModal = styled(Modal)`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
border: 3px solid black;
  position:absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: lightgray;
  border-radius: 10px;
  padding: 20px;
  gap:3rem;
  user-select: none;
`;

const NoRadio = styled.input`
  display: none;
`

const SettingsButton = styled.button`
position: absolute;
top:0;
left: 0;
  background-color: #000000;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 10px;
`;
const AddButton = styled.button`
position: absolute;
top:0;
right: 0;
  background-color: #000000;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 10px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  

`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;


export default function Main({ user }) {
  const [city, setCity] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [settings, setSettings] = useState(false);
  const [add, setAdd] = useState(false);
  const [showWeatherOptions, setShowWeatherOptions] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
const [displayTasks, setDisplayTasks] = useState([]);
  const [weatherOption, setWeatherOption] = useState('goodWeather');
const [currentTime, setCurrentTime] = useState('');
  const [timeOption, setTimeOption] = useState('morning');
 const [rainy, setRainy] = useState(false);
  const [repeatOption, setRepeatOption] = useState('daily');


  useEffect(() => {
    // Define an asynchronous function to fetch data
    fetchUserCityFromDatabase(user.email)
      .then((city) => {
        
        setCity(city);
      })
      .catch((error) => {
        console.error("Error fetching user's city:", error);
      });
    async function fetchData() {
      try {
        const weatherData = await requestWeather(city);
        setData(weatherData); // Update the state with fetched data
        setRainy("forecast",weatherData.forecast.forecastday[0].day.condition.text.includes("rain"))

      } catch (error) {
        console.error("Error fetching weather data:", error);
        if (error.code === 1006 || error.code === 400) {
          setData(null);
          setError(true);
        }
      }
    }

    // Call the async function to fetch data
    if (city) {
    fetchData();
  }
    // Fetch the user's city from the database
    // Replace 'fetchUserCityFromDatabase' with the actual function to fetch the user's city
  }, [city, user.email]);

  useEffect(() => {
    if (user) {
      fetchUserTasksFromFirestore(user.email)
  .then((tasks) => {
   
      setAllTasks(tasks)
      
    })
  }

  },[])

useEffect(() => {
  let today = new Date();
  if (today.getHours() > 7 && today.getHours() < 12) {
    setCurrentTime("morning")
  } else if (today.getHours() >= 12 && today.getHours() < 15) {
    setCurrentTime("noon")
  } else if (today.getHous() >= 15 && today.getHours() < 18) {
    setCurrentTime("afternoon")
  } else if (today.getHours() >= 18 && today.getHours() < 21) {
    setCurrentTime("evening")
  } else {
    setCurrentTime("night")
  }
  
 

  setDisplayTasks(allTasks.filter(task => {
    return task.timeOption === currentTime || task.timeOption === "all day"
  }).filter(task => {
    return (task.weatherOption === "badWeather" && rainy) || (task.weatherOption === "goodWeather" && !rainy) || (task.weatherOption === "any weather")
  }
    )
  )
},[allTasks])


  function HandleSubmitTask(e) {
    e.preventDefault();
  
    // Initialize variables with default values
    let weatherOptionValue = "any weather";
    let timeOptionValue = "all day";
    let repeatOptionValue = "no repeat";
  
    // Check the state of "allDay," "weather," and "repeat" checkboxes and set variables accordingly
    if (e.target.allDay.checked) {
      timeOptionValue = "all day";
    }
  
    if (!showWeatherOptions || !e.target.weather.checked) {
      weatherOptionValue = "any weather";
    }
  
    if (!e.target.repeat.checked) {
      repeatOptionValue = "no repeat";
    }
  
 
  
    // Pass the variables to the writeTaskToDatabase function
    writeTaskToDatabase(
      e.target.name.value,
      e.target.weather.value,
      weatherOptionValue,
      e.target.allDay.value,
      timeOptionValue,
      e.target.repeat.value,
      repeatOptionValue,
      user.email
    );
  
    // Reset the form
    e.target.reset();
    fetchUserTasksFromFirestore(user.email)
  .then((tasks) => {
   
      setAllTasks(tasks)})
  }

  async function HandleChangeCity(e) {
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
      console.error("Error fetching weather data:", error);
  
      // If there is an error while fetching data, set the error state to true
      setError(true);
    }
  }
  


const handleWeatherChange = (e) => {
  setShowWeatherOptions(e.target.checked);
};
const handleRepeatOptionChange = (e) => {
  setRepeatOption(e.target.value);
};
const handleAllDayChange = (e) => {
  setShowTimeOptions(!e.target.checked);
};
const handleWeatherOptionChange = (e) => {
  setWeatherOption(e.target.value);
};
const handleTimeOptionChange = (e) => {
  setTimeOption(e.target.value);
};
const handleRepeatChange = (e) => {
  setShowRepeatOptions(e.target.checked);
}

if (!city || !data) {
  // If the user's city is not found in the database or data is not available
  return (
    <StyledModal backdrop="blur" isOpen={true} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Welcome {user.displayName}...</ModalHeader>
        <div>
          <form onSubmit={(e) => HandleChangeCity(e)}>
            <input
              required
              type="text"
              name="city"
              placeholder="City"
            ></input>
            <button type="submit">Search</button>
          </form>
        </div>
            {error && <ErrorMessage>City not found</ErrorMessage>}
        <button onClick={() => handleLogout()}>Logout</button>
      </ModalContent>
    </StyledModal>
  );
}
console.log("all tasks", allTasks, "time", currentTime, "display", displayTasks)
// If the user's city is found in the database and data is available






return (
  <>
    <MainDiv>
      <SettingsButton onClick={() => setSettings(prevSettings => !prevSettings)}>Settings</SettingsButton>
      <AddButton onClick={() => setAdd(prevSettings => !prevSettings)}>Add</AddButton>
      <TaskBoard>
      {displayTasks.length > 0 && (
        <>
        {displayTasks.map((task) => {
          return <TaskCard key={task.id}>
           <li>{task.name}</li>
           <li>{task.repeatOption}</li>
           <li>{task.timeOption}</li>
           <li>{task.weatherOption}</li>
           </TaskCard>
        })}
        </>
      )}
      </TaskBoard>
      <p>{data.location && data.location.name}</p>
     <p>{data.location && data.location.localtime}</p>
     <p>Max Temp: {data.forecast.forecastday[0].day.maxtemp_c}</p>
     <p>{data.forecast.forecastday[0].day.condition.text}</p>
     <Image
       src={"https://" + data.forecast.forecastday[0].day.condition.icon}
       width={150}
       height={150}
       alt="icon"
     />
    </MainDiv>
    {settings && (
      <BackDropper>
      <StyledModal backdrop="blur" isOpen={settings} onOpenChange={setSettings} onClose={setSettings}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">chosen City: {city}</ModalHeader>
              <ModalBody>
                <form onSubmit={(e) => HandleChangeCity(e)}>
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="City"
                  ></input>
                 
                  <button type="submit">Search</button>
                </form>
                {error && <ErrorMessage>City not found</ErrorMessage>}
                <button onClick={() => handleLogout()}>Logout</button>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </StyledModal>
      </BackDropper>
    )}
        {add && (
          <BackDropper>
      <StyledModal backdrop="blur" isOpen={add} onOpenChange={setAdd} onClose={setAdd}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader >Enter new Task</ModalHeader>
              <ModalBody>
              <StyledForm onSubmit={HandleSubmitTask}>
  <input required type="text" name="name" placeholder="Taskname" />

  <label htmlFor="weather">Depends on weather?</label>
  <input
    type="checkbox"
    name="weather"
    id="weather"
    onChange={handleWeatherChange}
    defaultValue="off"
  />

  {showWeatherOptions && (
    <div>
      <label htmlFor="goodWeather" style={{ color: weatherOption === 'goodWeather' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="goodWeather"
          name="weatherOption"
          value="goodWeather"
          checked={weatherOption === 'goodWeather'}
          onChange={handleWeatherOptionChange}
          defaultChecked
        />{" "}
        Good Weather
      </label>
      <label htmlFor="badWeather" style={{ color: weatherOption === 'badWeather' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="badWeather"
          name="weatherOption"
          value="badWeather"
          checked={weatherOption === 'badWeather'}
          onChange={handleWeatherOptionChange}
        />{" "}
        Bad Weather
      </label>
    </div>
  )}

  <label htmlFor="allDay">All Day?</label>
  <input
    defaultValue="on"
    defaultChecked
    type="checkbox"
    name="allDay"
    id="allDay"
    onChange={handleAllDayChange}
  />

  {showTimeOptions && (
    <div>
      <label htmlFor="morning" style={{ color: timeOption === 'morning' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="morning"
          name="timeOption"
          value="morning"
          checked={timeOption === 'morning'}
          onChange={handleTimeOptionChange}
          defaultChecked
        />{" "}
        Morning
      </label>
      <label htmlFor="noon" style={{ color: timeOption === 'noon' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="noon"
          name="timeOption"
          value="noon"
          checked={timeOption === 'noon'}
          onChange={handleTimeOptionChange}
        />{" "}
        Noon
      </label>
      <label htmlFor="afternoon" style={{ color: timeOption === 'afternoon' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="afternoon"
          name="timeOption"
          value="afternoon"
          checked={timeOption === 'afternoon'}
          onChange={handleTimeOptionChange}
        />{" "}
        Afternoon
      </label>
      <label htmlFor="evening" style={{ color: timeOption === 'evening' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="evening"
          name="timeOption"
          value="evening"
          checked={timeOption === 'evening'}
          onChange={handleTimeOptionChange}
        />{" "}
        Evening
      </label>
      <label htmlFor="night" style={{ color: timeOption === 'night' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="night"
          name="timeOption"
          value="night"
          checked={timeOption === 'night'}
          onChange={handleTimeOptionChange}
        />{" "}
        Night
      </label>
    </div>
  )}

  <label htmlFor="repeat">Repeat?</label>
  <input
    type="checkbox"
    name="repeat"
    id="repeat"
    onChange={handleRepeatChange}
    defaultValue="off"
  />

  {showRepeatOptions && (
    <div>
      <label htmlFor="daily" style={{ color: repeatOption === 'daily' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="daily"
          name="repeatOption"
          value="daily"
          checked={repeatOption === 'daily'}
          onChange={handleRepeatOptionChange}
          
        />{" "}
        Daily
      </label>
      <label htmlFor="weekly" style={{ color: repeatOption === 'weekly' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="weekly"
          name="repeatOption"
          value="weekly"
          checked={repeatOption === 'weekly'}
          onChange={handleRepeatOptionChange}
        />{" "}
        Weekly
      </label>
      {/* Add other repeat options here */}
    </div>
  )}

  <button type="submit">Submit</button>
</StyledForm>


                {error && <ErrorMessage>City not found</ErrorMessage>}
                <button onClick={() => handleLogout()}>Logout</button>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </StyledModal>
      </BackDropper>
    )}
  </>
);
          }