import Picker, { IEmojiData } from 'emoji-picker-react';
import React, { useState, useContext, useEffect, useRef } from 'react';
import Message from './message';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceLaugh } from '@fortawesome/free-solid-svg-icons'
import ChannelHeader from './channel_header';
import { ChannelOBJ, Msg_request, MessageOBJ } from '../models/models';
import { ChannelsContext, ChannelContext } from "../contexts/channelctx";
import { ContextMenuCtx, ContextMenu } from "../contexts/context_menu_ctx";

function Chat({ channel }: { channel: ChannelOBJ }) {
    // Emoji picker https://www.cluemediator.com/how-to-add-emoji-picker-in-the-react
	const channel_context: ChannelContext = useContext(ChannelsContext);
	const bottom_ref = useRef<null | HTMLDivElement>(null);
    const [Input_message, setInput_message] = useState('');
    const [showPicker, setShowPicker] = useState(false);
	const [message_jsx, setMessage_jsx] = useState<JSX.Element[]>([]);
   
	const ctx_menu_context: ContextMenuCtx = useContext(ContextMenu);

    const onEmojiClick = (_: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
		setInput_message(prevInput => prevInput + data.emoji);
		setShowPicker(false);
    };

	
    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const inputstr = event.target.value;
		if (inputstr.length <= 150) {
			setInput_message(inputstr);
		} else {
			alert("Message too long");
		}
    }
    function updateChat(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			event.preventDefault();
			console.log(Input_message)
			if (channel.uuid !== "@me") {
				if (Input_message.length > 0) {
					const message: Msg_request = {
						channel: channel.uuid,
						content: Input_message
					};
					channel_context.gateway.send(
						JSON.stringify({
							event: "MESSAGE_CREATE",
							data: message
						})
					);
				}
			}
			setInput_message('');
		}
    }
	
	useEffect(() => {
		setMessage_jsx([])
		let msg_channel = channel_context.messages.get(channel.uuid);
		if (!msg_channel) {
			msg_channel = new Map<String, MessageOBJ>()
		}
		msg_channel.forEach((message, key) => {
				if (message.channel.uuid === channel.uuid) {
					setMessage_jsx(prevMessage =>  [...prevMessage, 
					<div key={message.uuid} onContextMenu={
						(event) => {
							event.preventDefault();
							ctx_menu_context.setShowMsgCtxMenu(false);
							ctx_menu_context.setShowChannelCtxMenu(false);
							ctx_menu_context.setShowMemberCtxMenu(false);
							ctx_menu_context.setMsgCtxMenuLocation({x: event.clientX, y: event.clientY, message: message, channel: channel});
							ctx_menu_context.setShowMsgCtxMenu(true);
						}
					}>
					<Message 
					avatar={message.author.avatar} 
					name={message.author.username} 
					message={message.content} 
					/>
					</div>
					])
				}

				if (bottom_ref.current !== null) {
					bottom_ref.current.scrollIntoView({ behavior: 'smooth' });
				}
			});
	}, [channel_context.messages, channel]);

    return (
        <div className="Chat">
			<ChannelHeader name={channel.name} icon={channel.icon} />
				<div className="chat-message">
					{message_jsx}
					<div ref={bottom_ref} />
				</div>
			<div className="chat-input">
				<button id="chat-emoji-picker" onClick={() => setShowPicker(val => !val)}>
					<FontAwesomeIcon icon={faFaceLaugh} />
				</button>
				<input id="chat-text" type="text" placeholder="Type a message..." onKeyPress={updateChat} value={Input_message} onChange={onInputChange}/>
			</div>
			{showPicker && <Picker onEmojiClick={onEmojiClick} />}
        </div>
    );
  }

export default Chat;
