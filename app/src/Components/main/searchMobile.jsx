import React, {useState, useEffect} from "react";
import Header from "./Header.jsx"
import { useTheme } from "../../Contexts/theme.jsx";
import { useMobile } from "../../Contexts/mobile.jsx";

const SearchMobile = () => {
    const {theme} = useTheme();
    const {isMobile} = useMobile();
    const [timeOutID, setTimeOutID] = useState();

    const sendData = () => {
        if(typeof timeOutID === "number"){
            window.clearTimeout(timeOutID);
            setTimeOutID(undefined);
        }
        setTimeOutID(window.setTimeout(()=>{searching()}, 600));
    }

    const searching = () => {
        fetch('/api/search', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: document.getElementById('search-input').value,
            })
        })
        .then((res) => (res.json()))
        .then(results => {
            const input = document.getElementById('search-input');
            const resultsDiv = document.getElementById('results');
            if(results){
                resultsDiv.innerHTML ='';
                results.map((resultRaw) => {
                    const [user, pic] = resultRaw.split('-');
                    const result = document.createElement('a');
                    result.classList.add('result')
                    result.classList.add('a-normalize')
                    result.setAttribute('href', '/user/'+user)
                    result.innerHTML = `
                    <img src=${pic} class="result-pic noti-pic">
                    <span>${user}</span>
                    `;
                    resultsDiv.appendChild(result)
                });
            }
        });
    }

    return(
        <div id="app-body">
            <div id="center">
                <div className='top-bar'>
                    <div className="back-btn-div">
                        <span className="back-btn material-icons notranslate">arrow_back</span>
                    </div>
                    <div className="top-bar-title">Búsquedas</div>
                </div>
                <div className="top-bar-space"></div>
                <div id={!isMobile ? "search-div": "mobile-search-div"}>
                    <div id={!isMobile ? "search-input-div" : "mobile-search-input-div"}>
                        <span className='material-icons notranslate'>search</span>
                        <input onKeyUp={sendData} id="search-input" type="text" placeholder="Buscar"/>
                    </div>
                    <div id="results"></div>
                </div>
                <div id="bottom-bar-space" />
            </div>
            {isMobile ? <header id="mobile-header">
                <Header />
            </header>: ''}
        </div>
    )
}

export default SearchMobile