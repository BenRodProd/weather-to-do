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
  
  
} from "@nextui-org/react";
import requestWeather from "./API/Request";
import styled, { keyframes } from "styled-components";
import handleLogout from "@/service/logout";
import writeToDatabase from "@/service/write";
import fetchUserCityFromDatabase from "@/service/fetchCity";
import writeTaskToDatabase from "@/service/writeTask";
import fetchUserTasksFromFirestore from "@/service/fetchTasks";
import HandleDeleteTask from "@/service/deleteTask";

const Zoom = keyframes`
  0% {
    opacity: 0;
    z-index:2;
    scale:2;
    width:200%;
    height:200%
  }
  100% {
    opacity: 1;
    z-index:0;
    scale:1;
    width:85%;
    height:85%;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid black;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  user-select: none;
`;

const MainDiv = styled.div`
  display: flex;
  position:relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  height: 100%;
  width: 100%;
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
position:relative;
align-self:center;

width:80%;
height:75vh;

overflow-y: auto;
@media screen and (min-width: 870px) {
  
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
}
@media screen and (min-width: 400px) and (max-width: 870px) {
  
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

@media screen and (max-width: 400px) {
  
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
grid-gap: 2rem;


`



const TaskCard = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  border: 2px solid black;
  border-radius: 10px;
  list-style: none;
  margin: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
`

const BackDropper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(7px);
  z-index:0;
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
  z-index:1;
  text-align: center;
`;

const StyledModalFooter = styled(ModalFooter)`
  display:flex;
  justify-content: center;
  align-items: center;
`

const BackgroundImage = styled(Image)`
position:absolute;
top:50%;
left:50%;
transform: translate(-50%, -50%);
width:85%;
height:85%;

z-index:-1;
object-fit: cover;

border: 10px solid burlywood;

animation: ${Zoom} 1s ease-in;

`

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

const CurrentMessage = styled.div`
  display: flex;
  font-size: 0.8rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 4rem 2rem 0 2rem;
  text-align: center;
  color: antiquewhite;
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid black;
  border-radius: 10px;
  text-shadow: 2px 2px 8px #000000; 

  @media screen and (max-width: 800px) {
    margin-top: 4rem;
  }
  @media screen and (min-width:800px) {
    margin-top: 0rem;
  }
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
  const [weatherOption, setWeatherOption] = useState('good weather');
  const [timeOption, setTimeOption] = useState('morning');
  const [repeatOption, setRepeatOption] = useState('daily');
  const [allDayChecked, setAllDayChecked] = useState(true);
  const [weatherChecked, setWeatherChecked] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [rainy, setRainy] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
const [backgroundImageSrc, setBackgroundImageSrc] = useState("");
  useEffect(() => {
    // Define an asynchronous function to fetch data
    fetchUserCityFromDatabase(user.email)
      .then((city) => {
        
        setCity(city);
      })
      .catch((error) => {
       
      });
    async function fetchData() {
      try {
        const weatherData = await requestWeather(city);
        setData(weatherData); // Update the state with fetched data
        setRainy(weatherData.current.condition.text.includes("rain"))
        
        if (rainy) {
          const randomImageNumber = Math.floor(Math.random() * 3);
          setBackgroundImageSrc(
            `/assets/rain${randomImageNumber}.webp`
          )
        } else {
          const randomImageNumber= Math.floor(Math.random() * 7);
          setBackgroundImageSrc(
            `/assets/sun${randomImageNumber}.webp`
          )
        }

      } catch (error) {
        
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
  } else if (today.getHours() >= 15 && today.getHours() < 18) {
    setCurrentTime("afternoon")
  } else if (today.getHours() >= 18 && today.getHours() < 21) {
    setCurrentTime("evening")
  } else {
    setCurrentTime("night")
  }
  
 

  setDisplayTasks(allTasks.filter(task => {
    return task.timeOption === currentTime || task.timeOption === "all day"
  }).filter(task => {
    return (task.weatherOption === "bad weather" && rainy) || (task.weatherOption === "good weather" && !rainy) || (task.weatherOption === "any weather")
  }
    )
  )


  console.log(allTasks, data)
},[allTasks, data])


function HandleSubmitTask(e) {
  e.preventDefault();

  // Initialize variables with default values
  let weatherOptionValue = "any weather";
  let timeOptionValue = "all day";
  let repeatOptionValue = "no repeat";

  // Check the state of "allDay," "weather," and "repeat" checkboxes and set variables accordingly
  if (e.target.allDay.checked) {
    timeOptionValue = "all day";
  } else {
    timeOptionValue = e.target.timeOption.value;
  }

  if (!showWeatherOptions || !e.target.weather.checked) {
    weatherOptionValue = "any weather";
  } else if (showWeatherOptions) {
    weatherOptionValue = e.target.weatherOption.value;
  }

  if (!e.target.repeat.checked) {
    repeatOptionValue = "no repeat";
  } else if (showRepeatOptions) {
    repeatOptionValue = e.target.repeatOption.value;
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
      
      setShowRepeatOptions(false);
      setShowTimeOptions(false);
      setShowWeatherOptions(false);
      setAllDayChecked(true);
      setWeatherChecked(false);
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
      
  
      // If there is an error while fetching data, set the error state to true
      setError(true);
    }
  }
  
async function DeleteTask(id) {
  await HandleDeleteTask(id);
  fetchUserTasksFromFirestore(user.email)
  .then((tasks) => {
    setAllTasks(tasks)
  })
}

const handleWeatherChange = (e) => {
  setShowWeatherOptions(e.target.checked);
  setWeatherChecked(e.target.checked);
};
const handleRepeatOptionChange = (e) => {
  setRepeatOption(e.target.value);
};
const handleAllDayChange = (e) => {
  setShowTimeOptions(!e.target.checked);
  setAllDayChecked(e.target.checked);
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

const randomTask = () => {
  if (displayTasks.length > 0) {
    // Randomly select a task index
    const randomIndex = Math.floor(Math.random() * displayTasks.length);
    const task = displayTasks[randomIndex];
    setSelectedTask(task);
console.log(displayTasks[randomIndex], task, randomIndex, selectedTask)
  }
};


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

// If the user's city is found in the database and data is available






return (
  <>
    <MainDiv>
      <SettingsButton onClick={() => setSettings(prevSettings => !prevSettings)}>Settings</SettingsButton>
      <AddButton onClick={() => setAdd(prevSettings => !prevSettings)}>Add</AddButton>
      <CurrentMessage>
        <h2>In the moment {rainy ? "it could be rainy" : "it is not rainy"}</h2>
        {displayTasks.length > 0 ? <h2>For this {currentTime} you have {displayTasks.length > 1 ? "these tasks to choose from:" : "this task to do:"}</h2> : "You have no tasks for now"}
      </CurrentMessage>
      <TaskBoard>
      {displayTasks.length > 0 && (
        <>
        {displayTasks.map((task) => {
          return <TaskCard key={task.id}>
           <li><h2>{task.name}</h2></li>
           <hr width="100%" color="black" size="10px" align="center" />
           <br></br>
           <li>{task.timeOption}</li>
           <hr></hr>
           <li>{task.weatherOption}</li>
           <br/>
           <Button onClick={() => DeleteTask(task.id)}>Delete</Button>
           </TaskCard>
        })}
        </>
      )}
      </TaskBoard>
      <BackgroundImage alt="backgroundimage" height="1024" width="1024" src={backgroundImageSrc}></BackgroundImage>
      <Button onClick={()=> randomTask()}>I can not decide</Button>
      
    </MainDiv>
    {settings && (
      <BackDropper>
      <StyledModal isOpen={settings} onOpenChange={setSettings} onClose={setSettings}>
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
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => handleLogout()}>Logout</Button>
                <Button color="danger" variant="light" onClick={()=> setSettings(false)}>
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
   checked={weatherChecked}
  />

  {showWeatherOptions && (
    <div>
      <label htmlFor="goodWeather" style={{ color: weatherOption === 'good weather' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="goodWeather"
          name="weatherOption"
          value="good weather"
          checked={weatherOption === 'good weather'}
          onChange={handleWeatherOptionChange}
          
        />{" "}
        Good Weather
      </label>
      <label htmlFor="badWeather" style={{ color: weatherOption === 'bad weather' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="badWeather"
          name="weatherOption"
          value="bad weather"
          checked={weatherOption === 'bad weather'}
          onChange={handleWeatherOptionChange}
        />{" "}
        Bad Weather
      </label>
    </div>
  )}

  <label htmlFor="allDay">All Day?</label>
  <input
    
    checked={allDayChecked}
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
              </ModalBody>
              <StyledModalFooter>
                
                <Button color="danger" variant="light" onClick={()=>{setAdd(false)}}>
                  Close
                </Button>
              </StyledModalFooter>
            </>
          )}
        </ModalContent>
      </StyledModal>
      </BackDropper>
    )}
     {selectedTask && (
      <BackDropper>
        <StyledModal isOpen={true} onClose={() => setSelectedTask(null)}>
          <ModalContent>
            <ModalHeader>I have picked this task for you:</ModalHeader>
            <ModalBody>
              {/* Display the selected task details here */}
              <div>
              <hr></hr>
                <h2>{selectedTask.name}</h2>
                <br></br>
                <hr></hr>
                <p>Get it going!</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </StyledModal>
        </BackDropper>
      )}
  </>
);
          }