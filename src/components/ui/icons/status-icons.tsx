
import React from "react"

export const CustomCheckIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_303_5348)">
      <path d="M9.19999 0.449982L4.09999 5.54998L0.799988 2.23798" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_303_5348">
        <rect width="9" height="5.7" fill="white" transform="translate(0.5 0.149994)"/>
      </clipPath>
    </defs>
  </svg>
)

export const CustomXIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.25911 0.740906L0.740906 9.25911" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M0.740906 0.740906L9.25911 9.25911" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
)

export const CustomAlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_303_6884)">
      <path d="M6 2.41464V0.878052" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
      <path d="M1.90243 6.51221H0.365845" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
      <path d="M11.6341 6.51221H10.0975" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
      <path d="M3.10246 3.61463L2.01953 2.53171" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
      <path d="M9.98051 2.53171L8.89758 3.61463" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round"/>
      <path d="M3.43903 11.122V6.67318C3.43903 5.1805 4.59512 3.95123 6 3.95123C7.40488 3.95123 8.56098 5.1805 8.56098 6.67318V11.122H3.43903Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 11.122V8.0488" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.99998 9.07318C6.56573 9.07318 7.02437 8.61454 7.02437 8.04879C7.02437 7.48303 6.56573 7.0244 5.99998 7.0244C5.43422 7.0244 4.97559 7.48303 4.97559 8.04879C4.97559 8.61454 5.43422 9.07318 5.99998 9.07318Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10"/>
    </g>
    <defs>
      <clipPath id="clip0_303_6884">
        <rect width="12" height="10.9756" fill="white" transform="translate(0 0.512207)"/>
      </clipPath>
    </defs>
  </svg>
)

export const CustomStatusIcon = () => (
  <svg width="12" height="11.65" viewBox="0 0 12 11.65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect className="status-yellow" x="0" y="4.3" width="12" height="3"/>
    <rect className="status-purple" x="0" y="0" width="12" height="3"/>
    <rect className="status-green" x="0" y="8.65" width="12" height="3"/>
  </svg>
)

export const CustomUrgentIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.58552 0.354506L0.740401 6.92926C0.63297 7.06892 0.740401 7.27304 0.91229 7.27304H4.67236C4.81202 7.27304 4.90871 7.40195 4.88722 7.53087L4.03852 11.4628C3.98481 11.6884 4.28561 11.8174 4.42527 11.6347L9.27039 5.05997C9.37782 4.92031 9.27039 4.71619 9.0985 4.71619H5.33843C5.19877 4.71619 5.10208 4.58727 5.12357 4.45836L5.97227 0.526395C6.02599 0.300791 5.72518 0.171874 5.58552 0.354506Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ToastSuccessIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="m14.37,8.16c-.19-.2-.5-.21-.71-.02l-3.93,3.68-2.38-2.23c-.2-.19-.52-.18-.71.02-.19.2-.18.52.02.71l2.73,2.55s.07.04.1.06c.02.01.03.03.05.03.06.02.12.04.19.04s.13-.01.19-.04c.02,0,.03-.02.05-.03.03-.02.07-.03.1-.06l4.27-4c.2-.19.21-.51.02-.71Z"
      className="cls-1" 
      fill="currentColor" 
      strokeWidth="0px"
    />
    <path 
      d="m13.31,21l-2.81-1.44-2.81,1.44-1.72-2.66-3.16-.16-.16-3.16-2.66-1.72,1.44-2.81-1.44-2.81,2.66-1.72.16-3.16,3.16-.16,1.72-2.66,2.81,1.44,2.81-1.44,1.72,2.66,3.16.16.16,3.16,2.66,1.72-1.44,2.81,1.44,2.81-2.66,1.72-.16,3.16-3.16.16-1.72,2.66Zm-2.81-2.55l2.47,1.26,1.51-2.33,2.77-.14.14-2.77,2.33-1.51-1.26-2.47,1.26-2.47-2.33-1.51-.14-2.77-2.77-.14-1.51-2.33-2.47,1.26-2.47-1.26-1.51,2.33-2.77.14-.14,2.77-2.33,1.51,1.26,2.47-1.26,2.47,2.33,1.51.14,2.77,2.77.14,1.51,2.33,2.47-1.26Z"
      className="cls-1" 
      fill="currentColor" 
      strokeWidth="0px"
    />
  </svg>
);

export const ToastErrorIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="m14.85,21H6.15L0,14.85V6.15L6.15,0h8.7l6.15,6.15v8.7l-6.15,6.15Zm-8.28-1h7.87l5.56-5.56v-7.87L14.44,1h-7.87L1,6.56v7.87l5.56,5.56Z"
      className="cls-1" 
      fill="currentColor" 
      strokeWidth="0px"
    />
    <path 
      d="m11.21,10.5l3.15-3.15c.2-.2.2-.51,0-.71s-.51-.2-.71,0l-3.15,3.15-3.15-3.15c-.2-.2-.51-.2-.71,0s-.2.51,0,.71l3.15,3.15-3.15,3.15c-.2.2-.2.51,0,.71.1.1.23.15.35.15s.26-.05.35-.15l3.15-3.15,3.15,3.15c.1.1.23.15.35.15s.26-.05.35-.15c.2-.2.2-.51,0-.71l-3.15-3.15Z"
      className="cls-1" 
      fill="currentColor" 
      strokeWidth="0px"
    />
  </svg>
);
