import React, {useState, useRef, useEffect} from "react";
import { useUser } from "../../Contexts/user.jsx";
import { useSocket } from "../../Contexts/socket.jsx";
import { getUser } from "../../modules/getUsers.jsx";
import { useTheme } from "../../Contexts/theme.jsx";
import { useMobile } from "../../Contexts/mobile.jsx"

const Chat = ({chatid}) => {
    const {theme} = useTheme();
    const [active, setActive] = useState(false);
    const [user, setUser] = useState(null);
    const {token, userState} = useUser();
    const [chat, setChat] = useState([]);
    const [lastMsg, setLastMsg] = useState('');
    const {socket} = useSocket();
    const {isMobile} = useMobile();
    
    useEffect(async() => {
        if(chatid){
            const userObj = await getUser('id-'+chatid);
            setUser(userObj);
        }
    }, [userState]);

    const getChat = async() => {
        if(user && userState){
            const res = await fetch('/api/getChat', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'userA': user.id,
                    'userB': userState.id,
                    'auth-token': token
                }
            });
            const data = await res.json();
            if(data){
                setChat(data)
                if(data[data.length-1][1].length < 30){
                    setLastMsg(data[data.length-1][1]);
                }else{
                    setLastMsg(data[data.length-1][1]?.slice(0,30)+'...');
                }
            }else{
                setLastMsg('Comienza tu chat con '+ user.user+ '!')
            }
        }
    }

    const switchActive = () => {
        window.addEventListener('click', (e) => {
            if(chat.length > 0 && e.target.id == 'chat-back-btn'){
                if(chat[chat.length-1][1].length < 30){
                    setLastMsg(chat[chat.length-1][1]);
                }else{
                    setLastMsg(chat[chat.length-1][1]?.slice(0,30)+'...');
                }
            }
        });
        setActive(false);
    }

    const submit = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            send(e).then(() => {
                scroll();
            })
        }
    };

    const send = async(e) => {
        const chatText = document.getElementById('chat-text');
        if(chatText.value.replace(/\n/g, '') !== ''  && chatText.value.replace(/ /g, '') !== ''){
            e.preventDefault();
            socket.emit('chat', {transmitter: userState.id, receiver: chatid, msg: chatText.value});
            setChat([...chat, [userState.id, chatText.value]]);
            fetch('/api/sendMsg', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({
                    msg: [userState.id, chatText.value],
                    users: [user.id, userState.id],
                })
            });
        }
        chatText.value = '';
        chatText.focus();
    }

    const scroll = () => {
        const chatBody = document.getElementById('active-chat-body');
        if(chatBody)chatBody.scrollTop = chatBody.scrollTopMax;
    }

    useEffect(() => {
        getChat();
    }, [user])
    
    useEffect(() => {
        if(active){
            const chats = document.getElementsByClassName('chat');
            for (let i of chats){
                i.classList.add('disabled')
            }
            if(screen.width < 600){
                document.getElementById('bottom-bar-space').style.height = '132px';
            }
        }else{
            const chats = document.getElementsByClassName('chat');
            for (let i of chats){
                i.classList.remove('disabled')
            }

        }
    },[active]);

    useEffect(() => {
        socket.on('newMsg', (data) => {
            setLastMsg(data);
            setChat(chat => [...chat, data]);
        });
        window.addEventListener('backbutton', (e) => {
            alert('xd')
            if(active) setActive(false);
        }); 
    }, [])

    useEffect(() => {
        if(document.body >= 600 && !isMobile){
            const observer = new ResizeObserver(entries => {
                const chatBody = document.getElementById('active-chat-body');
                chatBody.style.height = entries[0].target.clientHeight-185+'px'
            });
            observer.observe(document.body)
        }
    }, [document.body.clientHeight]);

    const msgEnd = useRef(null);
    useEffect(() => {
        if(active) msgEnd.current.scrollIntoView({});
    }, [chat, active]);

    if(!active){
        return(
            <div className="chat" onClick={() => {setActive(true)}}>
                <a href={user ? '/user/'+user.user : ''}>
                    <div className="chat-photo">
                        <img className="chat-pic" src={user ? user.profilePic:''} alt={user ? user.user: ''} />
                    </div>
                </a>
                <div className="chat-body">
                    <a className="a-normalize underline" href={user ? '/user/'+user.user : ''}>
                        <div className={`chat-user notranslate`}>
                            {user ? user.user : ''}
                        </div>
                    </a>
                    <div className={`chat-preview`}>
                        {lastMsg}
                    </div>
                </div>
            </div>
        )
    }else{
        return (user ? 
            <>
                <div id="active-chat">
                    <div id="chat-top-bar" className={`top-bar`}>
                        <button onClick={switchActive} id="chat-back-btn" className="back-btn" type="button">
                            <span id="chat-back-btn" className="material-icons notranslate">arrow_back</span>
                        </button>
                        <a id="chat-header" className="a-normalize underline" href={user ? '/user/'+user.user : ''}>
                            <div className="active-chat-photo">
                                <img id="active-chat-pic" src={user.profilePic} alt={user.user} />
                            </div>
                            <div className="chat-user notranslate">
                                {user ? user.user : ''}
                            </div>
                        </a>
                    </div>
                    <div className="top-bar-space" />
                    <div id="active-chat-body" style={{'height': document.body.clientHeight-185+'px'}}>
                        <div id="msgs">
                            {
                            chat[0] ? chat.map((msg, i) =>    {
                                return(<div key={'msg-box-'+i} className={msg[0] === user.id ? 'msg-boxA' : 'msg-boxB'}>
                                    <div key={'msg-'+i} className={msg[0] === user.id ? 'userA' : 'userB'}>
                                        {msg[1]}
                                    </div>
                                </div>)
                            }):''
                            }
                        </div>
                        <div ref={msgEnd} />
                    {screen.width < 600 ? <div id="chat-input">
                        <textarea onKeyDown={submit} id="chat-text" type="text" placeholder="Escribe un mensaje" />
                        <button onClick={send} id="chat-send" type="button"><span className="material-icons notranslate">send</span></button>
                    </div>:''}
                    </div>
                </div>
                {!isMobile ? <div id='chat-input-space' style={{'height': '62px'}} />: ''}
                <div id="chat-input-div">
                    {screen.width >= 600 ? <div id="chat-input">
                        <textarea onKeyDown={submit} id="chat-text" type="text" placeholder="Escribe un mensaje" />
                        <button onClick={send} id="chat-send" type="button"><span className="material-icons notranslate">send</span></button>
                    </div>:''}
                </div>
                {screen.width >= 600 ? '':''}
            </>
        : '')
    }

};

export default Chat;