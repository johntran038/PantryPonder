import { useState, useEffect } from "react";

const useScreenSize = () => {

    const [screenSize, setScreenSize] = useState("xs");

    useEffect(() => {
        const getSize = () => {
            if (window.innerWidth >= 1536) setScreenSize("2xl");
            else if (window.innerWidth >= 1280) setScreenSize("xl");
            else if (window.innerWidth >= 1024) setScreenSize("lg");
            else if (window.innerWidth >= 768) setScreenSize("md");
            else if (window.innerWidth >= 640) setScreenSize("sm");
            else if (window.innerWidth >= 480) setScreenSize("xs");
            else setScreenSize("2xs");
        };
        getSize();
        window.addEventListener("resize", getSize);
        return () => window.removeEventListener("resize", getSize);
    }, []);

    const ifScreen = (size, style=undefined) => {
        if(style === undefined) return size == screenSize;
        return size == screenSize ? style : "";
    }

    return { screenSize, ifScreen };
}

export default useScreenSize;