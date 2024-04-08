import React, { useState } from 'react';
import { TextArea, Form } from 'semantic-ui-react';
import { defineMessages } from 'react-intl';

const FormHeader = ({ title, step, totalSteps, className }) => {
  return (
    <div className={className}>
      <h6>{title}</h6>
      <div>{`${step}/${totalSteps}`}</div>
    </div>
  );
};

export default FormHeader;
