// src/components/StadiumIcon.js
import React from 'react';

const StadiumIcon = ({ size = 24, color = '#ff6b35' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V18C21 17.4477 20.5523 17 20 17H4C3.44772 17 3 17.4477 3 18V20Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 13V8C21 5.23858 18.7614 3 16 3H8C5.23858 3 3 5.23858 3 8V13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 13H3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 13V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StadiumIcon;
