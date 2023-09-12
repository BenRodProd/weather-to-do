"use client";
import Image from "next/image";
import requestWeather from "./API/Request"
import styled from "styled-components"
import { useEffect, useState } from "react"
import handleLogout from "@/service/logout";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8rem;
  min-height: 100vh;
`;
export default function Main({user}) {
const [city, setCity] = useState("münster")
const [data, setData] = useState(null)
const [error, setError] = useState(false)
const [logoutPressed, setLogoutPressed] = useState(false)
useEffect(() => {
  // Define an asynchronous function to fetch data
  async function fetchData() {
    try {
      const weatherData = await requestWeather(city);
      setData(weatherData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching weather data:", error);
      if (error.code === 1006) {
        setData(null)
        setError(true)
        
        
      }
    }
  }
  fetchData(); // Call the async function to fetch data
  
}, [city]);

function HandleChangeCity(e) {
  e.preventDefault();
  console.log(e.target.city.value)
  setCity(e.target.city.value)
}
if (!data || !data.location) {
  return( <>
  <MainDiv>
   
   <h1>Weather To Do</h1>
  <h1>Please insert a city</h1>
  <form onSubmit ={(e) => HandleChangeCity(e)}>
  <input required type ="text" name="city" placeholder="City" ></input>
     {error && <p>City not found</p>}
     <button type = "submit">Search</button>
     </form>
     </MainDiv>
  </>
  )
}

  return (
 <>
 <MainDiv>
 <h1>Hello {user.displayName}</h1>
  <h1>Weather To Do</h1>
    {data && 
    <>
    <p>{data.location.name}</p>
     <p>{data.location.localtime}</p>
     <p>Max Temp: {data.forecast.forecastday[0].day.maxtemp_c}</p>
     <p>{data.forecast.forecastday[0].day.condition.text}</p>
     <Image src={"https://"+data.forecast.forecastday[0].day.condition.icon} width={150} height={150} alt="icon" />
     </>
     }
     <form onSubmit ={(e) => HandleChangeCity(e)}>
     <input required type ="text" name="city" placeholder="City" ></input>
     {error && <p>City not found</p>}
     <button type = "submit">Search</button>
     </form>
     <button onClick={() => handleLogout()}>Logout</button>
     </MainDiv>
 </>
)
}
