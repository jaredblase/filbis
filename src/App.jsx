import styled from 'styled-components';
import SignIn from './pages/SignIn';

const AppContainer = styled.div`
  position: relative;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  overflow-x: hidden;
`;

export default function App() {
  return (
    <>
      <AppContainer>
        <SignIn />
      </AppContainer>
    </>
  )
}
