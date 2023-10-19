import '@/styles/globals.css';
import {createTheme, NextUIProvider} from "@nextui-org/react"
import {useState} from 'react';
import Nav from './components/nav';
import Player from './components/player';
import Loader from './components/loader';
import {RecoilRoot} from 'recoil';
import {loadingState} from '../states/states';
import '@/styles/player.css'
import SongInfoModal from "./components/songInfoModal";

export default function App({Component, pageProps}) {
    const [songId, setSongId] = useState(null);
    const [theme, setTheme] = useState(createTheme({
        type: 'dark'
    }))

    /*
    useEffect(() => {
        setTheme(createTheme({
            type: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
        }));

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            setTheme(createTheme({
                type: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
            }))
        })
    }, [])

     */

    const updatePlayer = (id) => {
        setSongId(id);
    }

    return (
        <NextUIProvider theme={theme}>
            <RecoilRoot>
                <Component {...pageProps} propFunction={updatePlayer}/>
                <Player/>
                <SongInfoModal/>
                <Nav/>
                <Loader state={loadingState}/>
            </RecoilRoot>
        </NextUIProvider>
    );
}
