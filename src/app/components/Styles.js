import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import { Modal, ModalFooter } from '@nextui-org/react';

export const Footer = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: #000000;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  font-weight: bold;
  margin: 1rem 0 0;
  z-index: -1;
  background-color: aliceblue;
`;

export const Zoom = keyframes`
  0% {
   
    width:85%;
    height:85%;
    filter:blur(1rem);
  }
  50% {
    filter:blur(0);
    
  }
  100% {
  
    width:85%;
    height:85%;
  }
`;

export const StyledInput = styled.input`
  display: flex;
  color: black;
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
export const Button = styled.button`
  display: flex;
  color: black;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid black;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  user-select: none;
  z-index: 0;
`;
export const EditButton = styled.button`
  position: absolute;
  color: black;
  right: 0;
  top: 0;

  padding: 0.5rem 0.5rem;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  user-select: none;
  z-index: 0;
`;

export const DeleteButton = styled.button`
  position: absolute;
  color: black;
  left: 0;
  top: 0;

  padding: 0.5rem 0.5rem;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  user-select: none;
`;

export const CardHeader = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
`;

export const MainDiv = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100dvh;
  width: 100%;
  
  user-select: none;
`;

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -111;
  background-color: rgba(0, 0, 0, 0.8);
`;

export const RadioStyle = styled.div`
  display: flex;
  user-select: none;
  label {
    margin-left: 1rem;
    user-select: none;
  }
`;

export const TaskBoard = styled.div`
  display: grid;
  position: relative;
  align-self: center;

  width: 80%;
  height: 75vh;

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
`;

export const Decision = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 0;
`;

export const TaskCard = styled.ul`
  display: flex;
  position: relative;
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
`;

export const BackDropper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(7px);
  z-index: 1;
`;

export const StyledModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: lightgray;
  border-radius: 10px;
  padding: 20px;
  gap: 1rem;
  user-select: none;
  z-index: 2;
  text-align: center;
`;
export const StyledAddModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: lightgray;
  border-radius: 10px;
  padding: 20px;

  user-select: none;
  z-index: 2;
  text-align: center;

  @media screen and (max-width: 400px) {
    gap: 0;
  }
  @media screen and (min-width: 500px) {
    gap: 3rem;
  }
`;

export const StyledModalFooter = styled(ModalFooter)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BackgroundImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;

  z-index: -1;
  object-fit: cover;

  border: 10px solid burlywood;

  animation: ${Zoom} 1.5s ease-in;
`;

export const NoRadio = styled.input`
  display: none;
`;

export const SettingsButton = styled.button`
  position: absolute;
  top: 0;
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
export const AddButton = styled.button`
  position: absolute;
  top: 0;
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

export const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const CurrentMessage = styled.div`
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
  @media screen and (min-width: 800px) {
    margin-top: 0rem;
  }
`;
