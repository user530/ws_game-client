import React, { useRef } from 'react';
import styles from './chat.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks/useStore';
import { ChatMessage } from './chat-message/chat-message.component';
import { sendSocketCommand } from '../../app/store/reducers/slices/socket-messages.slice';
import { createChatSendMsgMessage } from '@user530/ws_game_shared/creators/messages';
import { createErrorPopup } from '../../app/functions/popup.creator';
import { setPopup } from '../../app/store/reducers/slices/game-data.slice';

interface IChatComponent {
    heading?: string;
}

export const ChatComponent: React.FC<IChatComponent> = (props: IChatComponent) => {

    const messages = useAppSelector(state => state.gameData.messages);
    const user = useAppSelector(state => state.gameData.player?.playerId);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [inputLen, setInputLen] = React.useState<number>(0);
    const dispatch = useAppDispatch();

    const chatSendMsgHandler = React.useCallback(() => {
        // Handle exceptions
        if (!user || !inputRef.current) {
            const errEvent = createErrorPopup({ heading: 'Error #401', message: 'Can\'t send message if not authorized!' });
            return dispatch(setPopup(errEvent));
        }

        // Ignore empty input
        const inputTxt = inputRef.current.value.trim();
        if (!inputTxt) return;

        // Create and send WS message
        const message = createChatSendMsgMessage({ message: inputTxt, user });
        dispatch(sendSocketCommand(message));

        // Clear the input
        inputRef.current.value = '';

    }, [user, dispatch]);

    const chatSendKeyHandler = React.useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            chatSendMsgHandler();
        }
    }, [chatSendMsgHandler]);

    React.useEffect(
        () => {
            window.addEventListener('keydown', chatSendKeyHandler);

            return () => window.removeEventListener('keydown', chatSendKeyHandler);
        },
        [chatSendKeyHandler]
    )

    return <>
        <div className={styles['chat-wrapper']}>
            <div className={styles['chat-heading']}>
                <h2 className={styles['h2']}>{props.heading ? props.heading : 'Chat:'}</h2>
            </div>

            <div className={styles['chat-main']}>
                <div className={styles['chat-main__inner']}>
                    {
                        messages.map((message, ind) => <ChatMessage key={ind} {...message} />)
                    }
                </div>
            </div>

            <div className={styles['chat-controls']}>
                <div className={styles['chat-controls__textarea']}>
                    <textarea
                        ref={inputRef}
                        className={styles['textarea__input']}
                        placeholder='For the DM try "/w <user_name> <your message>"'
                        maxLength={255}
                        onChange={(e) => setInputLen(e.target.value.length)}
                    />
                    <span className={styles['textarea__counter']}
                        style={{ color: `rgba(${255 * inputLen / 255}, ${255 * (1 - inputLen / 255)}, 0, 0.9)` }}
                    >{inputLen} / 255</span>
                </div>

                <input
                    className={styles['chat-controls__btn']}
                    type="button"
                    value="Send"
                    onClick={chatSendMsgHandler}
                />
            </div>
        </div>
    </>
}