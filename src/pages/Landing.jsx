import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';

const signIn = async () => {  
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(getAuth(), provider).catch((err) => { console.error(err) });
    console.log(res);
}

export default function Landing() {
    return (
        <LandingContainer>
            <h1>Landing</h1>
            <button onClick={signIn}>
                Sign in with Google
            </button>
        </LandingContainer>
    );
}