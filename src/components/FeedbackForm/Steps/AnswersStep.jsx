import {
  getFeedbackQuestions,
  getFeedbackThreshold,
} from 'volto-feedback/helpers';
import React, { useState, useEffect, useMemo } from 'react';
import { usePrevious } from '@plone/volto/helpers/Utils/usePrevious';
import { Form } from 'semantic-ui-react';
import { getTranslatedQuestion } from 'volto-feedback';
import { defineMessages } from 'react-intl';
import { FormHeader } from 'volto-feedback/components';

const messages = defineMessages({
  header_positive: {
    id: 'feedback_answers_header_positive',
    defaultMessage: 'Which were the aspects you liked the most?',
  },
  header_negative: {
    id: 'feedback_answers_header_negative',
    defaultMessage: 'Where did you encounter the biggest problems?',
  },
});

const AnswersStep = ({
  updateFormData,
  userFeedback,
  step,
  totalSteps,
  getFormFieldValue,
  intl,
}) => {
  const initializeState = (newState) => setState(newState);
  const threshold = useMemo(() => getFeedbackThreshold(), []);
  const selectedAnswer = getFormFieldValue('answer');
  const getInitialState = () => {
    if (userFeedback === null) return [];
    return getFeedbackQuestions(userFeedback);
  };
  const [state, setState] = useState(getInitialState());
  const prevFeedback = usePrevious(userFeedback);
  useEffect(() => {
    if (userFeedback !== null) {
      if (
        (prevFeedback &&
          prevFeedback <= threshold &&
          userFeedback >= threshold) ||
        (prevFeedback && prevFeedback >= threshold && userFeedback <= threshold)
      ) {
        updateFormData('answer', null);
      }
      if (prevFeedback !== userFeedback) initializeState(getInitialState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFeedback]);

  const handleAnswerChange = (e, { value }) => {
    updateFormData('answer', value);
  };
  return (
    <div
      id="vf-more"
      className="answers-step"
      aria-expanded={userFeedback !== null}
      aria-hidden={userFeedback === null}
    >
      <FormHeader
        title={
          userFeedback > threshold
            ? intl.formatMessage(messages.header_positive)
            : intl.formatMessage(messages.header_negative)
        }
        step={step + 1}
        totalSteps={totalSteps}
        className={'answers-header'}
      />
      <Form className="answers-form">
        <Form.Group widths={16}>
          {state?.map((s) => (
            <Form.Radio
              label={getTranslatedQuestion(intl, s)}
              value={s}
              checked={selectedAnswer === s}
              onChange={handleAnswerChange}
            />
          ))}
        </Form.Group>
      </Form>
    </div>
  );
};

export default AnswersStep;
