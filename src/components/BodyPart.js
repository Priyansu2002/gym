import React from 'react';
import { Stack, Typography } from '@mui/material';
import Icon from '../assets/icons/gym.png';

const BodyPart = ({ item, setBodyPart, bodyPart }) => (
  <Stack
  type="button"
alignItems="center"
justifyContent="center"
className="bodyPart-card"
background-color="#FFC0CB"
border="1px solid black"
borderTop= '4px solid #FF2625'


  sx={bodyPart === item ? { border:"1px solid black", background: '#FFECF2', borderBottomLeftRadius: '20px', width: '270px', height: '282px', cursor: 'pointer', gap: '47px' } : { background: '#fff', borderBottomLeftRadius: '20px', width: '270px', height: '282px', cursor: 'pointer', gap: '47px' }}
  onClick={() => {
    setBodyPart(item);
    window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });

  
    }}
  >
    <img src={Icon} alt="dumbbell" style={{ width: '90px', height: '90px' }} />
    <Typography fontSize="24px" fontWeight="bold" fontFamily="Alegreya" color="#3A1212" textTransform="capitalize" > {item}</Typography>
  </Stack>
);

export default BodyPart;