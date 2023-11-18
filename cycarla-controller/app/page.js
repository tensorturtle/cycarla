'use client'
import { Noto_Sans_Mono } from 'next/font/google'
 

import { socket } from './socket';
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import BTModal from './components/BTModal';
import { SteeringVisualizer } from './components/SteeringVisualizer';

// If loading a variable font, you don't need to specify the font weight
const inter = Noto_Sans_Mono({
  subsets: ['latin'],
  display: 'swap',
})

function roundOrPad(num, digits) {
  // Round to the given number of digits, or pad with zeros to be the given number of digits and return as string
  const rounded = num.toFixed(digits);
  const padded = rounded.padStart(digits, "0");
  return padded;
}

function PerformanceLiveStats({ server_fps, simulation_fps }) {
  return (    
    <div className="flex gap-1">
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Server FPS:</div>
        <div className="text-sm">{server_fps}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Simulation FPS:</div>
        <div className="text-sm">{simulation_fps}</div>
      </div>
    </div>
  )
}

function KinematicsLiveStats({ speed, xLocation, yLocation, latGnss, lonGnss, altitude }) {
  return (
    <div className="flex gap-1">
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Speed:</div>
        <div className="text-sm">{roundOrPad(speed, 1)}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Location X:</div>
        <div className="text-sm">{roundOrPad(xLocation,2)}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Location Y:</div>
        <div className="text-sm">{roundOrPad(yLocation,2)}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">GNSS Lat:</div>
        <div className="text-sm">{roundOrPad(latGnss, 6)}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">GNSS Lon:</div>
        <div className="text-sm">{roundOrPad(lonGnss, 6)}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Altitude:</div>
        <div className="text-sm">{roundOrPad(altitude, 2)}</div>
      </div>
    </div>
  )
}

function ControlLiveStats({ throttle, steer, brake, reverse, hand_brake, manual, gear }) {
  return (
    <div className="flex gap-1">
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Throttle:</div>
        <div className="text-sm">{roundOrPad(throttle,2)}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Steer:</div>
        <div className="text-sm">{roundOrPad(steer, 3)}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Brake:</div>
        <div className="text-sm">{brake}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Reverse:</div>
        <div className="text-sm">{reverse}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Hand Brake:</div>
        <div className="text-sm">{hand_brake}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Manual:</div>
        <div className="text-sm">{manual}</div>
      </div>
      <div className="flex gap-1">
        <div className="text-sm opacity-50">Gear:</div>
        <div className="text-sm">{gear}</div>
      </div>
    </div>
  )
}



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

  // Autopilot status
  const [autopilotActual, setAutopilotActual] = useState(false);

  // Live stats from carla simulation
  const [serverFps, setServerFps] = useState(0.0);
  const [simulationFps, setSimulationFps] = useState(0.0);
  const [map, setMap] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const [compass, setCompass] = useState(0.0);
  const [heading, setHeading] = useState("");
  const [speed, setSpeed] = useState(0.0);
  const [xAcceleration, setXAcceleration] = useState(0.0);
  const [yAcceleration, setYAcceleration] = useState(0.0);
  const [gyro, setGyro] = useState();
  const [xLocation, setXLocation] = useState(0.0);
  const [yLocation, setYLocation] = useState(0.0);
  const [latGnss, setLatGnss] = useState(0.0);
  const [lonGnss, setLonGnss] = useState(0.0);
  const [altitude, setAltitude] = useState(0.0);
  const [throttle, setThrottle] = useState(0.0);
  const [steer, setSteer] = useState(0.0);
  const [brake, setBrake] = useState(0.0);
  const [reverse, setReverse] = useState(0.0);
  const [handBrake, setHandBrake] = useState(0.0);
  const [manual, setManual] = useState(0.0);
  const [gear, setGear] = useState(0.0);

  function parseSimulationLiveData(message) {
    // Parse the received JSON data
    const {
      server_fps,
      simulation_fps,
      map,
      elapsed_time,
      compass,
      heading,
      speed,
      acceleration,
      gyro,
      location,
      gnss,
      altitude,
      throttle,
      steer,
      brake,
      reverse,
      hand_brake,
      manual,
      gear,
    } = message;

    // Update the state variables
    setServerFps(roundOrPad(server_fps, 0));
    setSimulationFps(roundOrPad(simulation_fps,0));
    setMap(map);
    setElapsedTime(elapsed_time);
    setCompass(compass);
    setHeading(heading);
    setSpeed(speed);
    setXAcceleration(acceleration[0]);
    setYAcceleration(acceleration[1]);
    setGyro((gyro[0], gyro[1], gyro[2]));
    setXLocation(location[0]);
    setYLocation(location[1]);
    setLatGnss(gnss[0]);
    setLonGnss(gnss[1]);
    setAltitude(altitude);
    setThrottle(throttle);
    setSteer(steer);
    setBrake(brake);
    setReverse(reverse);
    setHandBrake(hand_brake);
    setManual(manual);
    setGear(gear);
  }




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
      parseSimulationLiveData(message)
    }

    function onReporterNotification(message) {
      console.log("ReporterNotification:")
      console.log(message);
    }

    function onReporterError(message) {
      console.log("ReporterError:")
      console.log(message);
    }

    function onAutopilotActual(message) {
      // message is a boolean from python
      console.log("AutopilotActual:")
      console.log(message);
      setAutopilotActual(message);
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
    socket.on('autopilot_actual', onAutopilotActual)
    

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
      socket.off('autopilot_actual', onAutopilotActual)
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

  const sendAutopilotToggle = () => {
    socket.emit('autopilot')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <BTModal isOpen={isBTModalOpen} onClose={() => setBTModelOpen(false)} socket={socket} btGreen={btGreen}  setBtGreen={setBtGreen} />
      <div className="z-10 max-w-5xl w-full items-center justify-between lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center backdrop-blur-sm bg-black/20 lg:w-auto lg:p-0 lg:m-6 rounded-xl">

          <Image
              src="/cycarla-simpler-banner-transbg-for-dark.png"
              alt="Cycarla Logo"
              className="h-20 w-auto lg:h-36 lg:w-auto"
              width={1044}
              height={437}
              priority
            />
        </div>
      </div>

      <div className="relative pt-16 lg:pt-0">
        <div className="relative">
          <img src={`data:image/jpeg;base64,${carlaFrame}`} />

          <div className="absolute top-0 right-0">
            <div className="m-2 relative flex px-10 justify-center backdrop-blur-md w-auto rounded-xl bg-black/50">
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

          <div className="absolute bottom-0 left-0">
            <div className="m-2 relative flex px-10 justify-center backdrop-blur-md w-max rounded-xl bg-black/50">
              <div className="flex flex-col gap-1 items-left justify-center font-size-xl">
                <div className={inter.className}>
                  <button className="text-white font-bold text-2xl" onClick={sendAutopilotToggle}>{autopilotActual ? "Autopilot ON" : "Autopilot OFF"}</button>
                  <PerformanceLiveStats server_fps={serverFps} simulation_fps={simulationFps} />
                  <KinematicsLiveStats speed={speed} xAcceleration={xAcceleration} yAcceleration={yAcceleration} xLocation={xLocation} yLocation={yLocation} latGnss={latGnss} lonGnss={lonGnss} altitude={altitude} />
                  <ControlLiveStats throttle={throttle} steer={steer} brake={brake} reverse={reverse} hand_brake={handBrake} manual={manual} gear={gear} />
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
          className="group rounded-lg border border-neutral-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
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
          className="group rounded-lg border border-neutral-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
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
          className="group rounded-lg border border-neutral-800  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
          <div className="flex items-center justify-between">
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
