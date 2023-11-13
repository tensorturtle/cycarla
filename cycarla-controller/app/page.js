'use client'
import { socket } from './socket';
import Image from 'next/image'
import { useState, useEffect } from 'react';
import BTModal from './components/BTModal';

function SteeringVisualizer({ steeringAngle }) {
  // rotate an image based on the steering angle
  // 0 degrees is straight ahead, positive is right, negative is left
  const rotate = `rotate(${steeringAngle}deg)`;

  // use handlebar.png


  return (
    <div className="relative w-96 h-96">
      {/* <Image
        className="absolute top-0 left-0 w-full h-full"
        src="/handlebar.png"
        alt="Handlebar"
        layout="fill"
        objectFit="contain"
      /> */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ transform: rotate }}
      >
        <Image
          className="absolute top-0 left-0 w-full h-full"
          src="/handlebar.png"
          alt="Handlebar"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [isWebsocketConnected, setWebsocketConnected] = useState(socket.connected);
  const [ btGreen, setBtGreen] = useState(false)

  const [steeringAngle, setSteeringAngle] = useState(0.0);

  const [isBTModalOpen, setBTModelOpen] = useState(false);
  const openBTModal = () => setBTModelOpen(true);

  // Websocket handlers
  useEffect(() => {
    function onConnect() {
      setWebsocketConnected(true);
    }

    function onDisconnect() {
      setWebsocketConnected(false);
    }

    function onHeartbeat(message) {
      console.log('heartbeat', message)
      console.log("time: ", new Date().toLocaleString())
      // setLastHeartbeatMessage(message);
    }

    function onSteeringAngle(message) {
      console.log('steering_angle', message)
      setSteeringAngle(message);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('heartbeat', onHeartbeat);
    socket.on('steering_angle', onSteeringAngle);

    return () => {
      // all socket registration events should be removed when the component unmounts
      // to avoid duplicate receptions
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('heartbeat', onHeartbeat)
      socket.off('steering_angle', onSteeringAngle)
    }
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BTModal isOpen={isBTModalOpen} onClose={() => setBTModelOpen(false)} socket={socket} btGreen={btGreen}  setBtGreen={setBtGreen} />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.js</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/tensorturtle/cycarla"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/dalle-cycarla-logo.png"
              alt="Cycarla Logo"
              className="dark:invert"
              width={100}
              height={100}
              priority
            />
          </a>
        </div>
      </div>

        <div>
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <SteeringVisualizer steeringAngle={steeringAngle} />

      <button onClick={openBTModal}>Open Modal</button>

      <div className="mb-32 gap-2 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <button 
          onClick={openBTModal}
          className="group rounded-lg border border-gray-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <div className="flex items-center justify-between">
            {/* <div
              className={`m-3 h-5 w-8 rounded-full ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
            /> */}
            <h2 className={`mb-3 text-2xl font-semibold`}>
            Bluetooth Connection{' '}
            </h2>
            <div className="mt-0 mb-1 ml-4">
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="10" fill={btGreen ? "green" : "red"} />
            </svg>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-sm opacity-50 text-center">
              Connect to indoor cycling accessories via Bluetooth.
            </p>

          </div>
        </button>

        <button 
          onClick={null}
          className="group rounded-lg border border-gray-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <div className="flex items-center justify-between">
            {/* <div
              className={`m-3 h-5 w-8 rounded-full ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
            /> */}
            <h2 className={`mb-3 text-2xl font-semibold`}>
            Websocket Connection{' '}
            </h2>
            <div className="mt-0 mb-1 ml-4">
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="10" fill={isWebsocketConnected ? "green" : "red"} />
            </svg>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-sm opacity-50 text-center">
              Websocket connection to CyCARLA Server
            </p>

          </div>
        </button>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}
