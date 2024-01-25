import { useState } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function SliderNumerical({ onSliderChange, label, units}) {
    const [value, setValue] = useState(0); // Default value
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
      onSliderChange(newValue); // Calling the callback function with the new value
    };
  
    return (
      <Box width={300}>
        <Typography id="input-slider" gutterBottom>
          {label}: {value} {units}
        </Typography>
        <Slider
          value={typeof value === 'number' ? value : 0}
          onChange={handleChange}
          aria-labelledby="input-slider"
          min={-10} // Minimum value of the slider
          max={20} // Maximum value of the slider
        />
      </Box>
    );
  }