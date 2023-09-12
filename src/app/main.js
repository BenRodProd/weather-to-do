"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import requestWeather from "./API/Request";
import styled from "styled-components";
import handleLogout from "@/service/logout";
import writeToDatabase from "@/service/write";
import fetchUserCityFromDatabase from "@/service/fetchCity";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8rem;
  min-height: 100vh;
`;

export default function Main({ user }) {
  const [city, setCity] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [userCity, setUserCity] = useState(null); // State to store user's city

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
      } catch (error) {
        console.error("Error fetching weather data:", error);
        if (error.code === 1006) {
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

  function HandleChangeCity(e) {
    e.preventDefault();
 
    setCity(e.target.city.value);
    writeToDatabase(user.email, e.target.city.value);
  }

  if (!userCity) {
    // If the user's city is not found in the database
    return (
      <>
        <MainDiv>
          <h1>Weather To Do</h1>
          <h1>Hello, {user.displayName}</h1>
          <h2>Welcome, new user! Please choose your city:</h2>
          <form onSubmit={(e) => HandleChangeCity(e)}>
            <input
              required
              type="text"
              name="city"
              placeholder="City"
            ></input>
            {error && <p>City not found</p>}
            <button type="submit">Search</button>
          </form>
          <button onClick={() => handleLogout()}>Logout</button>
        </MainDiv>
      </>
    );
  }

  // If the user's city is found in the database
  return (
    <>
      <MainDiv>
        <h1>Hello, {user.displayName}</h1>
        <h1>Weather To Do</h1>
        {data && (
          <>
            <p>{data.location.name}</p>
            <p>{data.location.localtime}</p>
            <p>Max Temp: {data.forecast.forecastday[0].day.maxtemp_c}</p>
            <p>{data.forecast.forecastday[0].day.condition.text}</p>
            <Image
              src={"https://" + data.forecast.forecastday[0].day.condition.icon}
              width={150}
              height={150}
              alt="icon"
            />
          </>
        )}
        <form onSubmit={(e) => HandleChangeCity(e)}>
          <input required type="text" name="city" placeholder="City"></input>
          {error && <p>City not found</p>}
          <button type="submit">Search</button>
        </form>
        <button onClick={() => handleLogout()}>Logout</button>
      </MainDiv>
    </>
  );
}
