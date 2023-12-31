import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    HubCommandHostGame,
    HubCommandJoinGame,
    HubCommandLeaveHub,
    GameCommandForfeit,
    GameCommandMakeTurn,
} from '@user530/ws_game_shared/interfaces/ws-messages';


const initialState = {};

const socketMessagesSlice = createSlice({
    name: 'socketMessageSlice',
    initialState,
    reducers: {
        hubSocketConnection() {
            return 'CONNECT TO THE WS HUB SOCKET';
        },
        gameSocketConnection() {
            return 'CONNECT TO THE WS GAME SOCKET';
        },
        sendSocketCommand(state, action: PayloadAction<
            | HubCommandHostGame
            | HubCommandJoinGame
            | HubCommandLeaveHub
            | GameCommandMakeTurn
            | GameCommandForfeit
        >) {
            return 'SENT GAME COMMAND MESSAGE';
        },

    }
});

export const { sendSocketCommand, gameSocketConnection, hubSocketConnection } = socketMessagesSlice.actions;
export default socketMessagesSlice;