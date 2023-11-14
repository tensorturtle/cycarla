'use client'
import { socket } from './socket';
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import BTModal from './components/BTModal';
import { SteeringVisualizer } from './components/SteeringVisualizer';


export default function Home() {
  const [isWebsocketConnected, setWebsocketConnected] = useState(socket.connected);

  const [ btGreen, setBtGreen] = useState(false)
  const lastSteeringAngleCall = useRef(null);
  const lastPowerCall = useRef(null);
  const btGreenTimeout = useRef(null);

  // live updated data from sensors
  const [steeringAngle, setSteeringAngle] = useState(0.0);
  const [power, setPower] = useState(0.0);

  // JPEG image as text from carla
  const [carlaFrame, setCarlaFrame] = useState(null);

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
    }

    function onSteeringAngle(message) {
      setSteeringAngle(message);
      lastSteeringAngleCall.current = Date.now();
      checkBtGreen();
    }

    function onPower(message) {
      setPower(message);
      lastPowerCall.current = Date.now();
      checkBtGreen();
    }

    function checkBtGreen() {
      if (lastSteeringAngleCall.current && lastPowerCall.current) {
        const now = Date.now();
        if (now - lastSteeringAngleCall.current <= 3000 && now - lastPowerCall.current <= 3000) {
          setBtGreen(true);
          if (btGreenTimeout.current) clearTimeout(btGreenTimeout.current);
          btGreenTimeout.current = setTimeout(() => setBtGreen(false), 3000);
        }
      }
    }

    function onCarlaFrame(message) {
      setCarlaFrame(message);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('heartbeat', onHeartbeat);
    socket.on('steering_angle', onSteeringAngle);
    socket.on('power', onPower)
    socket.on('carla_frame', onCarlaFrame)

    return () => {
      // all socket registration events should be removed when the component unmounts
      // to avoid duplicate receptions
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('heartbeat', onHeartbeat)
      socket.off('steering_angle', onSteeringAngle)
      socket.off('power', onPower)
      socket.off('carla_frame', onCarlaFrame)
    }
  }, [])

  const handleStartGame = () => {
    console.log("Starting Game")
    socket.emit('start_game')
  }

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
        <img src={`data:image/jpeg;base64,${carlaFrame}`} />
      </div>
      {/* <div className="relative flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-0 pt-0 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30"> */}
      <div className="m-2 relative flex w-full justify-center backdrop-blur-2xl w-auto rounded-xl border border-gray-800 p-4 dark:bg-zinc-800/30">
        <div className="flex gap-16 items-center justify-center">
          <SteeringVisualizer steeringAngle={steeringAngle} />
          <div className="flex flex-col justify-center items-center">
            <div className="text-8xl">
              {power} W
            </div>
          </div>
        </div>
      </div>

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

        <button 
          onClick={handleStartGame}
          className="group rounded-lg border border-gray-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <div className="flex items-center justify-between">
            {/* <div
              className={`m-3 h-5 w-8 rounded-full ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
            /> */}
            <h2 className={`mb-3 text-2xl font-semibold`}>
            Start Carla Game{' '}
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
