import {atom} from 'recoil';

const playerState = atom({
    key: 'playerState',
    default: [],
});

const currentSongIdState = atom({
    key: 'currentSongIdState',
    default: '',
});

const loadingState = atom({
    key: 'loadingState',
    default: false,
});

const isInfoModalOpenedState = atom({
    key: 'isInfoModalOpenedState',
    default: false,
});

const infoModalDataState = atom({
    key: 'infoModalDataState',
    default: false,
});

export {playerState, loadingState, currentSongIdState, isInfoModalOpenedState, infoModalDataState};