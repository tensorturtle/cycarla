export function SteeringVisualizer({ steeringAngle }) {
    // rotate an image based on the steering angle
    // 0 degrees is straight ahead, positive is right, negative is left
    const rotate = `rotate(${steeringAngle}deg)`;
  
    return (
      <div className="relative w-24 h-24">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: rotate }}
        >
        <img
          className="absolute top-0 left-0 w-full h-full object-contain"
          src="/handlebar.png"
          alt="Handlebar"
        />

        </div>
      </div>
    );
  }