import React from 'react';

export const FormHeader = ({ title, step, totalSteps, className }) => {
  return (
    <div className={className}>
      <h6>{title}</h6>
      <div>{`${step}/${totalSteps}`}</div>
    </div>
  );
};
