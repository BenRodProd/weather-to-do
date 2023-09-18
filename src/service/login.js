import { signInWithGoogle } from './firebase';
import Image from 'next/image';
import styled from 'styled-components';

const StyledLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: antiquewhite;
  text-align: center;
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
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

const Login = () => {
  return (
    <StyledLogin>
      <StyledButton className="button" onClick={signInWithGoogle}>
        <Image src="/google.png" alt="google" height="30" width="30" />
        <i className="fab fa-google"></i>Sign in with google
      </StyledButton>
    </StyledLogin>
  );
};

export default Login;
