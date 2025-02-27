import config from '@plone/volto/registry';
import { defineMessages } from 'react-intl';
import memoize from 'lodash/memoize';
import { isCmsUi } from '@plone/volto/helpers';

export const FEEDBACK_THRESHOLD = 3.5;
export const NEGATIVE_FEEDBACK_QUESTIONS = [
  'unclear_instructions',
  'incomplete_instructions',
  'unclear_proceeding',
  'technical_problems',
  'other_negative',
];
export const POSITIVE_FEEDBACK_QUESTIONS = [
  'clear_instructions',
  'complete_instructions',
  'clear_proceeding',
  'no_technical_problems',
  'other_positive',
];

export const FEEDBACK_MESSAGES = defineMessages({
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
  return config.settings['volto-feedback'].formSteps ?? [];
};

export const getFeedbackFormByStep = (step) => {
  const configuredSteps = getFeedbackFormSteps();
  return configuredSteps.find((cs) => cs.step === step)?.pane ?? null;
};

export const getFeedbackQuestions = (
  threshold,
  overrideThreshold = false,
  newThreshold = null,
) => {
  let actualThreshold = threshold;
  if (overrideThreshold && newThreshold) actualThreshold = newThreshold;
  const tresholdValue = getFeedbackThreshold();
  if (actualThreshold < tresholdValue)
    return config.settings['volto-feedback'].questions.negativeFeedback;
  else return config.settings['volto-feedback'].questions.positiveFeedback;
};
export const getFeedbackThreshold = () => {
  return config.settings['volto-feedback'].feedbackThreshold;
};
export const getTranslatedQuestion = (intl, question_id) => {
  if (!intl) throw new Error('No intl provided');
  if (!question_id) return null;
  try {
    return intl.formatMessage(
      config.settings['volto-feedback'].questions.messages[question_id],
    );
  } catch (e) {
    throw new Error(
      `Cannot translate ${question_id}, no linked translation exists for given parameter`,
    );
  }
};

export const getQuestionIndex = (question_id) => {
  const allQuestions = config.settings[
    'volto-feedback'
  ].questions.negativeFeedback.concat(
    config.settings['volto-feedback'].questions.positiveFeedback,
  );
  return allQuestions.findIndex((q) => q.id === question_id);
};

export const getNumberOfSteps = () => {
  return getFeedbackFormSteps()?.length;
};

export const generateFeedbackCommentUUID = (date) => {
  // Create key uuid from date, it's unique enough for our case.
  // We can't use provided uid in response because it's the
  // uid of the content that was rated due to how Soup and
  // the backend addon work.
  return new Date(date).getTime().toString(36);
};

export const getFeedbackEnabledNonContentRoutes = () =>
  config.settings['volto-feedback'].feedbackEnabledNonContentRoutes;

export const getFeedbackEnabledNonContentRoutesPathList = () =>
  config.settings['volto-feedback'].feedbackEnabledNonContentRoutes?.map(
    (r) => r.path,
  );

const normalizePath = (path) => path?.replace(/\?.*$/, '');

export const isFeedbackEnabledForRoute = memoize((path) => {
  if (!isCmsUi(path)) return true;
  const feedbackEnabledPaths = getFeedbackEnabledNonContentRoutesPathList();
  return feedbackEnabledPaths.some((route) => {
    const fullPath = normalizePath(path);
    return (
      feedbackEnabledPaths.includes(route) && new RegExp(route).test(fullPath)
    );
  });
});

export const getStaticFeedbackRouteTitle = memoize((path) => {
  const feedbackEnabledPaths = getFeedbackEnabledNonContentRoutes();
  const feedbackEnabledPathsList = getFeedbackEnabledNonContentRoutesPathList();
  return (
    feedbackEnabledPaths.find(
      (route) =>
        feedbackEnabledPathsList.includes(route.path) &&
        new RegExp(route.path).test(normalizePath(path)),
    )?.feedbackTitle || path
  );
});
