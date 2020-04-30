--------------------
# Realtime-Chat-Application
--------------------

- [1. 개발환경 구축](#개발환경-구축?)

# 개발환경 구축

## 클라이언트 환경 구축

~~~
mkdir client

cd client

create-react-app app

npm install --save react-router socket.io-client react-scroll-to-bottom react-emoji query-string react-router-dom
~~~

기본적으로 생성된 `src` 폴더 내부의 파일을 전부 삭제합니다.
직접 생성하여 사용할 것이기 때문에 필요가 없습니다.

그후 기본적인 js 생성합니다.

> client/app/src/index.js

~~~
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

ReactDOM.render(<App />, document.querySelector("#root"));
~~~

> client/app/src/App.js

~~~
import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/Join/Join";
import Chat from "./components/Chat/Chat";

const App = () => (
    <Router>
        <Route path="/" exact component={Join} />
        <Route path="/chat" exact component={Chat} />
    </Router>
);

export default App;
~~~

이제 `Join` & `Chat` 두개의 Component 를 생성해야 합니다.

## 서버 환경 구축

~~~
mkdir server

cd server

npm init -y

npm install --save cors nodemon express socket.io
~~~

> package.json

시작 스크립트를 추가하기만 하면 됩니다.

~~~
...
  "scripts": {
    "start": "nodemon index.js",
    ...
  },
...
~~~

> server/index.js

~~~
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
~~~

정상적으로 localhost 5000 에서 서버가 열렸는지 확인하는 router 하나 생성합니다.

> server/router.js

~~~
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("server is up and running");
});

module.exports = router;
~~~

백엔드 서버설정 후 실행시켜줍니다.

localhost:5000 주소로 접속 후 텍스트가 출력된다면 정상 연결 된것입니다.

# Join&Chat Component 생성

> client/app/src/components/Chat/Chat.js

~~~
import React from "react";

const Chat = () => {
    return (
        <h1>Chat</h1>
    );
}

export default Chat;
~~~

> client/app/src/components/Join/Join.js

~~~
import React from "react";

const Join = () => {
    return (
        <h1>Join</h1>
    );
}

export default Join;
~~~

# Server SocketIO 연결

> server/index.js

~~~
...
io.on("connection", (socket) => {
    console.log("We have a new connection.");

    socket.on("disconnect", () => {
        console.log("User had left.");
    });
});
...
~~~

채팅 접근 컴포넌트를 생성합니다.

> client/app/src/components/Join/Join.js

~~~
import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                <Link
                    // 채팅 방의 정보가 존재여부를 체크합니다. 
                    onClick={event => (!name || !room) ? event.preventDefault() : null}
                    to={`/chat?name=${name}&room=${room}`}
                >
                    <button className="botton mt-20" type="submit">Sing In</button>
                </Link>
            </div>
        </div>
    );
}

export default Join;
~~~

