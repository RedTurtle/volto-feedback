import config from '@plone/volto/registry';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  unclear_instructions: {
    id: 'feedback_unclear_instructions',
    defaultMessage: 'Some instructions were not clear and confusing',
  },
  incomplete_instructions: {
    id: 'feedback_incomplete_instructions',
    defaultMessage: 'Some instructions were incomplete',
  },
  unclear_proceeding: {
    id: 'feedback_unclear_proceeding',
    defaultMessage:
      "Sometimes I couldn't understand if I was proceeding correctly",
  },
  technical_problems: {
    id: 'feedback_technical_problems',
    defaultMessage: 'I ran into technical problems',
  },
  other_negative: {
    id: 'feedback_other_negative',
    defaultMessage: 'Other',
  },
  clear_instructions: {
    id: 'feedback_clear_instructions',
    defaultMessage: 'The instructions were clear',
  },
  complete_instructions: {
    id: 'feedback_complete_instructions',
    defaultMessage: 'The instructions were complete',
  },
  clear_proceeding: {
    id: 'feedback_clear_proceeding',
    defaultMessage: 'I always understood that I was proceeding correctly',
  },
  no_technical_problems: {
    id: 'feedback_no_technical_problems',
    defaultMessage: 'I had no technical problems',
  },
  other_positive: {
    id: 'feedback_other_positive',
    defaultMessage: 'Other',
  },
});

export const getFeedbackFormSteps = () => {
  return config.settings['volto-feedback'].formSteps;
};

export const getFeedbackFormByStep = (step) => {
  const configuredSteps = getFeedbackFormSteps();
  return configuredSteps.find((cs) => cs.step === step)?.pane;
};

export const getFeedbackQuestions = (
  treshold,
  overrideTreshold = false,
  newTreshold = null,
) => {
  let actualTreshold = treshold;
  if (overrideTreshold && newTreshold) actualTreshold = newTreshold;
  const tresholdValue = getFeedbackTreshold();
  if (actualTreshold < tresholdValue)
    return config.settings['volto-feedback'].questions.negativeFeedback;
  else return config.settings['volto-feedback'].questions.positiveFeedback;
};
export const getFeedbackTreshold = () => {
  return config.settings['volto-feedback'].feedbackTreshold;
};
export const getTranslatedQuestion = (intl, question_id) => {
  if (!intl) throw new Error('No intl provided');
  try {
    return intl.formatMessage(messages[question_id]);
  } catch (e) {
    throw new Error(
      `Cannot translate ${question_id}, no linked translation exists for given parameter`,
    );
  }
};

export const getQuestionIndex = (question_id) => {
  const allQuestions = NEGATIVE_FEEDBACK_QUESTIONS.concat(
    POSITIVE_FEEDBACK_QUESTIONS,
  );
  return allQuestions.find((q) => q.id === question_id)?.index;
};

export const getNumberOfSteps = () => {
  return getFeedbackFormSteps()?.length;
};

export const NEGATIVE_FEEDBACK_QUESTIONS = [
  { id: 'unclear_instructions', index: 0 },
  { id: 'incomplete_instructions', index: 1 },
  { id: 'unclear_proceeding', index: 2 },
  { id: 'technical_problems', index: 3 },
  { id: 'other_negative', index: 4 },
];
export const POSITIVE_FEEDBACK_QUESTIONS = [
  { id: 'clear_instructions', index: 5 },
  { id: 'complete_instructions', index: 6 },
  { id: 'clear_proceeding', index: 7 },
  { id: 'no_technical_problems', index: 8 },
  { id: 'other_positive', index: 9 },
];
export const FEEDBACK_TRESHOLD = 3.5;
