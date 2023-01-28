import { atom } from 'recoil';

const playerState = atom({
  key: 'playerState',
  default: '',
});

export { playerState };