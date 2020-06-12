import actions from './actions';
import mutations from './mutations';

const auth = {
  namespaced: true,
  state: {
    accessToken: 'BQCJdU2y_nYNtx_JjDLURI3nQopmLLgo9ANKcJLO5FwT4W99bafV2ju-bbjRFVUQks0a856iVxIChDg8BWc5AyTtoRtqvZh7nUDLGpmJlWF3Xaw4tQZjeot3LBd4v7CLvF25rrxOatDg0S0mbQEUVjqSXn0nAAgQZmUN42FHs15_OME_wRHp-pI9aiIduvDYm9WBV05xpkmyRX0MTURJCHrvnOM3l7vjoyxXI13_NmsRpAl1-LANNXkzVUUtSi6gLhS6Mf6waX3_wwZ__952Gj4pVTGvHdRinf0',
    refreshToken: 'BQCJdU2y_nYNtx_JjDLURI3nQopmLLgo9ANKcJLO5FwT4W99bafV2ju-bbjRFVUQks0a856iVxIChDg8BWc5AyTtoRtqvZh7nUDLGpmJlWF3Xaw4tQZjeot3LBd4v7CLvF25rrxOatDg0S0mbQEUVjqSXn0nAAgQZmUN42FHs15_OME_wRHp-pI9aiIduvDYm9WBV05xpkmyRX0MTURJCHrvnOM3l7vjoyxXI13_NmsRpAl1-LANNXkzVUUtSi6gLhS6Mf6waX3_wwZ__952Gj4pVTGvHdRinf0',
    expiryTime: '3600'
  },
  actions,
  mutations,
  getters: {
    getAccessToken: state => state.accessToken,
    getRefreshToken: state => state.refreshToken,
    getExpiryTime: state => state.expiryTime,
  },
};

export default auth;
