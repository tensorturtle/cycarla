import { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

export function SliderNumerical({ onSliderChange, label, units}) {
    const [value, setValue] = useState(0); // Default value
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
      onSliderChange(newValue); // Calling the callback function with the new value
    };
  
    return (
      <Box>
        <div className="flex flex-col items-center">
          <div className="text-sm">{label}</div>
          <div className="flex flex-row w-full gap-2">
          <tt className="text-lg">{value}{units}</tt>
  
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleChange}
            aria-labelledby="input-slider"
            min={-10} // Minimum value of the slider
            max={10} // Maximum value of the slider
          />
          </div>
        </div>
      </Box>
    );
  }