import '@/styles/globals.css';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { useEffect, useState, createContext } from 'react';
import Nav from './components/nav';
import Player from './components/player';
import { RecoilRoot } from 'recoil';
import '@/styles/player.css'

export default function App({ Component, pageProps }) {
  const [songId, setSongId] = useState(null);
  const [theme, setTheme] = useState(createTheme({
    type: 'light'
  }))

  useEffect(() => {
    setTheme(createTheme({
      type: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
      theme: {
        colors: {
          primary: '#4ADE7B',
          secondary: '#F9CB80',
          error: '#FCC5D8',
        },
      }
    }));

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setTheme(createTheme({
        type: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
        theme: {
          colors: {
            primary: '#4ADE7B',
            secondary: '#F9CB80',
            error: '#FCC5D8',
          },
        }
      }))
    })
  }, [])

  const updatePlayer = (id) => {
    setSongId(id);
  }

  return (
    <NextUIProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps} propFunction={updatePlayer} />
        <Player />
        <Nav />
      </RecoilRoot>
    </NextUIProvider>
  );
}
