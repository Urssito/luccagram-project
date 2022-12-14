import React, { useState } from 'react';
import Home from "./Components/main/home.jsx";
import Profile from "./Components/users/profile.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {UserProvider, useUser} from './Contexts/user.jsx'
import {SocketProvider, useSocket} from './Contexts/socket.jsx'
import EditProfile from './Components/users/editProfile.jsx';
import Notifications from './Components/users/notifications.jsx';
import PubPage from './Components/publications/pubPage.jsx';
import NotiMsg from './Components/partials/notification.jsx';
import { useEffect } from 'react';
import ChatMobile from './Components/users/chatMobile.jsx';
import SearchMobile from './Components/main/searchMobile.jsx';
import { ThemeProvider, useTheme } from './Contexts/theme.jsx';
import { MobileProvider, useMobile } from './Contexts/mobile.jsx';
 
export default () => <UserProvider props={null}>
    <SocketProvider props={null}>
        <MobileProvider props={null}>
            <ThemeProvider props={null}>
                <App />
            </ThemeProvider>
        </MobileProvider>
    </SocketProvider>
</UserProvider>

export function App () {
    const {userState, token} = useUser();
    const {socket} = useSocket();
    const {theme} = useTheme();
    const {isMobile} = useMobile();
    const [notification, setNotification] = useState(null);

    socket.on('newNotification',async(data) => {
        console.log(data)
        const [username, profilePic] = data.transmitter.split('-');
        const notiDisabled = document.getElementById('notify-position').classList.contains('disabled');
        if(notiDisabled && data.receiver.includes(userState?.id)){
            data.profilePic = profilePic
            data.transmitter = username;
            setNotification(data);
            document.getElementById('notify-position').classList.remove('disabled');
        }
    });
    
    useEffect(() => {
        if(userState)socket.emit('connected', userState);
    }, [userState])

    return (
        <BrowserRouter>
        <NotiMsg notification={notification}></NotiMsg>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/user/*" element={<Profile />} />
                <Route path="/publication/*" element={<PubPage />} />
                {token && userState ? <Route path="/notifications" element={<Notifications />} />:''}
                {token && userState ? <Route path="/profile/edit" element={<EditProfile />} />:''}
                <Route path="/chat" element={<ChatMobile />} />
                <Route path="/search" element={<SearchMobile />} />
            </Routes>
        </BrowserRouter>
    )
}