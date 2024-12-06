// import { Noto_Sans_Mono } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
// export const noto_sans_mono = Noto_Sans_Mono({
//     subsets: ['latin'],
//     display: 'swap',
//   })

export function roundOrPad(num, digits) {
    // Round to the given number of digits, or pad with zeros to be the given number of digits and return as string.
    // Also add + if positive or zero
    const rounded = num.toFixed(digits);
    const padded = rounded.padStart(digits, "0");

    let result = "";

    if (num >= 0) {
      result = "+" + padded;
    } else {
        result = padded;
    }
    if (result === "+0" || result === "-0") {
        result = "0";
    }
    
    return result;
  }

export function PerformanceLiveStats({ server_fps, simulation_fps }) {
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
  
export function KinematicsLiveStats({ speed, xLocation, yLocation, latGnss, lonGnss, altitude, roadGradient }) {
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
    <div className="flex gap-1">
        <div className="text-sm opacity-50">Road Gradient:</div>
        <div className="text-sm">{roundOrPad(roadGradient, 2)}</div>
    </div>
    </div>
)
}

export function ControlLiveStats({ throttle, steer, brake, reverse, hand_brake, manual, gear }) {
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