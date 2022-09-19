import React from "react";
import {useMobile} from '../../Contexts/mobile.jsx'
import {useUser} from '../../Contexts/user.jsx'
import Header from "./Header.jsx"
import Aside from "./aside.jsx"
import Unlogged from "../partials/unlogged.jsx";
import { useState } from "react";

const Schema = ({Content}) => {
    const {isMobile} = useMobile();
    const {userState, token} = useUser();
    const [active, setActive] = useState(false)

    return(
        <div id="app-body">
            {!isMobile ? 
                <header>
                    <Header />
                </header>
                :''
            }
        <div id={isMobile ? 'mobile-content' : 'content'}>
            <div id="content-pos">
                <div id="center">
                    <Content />
                </div>
            </div>
        </div>
        {!isMobile ? 
            <footer>
                <Aside />
            </footer>
            :
            token ?
            <div id="mobile-header">
                <Header />
            </div>:''
        }
        {!token ? <Unlogged /> : ''}
        </div>
    )
}

export default Schema;