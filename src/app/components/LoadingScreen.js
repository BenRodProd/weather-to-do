import styled from 'styled-components';
import { Spinner } from '@nextui-org/spinner';

const StyledLoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: aliceblue;
  z-index: 6;
`;

export default function LoadingScreen() {
  return (
    <div className="loading">
      <h1>Loading...</h1>
      <Spinner color="warning" />
    </div>
  );
}
