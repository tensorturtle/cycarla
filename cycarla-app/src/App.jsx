// 'use client'

import "./App.css";

let debug_full_stats = false; // toggle is not implemented; manually change here.

import { socket } from "./socket";

// UNSUPPORTED NEXT.JS STUFF
// Use regular <img> tag.
// import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import BTModal from './components/BTModal';
import { SteeringVisualizer } from './components/SteeringVisualizer';
import { PerformanceLiveStats, KinematicsLiveStats, ControlLiveStats, roundOrPad } from './components/LiveStats';
import { BlackJPEGBase64 } from './components/BlackJPEG';
import { SliderNumerical } from './components/SliderNumerical';
import DropdownMenu from './components/DropDown';


const requestBTScan = () => {
  console.log("Requesting BT Scan")
  socket.emit('bt_scan')
}

export default function Home() {
  const [isWebsocketConnected, setWebsocketConnected] = useState(socket.connected);

  const [ btGreen, setBtGreen] = useState(false)

  const [ isGameOn, setIsGameOn] = useState(false)
  const [ awaitingGameStart, setAwaitingGameStart] = useState(true)

  const lastSteeringAngleCall = useRef(null);
  const lastPowerCall = useRef(null);
  const btGreenTimeout = useRef(null);

  // available maps
  const [availableMaps, setAvailableMaps] = useState([])
  const [selectedMap, setSelectedMap] = useState('Town01');
  const handleSelectMap = (map) => {
    setSelectedMap(map);
  };

  // bluetooth connection names
  const [ sterzoDevice, setSterzoDevice] = useState("")
  const [ powerDevice, setPowerDevice] = useState("")

  // live updated data from sensors
  const [steeringAngle, setSteeringAngle] = useState(0.0);
  const [power, setPower] = useState(0.0);
  const [cadence, setCadence] = useState(0.0);
  const [wheelSpeed, setWheelSpeed] = useState(0.0);

  // JPEG image as text from carla

  const [carlaFrame, setCarlaFrame] = useState(BlackJPEGBase64);

  // we use useRef because we want to be able to use it in the websocket handler
  const [savedCarlaFrame, setSavedCarlaFrame] = useState("");
  const savedCarlaFrameRef = useRef(savedCarlaFrame);
  useEffect(() => {
    savedCarlaFrameRef.current = savedCarlaFrame;
  }, [savedCarlaFrame]);

  function saveFrame() {
    setSavedCarlaFrame(carlaFrame);
    console.log(
      "Saved frame"
    )
  }

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
  const [roadGradient, setRoadGradient] = useState(0.0);

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
      road_gradient
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
    setRoadGradient(road_gradient);
  }

  // On startup, finish any potentially running game
  useEffect(() => {
    socket.emit('finish_game')
  }, [])

  // On startup, request the available maps
  useEffect(() => {
    socket.emit('get_available_maps')
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

    function onCadence(message) {
      setCadence(message);
    }

    function onWheelSpeed(message) {
      setWheelSpeed(message);
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

      // Save the first frame for the ride picture as a default
      setSavedCarlaFrame(message);
    }

    function onGameLaunched(message) {
      setIsGameOn(true);
      setAwaitingGameStart(false);

      // Reset the saved frame
      setSavedCarlaFrame("");
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

    function onFinishedGpx(gpxString) {
      // download the gpx file and JPEG screenshot
      downloadFile(gpxString, 'application/gpx+xml', 'cycarla_ride.gpx')

      if (savedCarlaFrameRef.current != "") {
        downloadB64Image(savedCarlaFrameRef.current, 'image/jpeg', 'cycarla_ride.jpg')
      }
    }

    function downloadFile(rawString, type, filename) {
      // This function causes the browser to download the file

      // Convert the GPX string into a Blob
      const blob = new Blob([rawString], {type: type});
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create an anchor (`<a>`) tag to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Specify the name of the file to download
      
      // Append the anchor tag to the body, click it, and remove it
      document.body.appendChild(a);
      a.click();
      
      // Clean up by revoking the Blob URL and removing the anchor tag
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function downloadB64Image(base64Data, type, filename) {
      // Decode the base64 string to binary data
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the binary data
      const blob = new Blob([bytes], {type: type});

      // Proceed with the rest of your function to trigger the download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Specify the name of the file to download

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function onAvailablemaps(message) {
      // maps is in the form of a list of strings
      // that looks something like 
      // [ "/Game/Carla/Maps/Town02", … ]
      // we want to remove the "/Game/Carla/Maps/" part and just keep the map name
      const maps = message.map((map) => map.replace("/Game/Carla/Maps/", ""))
      setAvailableMaps(maps)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('heartbeat', onHeartbeat);
    socket.on('steering_angle', onSteeringAngle);
    socket.on('power', onPower)
    socket.on('cadence', onCadence)
    socket.on('wheel_speed', onWheelSpeed)
    socket.on('carla_frame', onCarlaFrame)
    socket.on('game_launched', onGameLaunched)
    socket.on('game_finished', onGameFinished)
    socket.on('sterzo_device', onSterzoDevice)
    socket.on('power_device', onPowerDevice)
    socket.on('simulation_live_data', onSimulationLiveData)
    socket.on('reporter_notification', onReporterNotification)
    socket.on('reporter_error', onReporterError)
    socket.on('autopilot_actual', onAutopilotActual)
    socket.on('finished_gpx_file', onFinishedGpx)
    socket.on('available_maps', onAvailablemaps)
    

    return () => {
      // all socket registration events should be removed when the component unmounts
      // to avoid duplicate receptions
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('heartbeat', onHeartbeat)
      socket.off('steering_angle', onSteeringAngle)
      socket.off('power', onPower)
      socket.on('cadence', onCadence)
      socket.off('wheel_speed', onWheelSpeed)
      socket.off('carla_frame', onCarlaFrame)
      socket.off('game_launched', onGameLaunched)
      socket.off('game_finished', onGameFinished)
      socket.off('sterzo_device', onSterzoDevice)
      socket.off('power_device', onPowerDevice)
      socket.off('simulation_live_data', onSimulationLiveData)
      socket.off('reporter_notification', onReporterNotification)
      socket.off('reporter_error', onReporterError)
      socket.off('autopilot_actual', onAutopilotActual)
      socket.off('finished_gpx_file', onFinishedGpx)
      socket.off('available_maps', onAvailablemaps)
    }
  }, [])

  const handleStartGame = () => {
    setAwaitingGameStart(false)
    console.log("Requesting starting Game")
    socket.emit('start_game', selectedMap)
  }

  const handleFinishGame = () => {
    console.log("Requesting finishing Game")
    socket.emit('finish_game')
  }

  const handleSliderChange = (value) => {
    console.log("Slider value: ", value);
    socket.emit('added_gradient_percent', value)
    // Additional actions based on the slider value
  };

  const sendAutopilotToggle = () => {
    socket.emit('autopilot')
  }

  const changeCamera = () => {
    socket.emit('change_camera')
  }

  return (
    <main className="relative h-screen bg-black">
      <BTModal isOpen={isBTModalOpen} onClose={() => setBTModelOpen(false)} />

      <div className="absolute top-0 left:0 h-screen">       
        {/* Main game screen: Carla frame with HUD stats */}
        <div className="relative w-screen">
          <div className="relative w-screen">
            <img src={`data:image/jpeg;base64,${carlaFrame}`} className="w-screen h-auto" />
            {/* Simplified HUD stats (power, pedaling RPM, speed, gradient, time elapsed) */}
            <div className="absolute top-0 right-0 text-white pt-[120px]">
              <div className="m-2 px-4 py-2 relative flex px-10 justify-center backdrop-blur-md w-auto rounded-xl bg-black/50">
                <div className="flex gap-4 items-center justify-center">
                  <SteeringVisualizer steeringAngle={steeringAngle} />
                  <div className="flex flex-col justify-center items-center">
                    {/* Adjusted for power display */}
                    <div className="text-5xl font-bold w-48 text-right">
                      {power} W
                    </div>
                    {/* Adjusted for cadence display */}
                    <div className="text-2xl font-bold w-48 text-right">
                      {cadence} RPM
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    {/* Adjusted for speed display */}
                    <div className="text-2xl font-bold w-32 text-right">
                      {roundOrPad(speed, 0)} km/h
                    </div>
                    {/* Adjusted for gradient display */}
                    <div className="text-2xl font-bold w-32 text-right">
                      {roundOrPad(roadGradient, 0)} %
                    </div>
                    {/* Adjusted for time elapsed display, assuming it's a string like "00:00:00" */}
                    <div className="text-2xl font-bold w-32 text-right">
                      {elapsedTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug full stats */}
            { debug_full_stats ? (
            <div className="absolute bottom-0 left-0">
              <div className="m-2 relative flex px-10 justify-center backdrop-blur-md w-max rounded-xl bg-black/50">
                <div className="flex flex-col gap-1 items-left justify-center font-size-xl">
                  <div className={noto_sans_mono.className}>
                    <button className="text-white font-bold text-xl" onClick={sendAutopilotToggle}>{autopilotActual ? "Autopilot ON" : "Autopilot OFF"}</button>
                    <button className="text-white font-bold text-xl" onClick={changeCamera}>Change Camera</button>
                    <PerformanceLiveStats server_fps={serverFps} simulation_fps={simulationFps} />
                    <KinematicsLiveStats speed={speed} xAcceleration={xAcceleration} yAcceleration={yAcceleration} xLocation={xLocation} yLocation={yLocation} latGnss={latGnss} lonGnss={lonGnss} altitude={altitude} roadGradient={roadGradient} />
                    <ControlLiveStats throttle={throttle} steer={steer} brake={brake} reverse={reverse} hand_brake={handBrake} manual={manual} gear={gear} />
                  </div>
                </div>
              </div>
            </div>
            ) : null }

            {isGameOn === false && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/80 flex justify-center items-center">
                <span className="text-white font-bold text-2xl">Press 'Start' for new game</span>
              </div>
              )}
          </div>
          <div className="absolute top-0 left-0 w-screen backdrop-blur-sm bg-black/20">
            <div className="flex justify-between w-full px-20 bg-zinc-900/20">
              <a href="https://github.com/tensorturtle/cycarla" target="_blank" className="">
                <img src="/cycarla-simpler-banner-transbg-for-dark.png" alt="Cycarla Logo" className="h-20 w-auto lg:h-24 lg:w-auto mt-2" />
              </a>

              <div className="flex">
                <button 
                  onClick={() => window.location.reload()}
                  className="group rounded-lg border border-neutral-800 px-4 my-4 mx-2 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
                  >
                  <div className="flex items-center justify-between text-white">
                    <svg height="20" width="20">
                      <circle cx="10" cy="10" r="10" fill={isWebsocketConnected ? "green" : "red"} />
                    </svg>
                    <div className="flex flex-col items-center mx-2">
                      <h2 className={`text-xl font-semibold`}>
                        Backend{' '}
                      </h2>
                      <p className="text-xs opacity-50 text-center">
                      Click to reload
                      </p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={requestBTScan}
                  className="group rounded-lg border border-neutral-800 px-4 my-4 mx-2 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
                >
                  <div className="flex items-center justify-between text-white">
                    <svg height="20" width="20">
                      <circle cx="10" cy="10" r="10" fill={btGreen ? "green" : "red"} />
                    </svg>
                    <div className="flex flex-col items-center mx-2">
                      <h2 className={`text-xl font-semibold`}>
                        Bluetooth{' '}
                      </h2>
                      {/* <div className="flex flex-col items-center">
                        <div className='text-xs opacity-50'>Click to scan</div>
                      </div> */}
                      <div>
                        {
                          sterzoDevice != "" ? <div className="text-xs opacity-50 text-green-300">STEERING</div> : <div className="text-xs opacity-50 text-red-300">NO STEERING</div>
                        }
                        {
                          powerDevice != "" ? <div className="text-xs opacity-50 text-green-300">TRAINER</div> : <div className="text-xs opacity-50 text-red-300">NO TRAINER</div>
                        }
                      </div>
                    </div>
                  </div>
                </button>

              <div className="group rounded-lg border border-neutral-800 hover:border-neutral-800 bg-neutral-0 my-4 mx-2 hover:border-gray-300">
                <button disabled={!awaitingGameStart} onClick={handleStartGame} className="w-48 rounded-lg border border-neutral-800 hover:border-green-500 hover:border-green-800 hover:bg-green-900/20 px-1 py-3 mx-2 my-2 rounded">
                  <div className="text-green-600 font-bold ">
                    Start
                  </div>
                  <div className="text-xs text-white opacity-50">New game</div>
                </button>
                <button onClick={handleFinishGame} className="w-48 rounded-lg border border-neutral-800 hover:border-red-500 hover:border-red-800 hover:bg-red-900/20 px-1 py-3 mx-2 my-2 rounded">
                  <div className="text-red-600 font-bold">
                    Finish
                  </div>
                  <div className="text-xs text-white opacity-50">Download GPX and screenshot</div>
                </button>
              </div>

              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-screen backdrop-blur-sm bg-black/20">
            {/* Center the footer button/controls */}
            <div className="flex flex-col items-center">
              <div className="pt-0 gap-2 grid w-full lg:mb-0 grid-cols-4 gap-2 m-2 p-2">
                <button 
                    onClick={changeCamera}
                    className="group rounded-lg border border-neutral-800 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30 p-2"
                >
                  <div className="text-md text-white">Change Camera</div>
                </button>

                <div className="group rounded-lg border border-neutral-800 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30 text-white p-2">
                    <SliderNumerical onSliderChange={handleSliderChange} label="Road Gradient Offset" units="%" />
                </div>

                <button onClick={saveFrame} className="group rounded-lg border border-neutral-800 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30 p-2">
                  <div className="text-md font-medium text-white">Take Screenshot</div>
                  {savedCarlaFrame == "" ? <div className="text-xs opacity-50 text-white">No screenshot - will use first frame for ride picture.</div>: <div className="text-xs opacity-50 text-white">Screenshot saved!</div>}
                </button>
                
                <div className="group rounded-lg border border-neutral-800 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30 text-white p-2 w-full">
                    <DropdownMenu availableMaps={availableMaps} onSelectMap={handleSelectMap} selectedMap={selectedMap} />
                    {/* <div className="text-xs text-center opacity-50">Restart game to load map</div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}