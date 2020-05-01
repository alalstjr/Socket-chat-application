import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

// socket.io 서버로 전송되는 저장 변수
let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT                = "localhost:5000";

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        // socket.io 연결해주는 서버링크 엔드포인트 생성
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        // 받은 데이터 처리
        // socket.emit('서버로 보낼 이벤트명', 데이터);
        socket.emit('join', { name, room }, () => {

        });
        
        return () => {
            // socket 연결 해제 메소드 실행
            socket.emit("disconnect");
            socket.off();
        }

        // 존재하는 경우 목록의 값이 변경될 때만 효과가 활성화된다.
        // 필수적이고 효과적인 코드를 포함하는 함수를 허용한다.
        // ENDPOINT 배열값이 전달되지 않으면 중복으로 함수가 전달됩니다.
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
        
        socket.on("roomData", ({ users }) => {
          setUsers(users);
        });
    }, []);
    
    // 메세지를 보낸 후 빈 문자열로 초기화 하는 메소드
    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar 
                    room={room} 
                />
                <Messages 
                    messages={messages} 
                    name={name} 
                />
                <Input 
                    message={message} 
                    setMessage={setMessage} 
                    sendMessage={sendMessage} 
                />
            </div>
            <TextContainer users={users}/>
      </div>
    );
}

export default Chat;