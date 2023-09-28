import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const [user] = useAuthState(getAuth());

const AppContainer = styled.div`
  position: relative;
  background: ${theme.colors.background};
  overflow-x: hidden;
`;

export default function App() {
  return (
    <>
      <AppContainer>
        {user ? <Chat /> : <SignIn />}
      </AppContainer>
    </>
  )
}
