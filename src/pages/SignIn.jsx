
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

export default function SignIn() {
    const signInWithGoogle = async () => {  
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(getAuth(), provider).catch((err) => { console.error(err) });

        console.log(res);
    }

    return (
        <>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    )
} 