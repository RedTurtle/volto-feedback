import React, { useState } from 'react';
import { TextArea, Form } from 'semantic-ui-react';
import { defineMessages } from 'react-intl';
import { FormHeader } from 'volto-feedback/components';

const messages = defineMessages({
  suggestions_placeholder: {
    id: 'feedback_form_suggestions_placeholder',
    defaultMessage:
      'Explain us why, and help us improve the quality of the site',
  },

  header_comments: {
    id: 'feedback_comments_header',
    defaultMessage: 'Do you want to add some more details?',
  },
});

const CommentsStep = ({
  updateFormData,
  userFeedback,
  step,
  totalSteps,
  getFormFieldValue,
  intl,
}) => {
  const handleChange = (e, { value }) => {
    updateFormData('comment', value);
  };
  return (
    <div className="comments-step">
      <FormHeader
        title={intl.formatMessage(messages.header_comments)}
        step={step + 1}
        totalSteps={totalSteps}
        className="comments-header"
      />
      <div className="comment">
        <Form>
          <TextArea
            placeholder={intl.formatMessage(messages.suggestions_placeholder)}
            onChange={handleChange}
            value={getFormFieldValue('comment')}
          />
        </Form>
      </div>
    </div>
  );
};

export default CommentsStep;
