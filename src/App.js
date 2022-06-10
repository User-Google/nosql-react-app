import { React, useRef, useState, useEffect  } from "react";
import PreApp from "./PreApp";
import Login from "./Pages/Login";



function App() {
    const [userState, setUserState] = useState();

    return (
        <>
            {userState ?
                <PreApp userState={userState} setUserState={setUserState}/> :
                <Login setUserState={setUserState}/>}
        </>
    );
};


export default App;