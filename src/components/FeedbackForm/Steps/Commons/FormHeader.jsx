import React from 'react';

import './formHeader.css';

const FormHeader = ({ title, step, totalSteps, className }) => {
  return (
    <div className={className}>
      <legend>{title}</legend>
      <span>{`${step}/${totalSteps}`}</span>
    </div>
  );
};

export default FormHeader;
