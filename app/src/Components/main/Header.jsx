import React from 'react'
import { useUser } from '../../Contexts/user.jsx';
import { useSocket } from '../../Contexts/socket.jsx';
import { useEffect } from 'react';
import { useMobile } from "../../Contexts/mobile.jsx"

function Header() {
    const {socket} = useSocket();
    const {userState, token} = useUser();

    const logout = () => {
        socket.emit('disconnected', userState.user)
        document.cookie.split(';').map(c => {
            if(c.indexOf('auth-token') !== -1){
                document.cookie = 'auth-token=;max-age=0;path=/';
                localStorage.removeItem('user')
            }
        });
        window.location.pathname='/'
    }

    useEffect(() => {
        if(screen.width < 600){
            window.addEventListener('scroll', (e) => {
                document.getElementById('header-pos').style.bottom = 0;
            })
        }
    }, [])
    return <HeaderContent userState={userState} token={token} logout={logout} />
}

const HeaderContent = ({userState, token, logout}) => {
    const {isMobile} = useMobile();
    return(
        <div id='header-pos' className={``}>
            <div id="header">
                { !isMobile ?
                    <div id="title">
                        <a className={`notranslate a-normalize `} href="/">Luccagram</a>
                    </div>:''
                }
                {token ?
                <div id="header-nav">
                    <div id="nav-lspace"></div>
                    <div id="nav-btns">
                        <a href='/' id="Home-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>
                            home
                        </span>
                            Inicio
                        </a>
                        <a href={userState ? `/user/${userState?.user}`: ''} id="Profile-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>
                                person
                            </span>
                            Perfil
                        </a>
                        <a href='/notifications' id="notification-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>
                                    notifications
                            </span>
                            <div id="new-notification-div">
                                {userState?.newNotis > 0 ? <span id="new-notification">{userState?.newNotis}</span>:''}
                            </div>
                            Notificaciones
                        </a>
                        <a  id="theme-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>brush</span>
                            Tema
                        </a>
                        <a onClick={logout} id="logout-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>logout</span>
                            Cerrar Sesión
                        </a>
                    </div>
                </div>:''}

                </div>
                
                {token && !isMobile ? <div id="account">
                    <div id="account-btn">
                    <img id="account-pic" src={userState ? userState?.profilePic : ''} alt={userState?.user} />
                    <div className='notranslate' id="account-user">
                        {userState?.user}
                    </div>
                    </div>
                </div>:''}
        </div>
    )
}

const LargeHeader = ({userState, theme, token, logout}) => {

    return (
        <div id='header-pos' className={``}>
            <div id="header">
                <div id="title">
                    <a className={`notranslate a-normalize `} href="/">Luccagram</a>
                </div>
                {token ?
                <div id="header-nav">
                    <div id="nav-lspace"></div>
                    <div id="nav-btns">
                        <a href='/' id="Home-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>
                            home
                        </span>
                            Inicio
                        </a>
                        <a href={userState ? `/user/${userState?.user}`: ''} id="Profile-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>
                                person
                            </span>
                            Perfil
                        </a>
                        <a href='/notifications' id="notification-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>
                                    notifications
                            </span>
                            <div id="new-notification-div">
                                {userState?.newNotis > 0 ? <span id="new-notification">{userState?.newNotis}</span>:''}
                            </div>
                            Notificaciones
                        </a>
                        <a id="theme-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>brush</span>
                            Tema
                        </a>
                        <a onClick={logout} id="logout-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>logout</span>
                            Cerrar Sesión
                        </a>
                    </div>
                </div>:''}

                </div>
                
                {token ? <div id="account">
                    <div id="account-btn">
                    <img id="account-pic" src={userState ? userState?.profilePic : ''} alt={userState?.user} />
                    <div className='notranslate' id="account-user">
                        {userState?.user}
                    </div>
                    </div>
                </div>:''}
        </div>
        
    )

}

const MediumHeader = ({userState, theme, token, logout}) => {
    return (
        <div id='header-pos' className={``}>
            <div id="header">
                <div id="title">
                    <a className={`notranslate a-normalize `} href="/">L</a>
                </div>
                {token ?
                <div id="header-nav">
                    <div id="nav-lspace"></div>
                    <div id="nav-btns">
                        <a href='/' id="Home-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>
                            home
                        </span>
                        </a>
                        <a href={userState ? `/user/${userState?.user}`: ''} id="Profile-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>
                                person
                            </span>
                        </a>
                        <a href='/notifications' id="notification-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>
                                    notifications
                                </span>
                                <div id="new-notification-div">
                                    {userState?.newNotis > 0 ? <span id="new-notification">{userState?.newNotis}</span>:''}
                                </div>
                        </a>
                        <a onClick={logout} id="logout-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>logout</span>
                        </a>
                    </div>
                </div>:''}

                </div>
                
                {token ? <div id="account">
                    <div id="account-btn">
                    <img id="account-pic" src={userState ? userState?.profilePic : ''} alt={userState?.user} />
                    <div className='notranslate' id="account-user">
                        {userState?.user}
                    </div>
                    </div>
                </div>:''}
        </div>
        
    )
}

const MobileHeader = ({userState, theme, token, logout}) => {
    if(token){
        return(
            <>
            <div id='mobile-header-pos'>
                <a href='/' id="Home-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        home
                    </span>
                </a>
                <a href='/search' id="search-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        search
                    </span>
                </a>
                <a href='/notifications' id="noti-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        notifications
                    </span>
                    <div id="new-notification-div">
                        {userState?.newNotis > 0 ? <span id="new-notification">{userState?.newNotis}</span>:''}
                    </div>
                </a>
                <a href='/chat' id="chat-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        mail
                    </span>
                </a>
                <a href={'/user/'+userState?.user} id="chat-btn" className={`a-normalize header-btn `}>
                    <img id="mobile-profile-btn" className={`a-normalize mobile-header-btn `} src={userState?.profilePic} />
                </a>
            </div>
            </>
        )
    }else return ''
}

export default Header