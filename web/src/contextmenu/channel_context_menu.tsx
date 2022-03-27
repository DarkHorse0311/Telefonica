import React, { useContext } from 'react'
import { StatesContext, StateContext } from "../contexts/states";
import { UserContextOBJ, UserContext } from "../contexts/usercontext";

import { ChannelOBJ } from '../models/models';

interface propsChannelCtxProps {
    location: {x: number, y: number, channel: ChannelOBJ},
}

export default function ChannelContextMenu(props: propsChannelCtxProps) {
  const state_context: StateContext = useContext(StatesContext);
  const user_ctx:UserContextOBJ = useContext(UserContext);

  let style: React.CSSProperties
  style = {
        top: props.location.y,
        left: props.location.x
  }
  return (
    <div className='ContextMenu' style={style}>
        
        { props.location.channel.owner_id === user_ctx.uuid && <button className='CtxBtn' onClick={() =>{
            state_context.setChannelOBJ(props.location.channel);
            state_context.setEditChannel(true);
        }}>Edit Channel</button> }

        <button className='CtxDelBtn' onClick={ () => {
            state_context.setChannelOBJ(props.location.channel);
            state_context.setDeleteChannel(true);
        }
        }>Leave Channel</button>

        <button className='CtxBtn' onClick={() => {navigator.clipboard.writeText(props.location.channel.uuid)}}>Copy ID</button>
    </div>
  )
}
