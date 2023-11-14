import Image from 'next/image'

export function SteeringVisualizer({ steeringAngle }) {
    // rotate an image based on the steering angle
    // 0 degrees is straight ahead, positive is right, negative is left
    const rotate = `rotate(${steeringAngle}deg)`;
  
    return (
      <div className="relative w-48 h-48">
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