'use client'
import { socket } from './socket';
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import BTModal from './components/BTModal';
import { SteeringVisualizer } from './components/SteeringVisualizer';


export default function Home() {
  const [isWebsocketConnected, setWebsocketConnected] = useState(socket.connected);

  const [ btGreen, setBtGreen] = useState(false)

  const [ isGameOn, setIsGameOn] = useState(false)
  const [ awaitingGameStart, setAwaitingGameStart] = useState(true)

  const lastSteeringAngleCall = useRef(null);
  const lastPowerCall = useRef(null);
  const btGreenTimeout = useRef(null);

  // bluetooth connection names
  const [ sterzoDevice, setSterzoDevice] = useState(null)
  const [ powerDevice, setPowerDevice] = useState(null)

  // live updated data from sensors
  const [steeringAngle, setSteeringAngle] = useState(0.0);
  const [power, setPower] = useState(0.0);

  // JPEG image as text from carla
  const [carlaFrame, setCarlaFrame] = useState(null);

  const [isBTModalOpen, setBTModelOpen] = useState(false);
  const openBTModal = () => setBTModelOpen(true);

  // On startup, finish any potentially running game
  useEffect(() => {
    socket.emit('finish_game')
  }, [])

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

    function onGameLaunched(message) {
      setIsGameOn(true);
      setAwaitingGameStart(false);
    }

    function onGameFinished(message) {
      setIsGameOn(false);
      setAwaitingGameStart(true);
    }

    function onSterzoDevice(message) {
      setSterzoDevice(message);
    }

    function onPowerDevice(message) {
      setPowerDevice(message);
    }

    function onSimulationLiveData(message) {
      console.log("SimulationLiveData:")
      console.log(message);
    }

    function onReporterNotification(message) {
      console.log("ReporterNotification:")
      console.log(message);
    }

    function onReporterError(message) {
      console.log("ReporterError:")
      console.log(message);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('heartbeat', onHeartbeat);
    socket.on('steering_angle', onSteeringAngle);
    socket.on('power', onPower)
    socket.on('carla_frame', onCarlaFrame)
    socket.on('game_launched', onGameLaunched)
    socket.on('game_finished', onGameFinished)
    socket.on('sterzo_device', onSterzoDevice)
    socket.on('power_device', onPowerDevice)
    socket.on('simulation_live_data', onSimulationLiveData)
    socket.on('reporter_notification', onReporterNotification)
    socket.on('reporter_error', onReporterError)
    

    return () => {
      // all socket registration events should be removed when the component unmounts
      // to avoid duplicate receptions
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('heartbeat', onHeartbeat)
      socket.off('steering_angle', onSteeringAngle)
      socket.off('power', onPower)
      socket.off('carla_frame', onCarlaFrame)
      socket.off('game_launched', onGameLaunched)
      socket.off('game_finished', onGameFinished)
      socket.off('sterzo_device', onSterzoDevice)
      socket.off('power_device', onPowerDevice)
      socket.off('simulation_live_data', onSimulationLiveData)
      socket.off('reporter_notification', onReporterNotification)
      socket.off('reporter_error', onReporterError)
    }
  }, [])

  const handleStartGame = () => {
    setAwaitingGameStart(false)
    console.log("Requesting starting Game")
    socket.emit('start_game')
  }

  const handleFinishGame = () => {
    console.log("Requesting finishing Game")
    socket.emit('finish_game')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <BTModal isOpen={isBTModalOpen} onClose={() => setBTModelOpen(false)} socket={socket} btGreen={btGreen}  setBtGreen={setBtGreen} />
      <div className="z-10 max-w-5xl w-full items-center justify-between lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-gray-300 backdrop-blur-xl dark:bg-zinc-800/50 lg:w-auto lg:p-4 lg:m-4 lg:bg-inherit rounded">

          <Image
              src="/dalle-cycarla-logo.png"
              alt="Cycarla Logo"
              className="dark:invert w-16 h-16 lg:w-32 lg:h-32"
              width={200}
              height={200}
              priority
            />
        </div>
      </div>

      <div className="relative pt-16 lg:pt-0">
        <div className="relative">
          <img src={`data:image/jpeg;base64,${carlaFrame}`} />

          <div className="absolute top-0 right-0">
            <div className="m-2 relative flex px-10 justify-center backdrop-blur-md w-auto rounded-xl border border-gray-800 bg-zinc-800/50">
              <div className="flex gap-10 items-center justify-center">
                <SteeringVisualizer steeringAngle={steeringAngle} />
                <div className="flex flex-col justify-center items-center">
                  <div className="text-6xl font-bold">
                    {power} W
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isGameOn === false && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/80 flex justify-center items-center">
              <span className="text-white font-bold text-2xl">Press 'Start' for new game</span>
            </div>
            )}
        </div>
      </div>

      <div className="pb-32 pt-2 gap-2 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <button 
          onClick={() => window.location.reload()}
          className="group rounded-lg border border-gray-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
          <div className="flex items-center justify-between">
            <h2 className={`mb-3 text-2xl font-semibold`}>
            Websocket Server{' '}
            </h2>
            <div className="mt-0 mb-1 ml-4">
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="10" fill={isWebsocketConnected ? "green" : "red"} />
            </svg>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-sm opacity-50 text-center">
              Click to reload (Game also restarts)
            </p>

          </div>
        </button>

        <button 
          onClick={openBTModal}
          className="group rounded-lg border border-gray-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <div className="flex items-center justify-between">
            <h2 className={`mb-3 text-2xl font-semibold`}>
            Bluetooth Connection{' '}
            </h2>
            <div className="mt-0 mb-1 ml-4">
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="10" fill={btGreen ? "green" : "red"} />
            </svg>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm opacity-50">Steering: {sterzoDevice}</div>
            <div className="text-sm opacity-50">Power: {powerDevice}</div>
          </div>
        </button>

        <div 
          className="group rounded-lg border border-gray-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
          <div className="flex items-center justify-between">
            {/* <div
              className={`m-3 h-5 w-8 rounded-full ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
            /> */}
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Carla Game{' '}
            </h2>
            <div className="mt-0 mb-1 ml-4">
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="10" fill={isGameOn ? "green" : "red"} />
            </svg>
            </div>

          </div>
          <div className="flex justify-between items-center px-4">
            <button disabled={!awaitingGameStart} onClick={handleStartGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded">
              Start
            </button>
            <button onClick={handleFinishGame} className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded">
              Finish
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
