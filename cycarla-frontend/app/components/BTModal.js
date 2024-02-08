const BTModal = ({ isOpen, onClose }) => {
    // This modal provides bluetooth connection instructions
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-800 p-8 rounded-lg w-11/12 md:w-1/2">
            <div className="text-xl font-bold mb-4">How to connect Bluetooth Cycling Accessories</div>
            <ul className="list-disc list-inside">
            <li>You need a Elite Sterzo and FTMS-compatible Bluetooth Indoor Trainer</li>
            </ul>
            <button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 mt-8 mb-4 rounded">Got it!</button>
          </div>
        </div>
    );
  }

export default BTModal;