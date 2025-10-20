
import React from 'react';

// Simplified logos for demonstration purposes

export const ItauLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="100" height="100" rx="12" fill="#EC7000"/>
    <path d="M25 35H40V65H25V35Z" fill="white"/>
    <path d="M45 35H60V65H45V35Z" fill="#0056A0"/>
    <path d="M65 35H80V65H65V35Z" fill="white"/>
    <rect x="45" y="47.5" width="15" height="5" fill="#EC7000"/>
  </svg>
);

export const NubankLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="100" height="100" rx="12" fill="#820AD1"/>
    <path d="M25 65V35H35L50 50L65 35H75V65H65L50 50L35 65H25Z" fill="white"/>
  </svg>
);

export const BradescoLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="100" height="100" rx="12" fill="#CC092F"/>
    <path d="M50 25L25 37.5V62.5L50 75L75 62.5V37.5L50 25Z" fill="white"/>
    <path d="M50 35L35 43.5V56.5L50 65L65 56.5V43.5L50 35Z" stroke="#CC092F" strokeWidth="5"/>
  </svg>
);

export const SantanderLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="100" height="100" rx="12" fill="#EA0000"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M50 30C38.9543 30 30 38.9543 30 50C30 61.0457 38.9543 70 50 70C61.0457 70 70 61.0457 70 50C70 38.9543 61.0457 30 50 30ZM40 50C40 44.4772 44.4772 40 50 40C55.5228 40 60 44.4772 60 50C60 55.5228 55.5228 60 50 60C44.4772 60 40 55.5228 40 50Z" fill="white"/>
  </svg>
);

export const InterLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="100" height="100" rx="12" fill="#FF7A00"/>
    <rect x="25" y="30" width="15" height="40" fill="white"/>
    <rect x="42.5" y="30" width="15" height="40" fill="white"/>
    <rect x="60" y="30" width="15" height="40" fill="white"/>
  </svg>
);

export const BbLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="100" height="100" rx="12" fill="#00539F"/>
    <rect x="20" y="20" width="60" height="60" fill="#FDB913"/>
    <path d="M35 35H45V65H35V35Z" fill="#00539F"/>
    <path d="M55 35H65V65H55V35Z" fill="#00539F"/>
  </svg>
);
