import {
  getFeedbackQuestions,
  getFeedbackTreshold,
} from 'volto-feedback/helpers';
import React, { useState, useEffect, useMemo } from 'react';
import { usePrevious } from '@plone/volto/helpers';
import { Form, Segment } from 'semantic-ui-react';
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
  const treshold = useMemo(() => getFeedbackTreshold(), []);
  const getInitialState = () => {
    if (userFeedback === null) return {};
    const questions = getFeedbackQuestions(userFeedback);
    return questions?.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: false,
      }),
      {},
    );
  };
  const [state, setState] = useState(getInitialState());
  const prevFeedback = usePrevious(userFeedback);
  useEffect(() => {
    if (userFeedback !== null) {
      if (
        (prevFeedback &&
          prevFeedback <= treshold &&
          userFeedback >= treshold) ||
        (prevFeedback && prevFeedback >= treshold && userFeedback <= treshold)
      ) {
        updateFormData('answer', null);
      }
      if (prevFeedback !== userFeedback) initializeState(getInitialState());
    }
  }, [userFeedback]);

  const handleAnswerChange = (e, { value }) => {
    const newState = Object.keys(state).reduce((acc, curr) => {
      if (curr === value) return { ...acc, [curr]: true };
      else return { ...acc, [curr]: false };
    }, {});
    updateFormData('answer', value);
    setState(newState);
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
          userFeedback > treshold
            ? intl.formatMessage(messages.header_positive)
            : intl.formatMessage(messages.header_negative)
        }
        step={step + 1}
        totalSteps={totalSteps}
        className={'answers-header'}
      />
      <Form className="answers-form">
        <Form.Group widths={16}>
          {Object.keys(state)?.map((s) => (
            <Form.Checkbox
              label={getTranslatedQuestion(intl, s)}
              value={s}
              checked={getFormFieldValue('answer') === s}
              onChange={handleAnswerChange}
            />
          ))}
        </Form.Group>
      </Form>
    </div>
  );
};

export default AnswersStep;
