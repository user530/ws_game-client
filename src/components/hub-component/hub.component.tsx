import React from 'react';
import styles from './hub.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks/useStore';
import { sendSocketCommand } from '../../app/store/reducers/slices/socket-messages.slice';
import { createHubHostMessage, createHubJoinMessage, createHubLeaveMessage } from '@user530/ws_game_shared/creators/messages';
import { LobbyItem } from './lobby-item/lobby-item';

interface IHubComponent { }

export const HubComponent: React.FC<IHubComponent> = (props: IHubComponent) => {
    const dispatch = useAppDispatch();
    const playerId = useAppSelector((state) => state.gameData.player!.playerId)
    const lobbyList = useAppSelector((state) => state.gameData.lobbyList);
    const [selectedLobbyId, setSelectedLobbyId] = React.useState<null | string>(null);

    const handleQuitHubClick = () => {
        if (!playerId) return;

        dispatch(sendSocketCommand(createHubLeaveMessage()));
    };

    const handleHostGameClick = () => {
        if (!playerId) return;

        dispatch(sendSocketCommand(createHubHostMessage({ playerId })));
    };
    const handleJoinGameClick = () => {
        if (!playerId || !selectedLobbyId) return;

        dispatch(sendSocketCommand(createHubJoinMessage({ playerId, gameId: selectedLobbyId })));
    };

    // Clear up selected lobby id if selected game is not open anymore
    React.useEffect(
        () => {
            const gameStillActive = lobbyList.reduce(
                (gameStillActive, lobby) => (gameStillActive || (lobby.gameId === selectedLobbyId)), false);

            if (!gameStillActive)
                setSelectedLobbyId(null);
        },
        [lobbyList]
    )

    return <>
        <div className={styles['hub-wrapper']}>
            <div className={styles['hub-heading']}>
                <h2 className={styles['h2']}>Open lobbies:</h2>
            </div>
            <div className={styles['hub-main']} onClick={() => setSelectedLobbyId(null)}>
                <div className={styles['hub-main__inner']}>
                    {
                        lobbyList.map(
                            ({ gameId, host: { hostName } }, ind) =>
                            (<LobbyItem
                                key={gameId}
                                onClick={
                                    (e: MouseEvent) => {
                                        e.stopPropagation();
                                        setSelectedLobbyId(gameId);
                                    }
                                }
                                isActive={selectedLobbyId === gameId}
                                itemInd={`${ind + 1}`}
                                hostName={hostName}
                            />))
                    }
                </div>
            </div>
            <div className={styles['hub-controls']}>
                <input onClick={handleHostGameClick} type="button" value="Host game" />
                {
                    selectedLobbyId
                        ? <input onClick={handleJoinGameClick} type="button" value="Join game" />
                        : null
                }
                <input onClick={handleQuitHubClick} type="button" value="Quit" />
            </div>
        </div>
    </>
}