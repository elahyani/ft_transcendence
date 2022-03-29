import { useVelocity } from 'framer-motion';
import { useEffect, useState } from 'react';
import Canvas from './Canvas.jsx';
import Pong from './Pong';

interface UserType {
  userType: string;
}

const PongGame: React.FC<UserType> = ({ userType }) => {
  //! /////////////////////
  // const [msg, setMsg] = useState('msg');

  //   const hello = 'hello';
  //   const message = document.getElementById('message');
  //   const messages = document.getElementById('messages');
  //   const handleSubmitNewMessage = () => {
  //     console.log();
  //     socket.emit('message', { data: msg });
  //   };

  //   socket.on('message', ({ data }) => {
  //     handleNewMessage(data);
  //   });

  //   const handleNewMessage = (message: string) => {
  //     messages?.appendChild(buildNewMessage(message));
  //   };

  //   const buildNewMessage = (msg: any) => {
  //     const li = document.createElement('li');
  //     li.appendChild(document.createTextNode(msg));
  //     return li;
  //   };

  // //! /////////////////////
  const [tableColor, setTableColor] = useState('#000000');
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    // if (count === 0) setTableColor('#0818A8');
    // if (count === 0) setTableColor('#000080');
    // if (count === 0) setTableColor('#191970');
    // if (count === 0) setTableColor('#00008B'); //blue
    if (count === 0) setTableColor('#00A36C');
    // green
    else if (count === 1) setTableColor('#fbb3c2');
    // pink
    else if (count === 2) setTableColor('#FF59A1');
    //pink
    else if (count === 3) setTableColor('#CD5C5C');
    // pink
    else if (count == 4) {
      setCount(0);
      setTableColor('#000000');
    }
  };

  return (
    // <div className=''>
    <div className='page-100 w-full h-full relative'>
      {/* <div className='flex  items-center justify-center'> */}
      {/* <div className=' page-100 flex items-center justify-center h-full w-full'> */}
      {/* <h1 className="text-2xl">PING PONG</h1> */}
      <Pong userType={userType} />
      {/* <Pong /> */}
      {/* </div> */}
    </div>
  );
};

export default PongGame;
