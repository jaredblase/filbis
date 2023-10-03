import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export default function Chat() {
    const auth = firebase.auth();
    const firestore = firebase.firestore();

    const signOut = () => {
        return auth.currentUser && (
            <button onClick={() => auth.signOut()}>Sign Out</button>
        )
    }

    const ChatMessage = (props) => {
        const { text, uid, photoURL } = props.message;

        const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

        return (
            <>
            <div className={`message ${messageClass}`}>
                <img src={photoURL} alt="user" />
                <p>{text}</p>
            </div>
            </>
        )
    }

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messageRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })

        setFormValue('');
    }

    const messageRef = firestore.collection('messages');
    const query = messageRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');

    return (
        <>
        <div>
            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        </div>

        <form onSubmit={sendMessage}>
            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
            <button type="submit">Send</button>
        </form>
        </>
    )
}