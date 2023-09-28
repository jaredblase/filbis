import firebase from 'firebase/app';
import 'firebase/auth';

export default function signIn() {
    const auth = firebase.auth();
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider(); 
        auth.signInWithPopup(provider);
    }
    return (
        <>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    )
}