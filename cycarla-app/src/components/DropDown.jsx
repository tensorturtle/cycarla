import React, { useState } from 'react';

const DropdownMenu = ({ availableMaps, onSelectMap, selectedMap }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleMapClick = (map) => {
    onSelectMap(map); // Call the function passed from the parent component
    setIsOpen(false); // Optionally close the dropdown after selection
  };

  return (
    <div className="relative inline-block w-full">
      <button onClick={toggleDropdown} className="w-full group rounded-lg border border-neutral-800 transition-colors hover:border-gray-300 hover:bg-gray-100/30 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      <div className="flex flex-col items-center">
        <div className="text-md font-medium flex items-center justify-between p-2">
            <div className="flex flex-col items-center">
                <p>Selected Map</p>
                <tt>{selectedMap}</tt>
            </div>
          <svg className="ml-2 h-4" fill="none" stroke="currentColor"z viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {availableMaps.map((map, index) => (
              <button key={index} onClick={() => handleMapClick(map)} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:dark:bg-neutral-800/30">
                {map}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
