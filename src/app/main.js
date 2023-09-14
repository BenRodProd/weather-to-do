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
    
    z-index:5;
    
    width:400%;
    height:400%
  }
  100% {
    
    z-index:0;
    
    width:85%;
    height:85%;
  }
`;

const StyledInput = styled.input`
  display: flex;
  color:black;
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
const Button = styled.button`
  display: flex;
  color:black;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid black;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  user-select: none;
  z-index:0;
`;

const MainDiv = styled.div`
  display: flex;
  position:relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  height: 100dvh;
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

const Decision = styled.div`
display:flex;
flex-direction: column;
z-index:0;
`


const TaskCard = styled.ul`
  display: flex;
  color: black;
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
  z-index:2;
  text-align: center;
`;
const StyledAddModal = styled(Modal)`
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
  
  
  user-select: none;
  z-index:2;
  text-align: center;


  @media screen and (max-width: 400px) {
    gap:0;
  }
  @media screen and (min-width: 500px) {
    gap: 3rem;
  }
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

animation: ${Zoom} 1.5s ease-in;

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
  const [weatherOption, setWeatherOption] = useState('gutes Wetter');
  const [timeOption, setTimeOption] = useState('Morgen');
  const [repeatOption, setRepeatOption] = useState('täglich');
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
    setCurrentTime("Morgen")
  } else if (today.getHours() >= 12 && today.getHours() < 15) {
    setCurrentTime("Mittag")
  } else if (today.getHours() >= 15 && today.getHours() < 18) {
    setCurrentTime("Nachmittag")
  } else if (today.getHours() >= 18 && today.getHours() < 21) {
    setCurrentTime("Abend")
  } else {
    setCurrentTime("Nacht")
  }
  
 

  const now = new Date();

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
    // Additional criteria for tasks with doesRepeat "off," weatherOption "jedes Wetter," and timeOption "egal wann"

    return true;
  } else if (isTimeOptionMatch && isWeatherOptionMatch) {
        // Only consider tasks that match both time and weather options
        if (task.repeatOption !== 'no repeat') {
       
          if (task.repeatOption === 'täglich') {
            const lastDoneDate = task.done?.toDate();
            const oneDayAgo = new Date(now);
            oneDayAgo.setDate(now.getDate() - 1);
           
           
         
            return !lastDoneDate || lastDoneDate <= oneDayAgo;
          } else if (task.repeatOption === 'wöchentlich') {
            const lastDoneDate = task.done?.toDate();
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);
           
            return !lastDoneDate || lastDoneDate <= oneWeekAgo;
          }
        } else {
          // Task does not repeat, so include it
        
          return true;
        }
      } 
  
      // Exclude tasks that don't meet the criteria
      return false;
    })
  );
  
  

  
  



},[allTasks, data])


function HandleSubmitTask(e) {
  e.preventDefault();

  // Initialize variables with default values
 
  let dependsOnWeather = "off"
  let timeOptionValue = "egal wann";
  let repeatOptionValue = "no repeat";

  // Check the state of "allDay," "weather," and "repeat" checkboxes and set variables accordingly
  if (allDayChecked) {
    timeOptionValue = "egal wann";
  } else {
    timeOptionValue = e.target.timeOption.value;
  }

  if (!weatherChecked) {
    setWeatherOption("jedes Wetter");
  } 

  if (!showRepeatOptions) {
    repeatOptionValue = "no repeat";
  } else if (showRepeatOptions) {
    repeatOptionValue = e.target.repeatOption.value;
  }
  if (weatherChecked) {
    dependsOnWeather = "on"
  } else {
    dependsOnWeather = "off"
  }
 
  
    // Pass the variables to the writeTaskToDatabase function
    writeTaskToDatabase(
      e.target.name.value,
      dependsOnWeather,
      weatherOption,
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

  setShowWeatherOptions(prev => !prev);
  setWeatherChecked(prev => !prev);
  
};
const handleRepeatOptionChange = (e) => {
  setRepeatOption(e.target.value);
};
const handleAllDayChange = (e) => {
  setShowTimeOptions(prev => !prev);
  setAllDayChecked(prev => !prev);
};
const handleWeatherOptionChange = (e) => {
  setWeatherOption(e.target.value);
};
const handleTimeOptionChange = (e) => {
  setTimeOption(e.target.value);
};
const handleRepeatChange = (e) => {
  setShowRepeatOptions(prev => !prev);
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
          <form onSubmit={(e) => HandleChangeCity(e)}>
            <StyledInput
              required
              type="text"
              name="city"
              placeholder="City"
            ></StyledInput>
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
      <SettingsButton onClick={() => setSettings(prevSettings => !prevSettings)}><Image src="/settings.png" alt="settings" width="30" height="30"/></SettingsButton>
      <AddButton onClick={() => setAdd(prevSettings => !prevSettings)}><Image src="/add.png" alt="add" width="30" height="30"/></AddButton>
      <CurrentMessage>
        <h2>Es ist im Moment {rainy ? "regnerisch" : "nicht regnerisch"}</h2>
        {displayTasks.length > 0 ? <h2>Für {currentTime==="Nacht" ? "diese" : "diesen" } {currentTime} hast du {displayTasks.length > 1 ? "diese Aufgaben zur Auswahl:" : "diese Aufgabe zu erledigen:"}</h2> : "Du hast gerade keine Aufgaben..."}
      </CurrentMessage>
      <TaskBoard>
      {displayTasks.length > 0 && (
        <>
        {displayTasks.map((task) => {
          return <TaskCard key={task.id}>
           <li><h2>{task.name}</h2></li>
           <hr width="100%" color="black" size="10px" align="center" />
           <br></br>
           <li>{task.timeOption === "egal wann" ? "" : task.timeOption === "Nacht" ? "in der " : "am " }{task.timeOption}</li>
           <hr></hr>
           <li>für {task.weatherOption}</li>
           <br/>
           <Button onClick={() => DeleteTask(task.id)}><Image src="/done.png" alt="done" width="30" height="30"/></Button>
           </TaskCard>
        })}
        </>
      )}
      </TaskBoard>
      <BackgroundImage priority alt="backgroundimage" height="1024" width="1024" src={backgroundImageSrc}></BackgroundImage>
      <Decision>
      {displayTasks.length > 1 && <Button onClick={()=> randomTask()}>Ich kann mich nicht entscheiden</Button>}
      </Decision>
    </MainDiv>
    {settings && (
      <BackDropper>
      <StyledModal isOpen={settings} onOpenChange={setSettings} onClose={setSettings}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">ausgewählte Stadt: {city}</ModalHeader>
              
                <StyledForm onSubmit={(e) => HandleChangeCity(e)}>
                  <StyledInput
                    required
                    type="text"
                    name="city"
                    placeholder={city}
                  ></StyledInput>
                 
                  <Button type="submit">Suche</Button>
                </StyledForm>
                {error && <ErrorMessage>Stadt nicht gefunden...</ErrorMessage>}
             
                <hr width="100%"></hr>
                
                <Button onClick={() => handleLogout()}>Logout</Button>
                
                <hr width="100%"></hr>
                
                <Button color="danger" variant="light" onClick={()=> setSettings(false)}>
                  Schließen
                </Button>
              
            
            </>
          )}
        </ModalContent>
      </StyledModal>
      </BackDropper>
    )}
        {add && (
          <BackDropper>
      <StyledAddModal backdrop="blur" isOpen={add} onOpenChange={setAdd} onClose={setAdd}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Neue Aufgabe:</ModalHeader>
              <hr width="100%"></hr>
              <ModalBody>
              <StyledForm onSubmit={HandleSubmitTask}>
  <StyledInput maxLength="23" required type="text" name="name" placeholder="Name der Aufgabe" />

  <label htmlFor="weather">Hängt sie vom Wetter ab?</label>
  <Button
    type="button"
    name="weather"
    id="weather"
    onClick={handleWeatherChange}
   checked={weatherChecked}
  >{weatherChecked ? "Nein" : "Ja"}</Button>
  
  {showWeatherOptions && (
    <div>
      <label htmlFor="goodWeather" style={{ color: weatherOption === 'gutes Wetter' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="goodWeather"
          name="weatherOption"
          value="gutes Wetter"
          checked={weatherOption === 'gutes Wetter'}
          onChange={handleWeatherOptionChange}
          
        />{" "}
        gutes Wetter
      </label>
      <label htmlFor="badWeather" style={{ color: weatherOption === 'schlechtes Wetter' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="badWeather"
          name="weatherOption"
          value="schlechtes Wetter"
          checked={weatherOption === 'schlechtes Wetter'}
          onChange={handleWeatherOptionChange}
        />{" "}
        schlechtes Wetter
      </label>
    </div>
  )}
<hr width="100%"></hr>
  <label htmlFor="allDay">Tageszeit egal?</label>
  <Button
    
    
    type="button"
    name="allDay"
    id="allDay"
    onClick={handleAllDayChange}
  >{allDayChecked ? "Nein" : "Ja" }</Button>

  {showTimeOptions && (
    <div>
      <label htmlFor="Morgen" style={{ color: timeOption === 'Morgen' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="Morgen"
          name="timeOption"
          value="Morgen"
          checked={timeOption === 'Morgen'}
          onChange={handleTimeOptionChange}
          
        />{" "}
        Morgen
      </label>
      <label htmlFor="Mittag" style={{ color: timeOption === 'Mittag' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="Mittag"
          name="timeOption"
          value="Mittag"
          checked={timeOption === 'Mittag'}
          onChange={handleTimeOptionChange}
        />{" "}
        Mittag
      </label>
      <label htmlFor="Nachmittag" style={{ color: timeOption === 'Nachmittag' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="Nachmittag"
          name="timeOption"
          value="Nachmittag"
          checked={timeOption === 'Nachmittag'}
          onChange={handleTimeOptionChange}
        />{" "}
        Nachmittag
      </label>
      <label htmlFor="Abend" style={{ color: timeOption === 'Abend' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="Abend"
          name="timeOption"
          value="Abend"
          checked={timeOption === 'Abend'}
          onChange={handleTimeOptionChange}
        />{" "}
        Abend
      </label>
      <label htmlFor="Nacht" style={{ color: timeOption === 'Nacht' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="Nacht"
          name="timeOption"
          value="Nacht"
          checked={timeOption === 'Nacht'}
          onChange={handleTimeOptionChange}
        />{" "}
        Nacht
      </label>
    </div>
  )}
<hr width="100%"></hr>
  <label htmlFor="repeat">Wiederholen?</label>
  <Button
    type="button"
    name="repeat"
    id="repeat"
    onClick={handleRepeatChange}
    
  >{showRepeatOptions ? "Nein" : "Ja" }</Button>

  {showRepeatOptions && (
    <div>
      <label htmlFor="daily" style={{ color: repeatOption === 'täglich' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="daily"
          name="repeatOption"
          value="täglich"
          checked={repeatOption === 'täglich'}
          onChange={handleRepeatOptionChange}
          
        />{" "}
        Täglich
      </label>
      <label htmlFor="weekly" style={{ color: repeatOption === 'wöchentlich' ? 'green' : 'black' }}>
        <NoRadio
          type="radio"
          id="weekly"
          name="repeatOption"
          value="wöchentlich"
          checked={repeatOption === 'wöchentlich'}
          onChange={handleRepeatOptionChange}
        />{" "}
        Wöchentlich
      </label>
      {/* Add other repeat options here */}
    </div>
  )}
<hr width="100%"></hr>
  <Button type="submit">Speichern</Button>
  <hr width="100%"></hr>
</StyledForm>


                
             
                
              </ModalBody>
                <Button color="danger" variant="light" onClick={()=>{setAdd(false)}}>
                  Schließen
                </Button>
            
            </>
          )}
        </ModalContent>
      </StyledAddModal>
      </BackDropper>
    )}
     {selectedTask && (
      <BackDropper>
        <StyledModal isOpen={true} onClose={() => setSelectedTask(null)}>
          <ModalContent>
            <ModalHeader>Ich habe diese Aufgabe ausgesucht:</ModalHeader>
            <ModalBody>
              {/* Display the selected task details here */}
              <div>
              <hr></hr>
                <h2>{selectedTask.name}</h2>
                <br></br>
                <hr></hr>
                <p>Hau rein!</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onClick={() => setSelectedTask(null)}
              >
                Schließen
              </Button>
            </ModalFooter>
          </ModalContent>
        </StyledModal>
        </BackDropper>
      )}
  </>
);
          }