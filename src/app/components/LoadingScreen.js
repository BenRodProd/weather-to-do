import styled from 'styled-components';
import { Spinner } from '@nextui-org/spinner';
import Image from 'next/image';

const StyledLoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: white;
  z-index: 6;
`;

export default function LoadingScreen() {
  return (
    <div className="loading">
      
      <Image src="/Spinner.gif" alt="loading" width="80" height="80" />
    </div>
  );
}
