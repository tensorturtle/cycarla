const BTModal = ({ isOpen, onClose, socket, btGreen, setBtGreen }) => {
    // This modal shows up when the user first registers
    // and notifies them that they have been given free credits
    if (!isOpen) return null;

    const flipBtGreen = () => {
        setBtGreen(!btGreen)
    }

    const requestBTScan = () => {
        console.log("Requesting BT Scan")
        socket.emit('bt_scan')
    }
  

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-800 p-8 rounded-lg w-11/12 md:w-1/2">
            <svg height="20" width="20">
              <circle cx="10" cy="10" r="10" fill={btGreen ? "green" : "red"} />
            </svg>
            <button onClick={flipBtGreen}>Flip</button>
            <button onClick={requestBTScan}>Request BT Scan</button>
            <div className="text-xl font-bold mb-4">Connect Bluetooth Cycling Accessories</div>
            <ul className="list-disc list-inside">
            <li>You can generate <strong>1 question per credit</strong>.</li>
            <li>PrepGPT creates questions similar to the <strong>Digital SAT Reading & Writing Modules</strong>.</li>
            <li>Generation is a non-deterministic process, so <strong>qualified review is required</strong> before using them for instruction or student evaluation.</li>
            <li>PrepGPT may refuse to generate questions for unsuitable topics.</li>
            <li>Quality of generated questions may vary depending on the topic you choose.</li>
            <li>When you cancel a generation request, you will be refunded the remaining amount excluding already-generated questions.</li>
  
            </ul>
            <button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 mt-8 mb-4 rounded">Ok, let's go!</button>
          </div>
        </div>
    );
  }

export default BTModal;