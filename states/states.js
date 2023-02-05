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

const isPlaylistOpenedState = atom({
    key: 'isPlaylistOpenedState',
    default: false,
});

export {playerState, loadingState, currentSongIdState, isPlaylistOpenedState};