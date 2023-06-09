import React, { useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { message } from 'antd';
import { useId } from 'react';

function Chat({user, setActive, name}) {

    //get user id
    const { id } = useParams();
    const [msg, setMsg] = useState('')
    const [messages, setMessages] = useState([])
    const messagesRef = collection(db, "messages");
    const { uid } = user?.uid
    const { currentUser } = auth;
    const [userUid, setUserUid] = useState('')
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(messagesRef, orderBy("createdAt", "desc")),
            (snapshot) => {
                setMessages(snapshot.docs.map((doc) => doc.data()));
            }
        );
        return unsubscribe;
    }
    , [messagesRef]);

    const sendMsg = async (e) => {
        e.preventDefault();
        await addDoc(messagesRef, {
            text: msg,
            createdAt: serverTimestamp(),
            uid: currentUser.uid,
            name: currentUser.displayName,
        })
        setMsg('');
    }
    console.log(messages)

;








return (
        <div>

            <div className="chat">
                <div className="chat__header">  
                    <h2>Chat</h2>
                </div>
                <div className="chat__footer">
                    <form>
                        <input className='p-2 m-2' placeholder='Message...'
                            type="text" value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <button className='msgBtn' onClick={sendMsg}>Send</button>
                    </form>
                </div>
                <div className="chat__body">
                    {messages.map(({id, text, uid, createdAt, name}) => (
                        <><p key={id} className={`chat__message p-2 m-2  bg ${uid === currentUser.uid && 'chat__reciever'}`}>
                            {text} <h6 style={{color: 'blue', fontFamily: 'monospace'}}> {name}  </h6>{createdAt?.toDate().toLocaleString()}
                        </p>  
                     
                      
                       
               
                            <div className='break'></div>
                            
                            </>
                            
                            


                        ))}
                </div>

               
            
                
              

             
            </div>
        </div>
    )
}

export default Chat


  
