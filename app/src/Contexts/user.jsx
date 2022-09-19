import React, {useEffect, useMemo, useContext, useState} from 'react';

const UserContext = React.createContext(null);

export function UserProvider(props) {
    const [userState, setUser] = useState(null);
    const [token, setToken] = useState('');

    const fetchUser = async() => {
        if(token && !userState){
            fetch('/api/authenticate',{
                headers: {
                    'auth-token': token,
                    'content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.resUser) {
                    data.resUser.newNotis = data.newNotis;
                    setUser(data.resUser);
                }else{
                    document.cookie = 'auth-token=;secure;max-age=0;SameSite=None';
                }
            });
        }
           
    }

    const getToken = () => {
        const cookies = document.cookie.split(';');
        cookies.forEach(c => {
            if(c.includes('auth-token')){
                setToken(c.split('=').pop());
            }
        })
    }


    const value = useMemo(() => {
        getToken();
        fetchUser();
        return ({
            userState,
            token
        })
    }, [token, userState])

    return <UserContext.Provider value={value}>
        {props.children}
    </UserContext.Provider>

}

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUser must be in UserContext provider');
    }
    return context;
}