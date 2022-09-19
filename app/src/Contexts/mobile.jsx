import React, {  useContext, useMemo, useState } from "react";
import { useEffect } from "react";

export const MobileContext = React.createContext()

export function MobileProvider(props) {
    const [isMobile, setIsMobile] = useState(null);
    const [widthS, setWidthS] = useState(false)

    useEffect(() => {
        const widthObs = new ResizeObserver((entries) => {
            if(entries[0].contentRect.width < 600){
                setWidthS(true)
                console.log('mobile!')
            }
        });
        widthObs.observe(document.body)
    }, [])


    const value = useMemo(() => {

        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if(/windows phone/i.test(userAgent)) setIsMobile(true);
        else if(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) setIsMobile(true);
        else if(/android/i.test(userAgent))setIsMobile(true);
        else if(widthS) setIsMobile(true)
        else setIsMobile(false)
        
        return({
            isMobile
        });
    }, [isMobile, setWidthS]);

    return <MobileContext.Provider value={value}>
        {props.children}
    </MobileContext.Provider>
}

export const useMobile = () => {
    const context = useContext(MobileContext);
    if(!context){
        throw new Error('useContext must be in MobileContext provider');
    }
    return context;
}