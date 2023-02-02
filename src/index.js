import loadable from '@loadable/component';
import { VFToolbar, VFPanel } from 'volto-feedback/components/manage';
import {
  submitFeedback,
  exportCsvFeedbackData,
  deleteAllFeedbacks,
  getFeedback,
  getFeedbacks,
  deleteFeedback,
} from 'volto-feedback/reducers';
import CommentsStep from 'volto-feedback/components/FeedbackForm/Steps/CommentsStep';
import AnswersStep from 'volto-feedback/components/FeedbackForm/Steps/AnswersStep';
import {
  NEGATIVE_FEEDBACK_QUESTIONS,
  POSITIVE_FEEDBACK_QUESTIONS,
  FEEDBACK_TRESHOLD,
} from 'volto-feedback/helpers';

export {
  submitFeedback,
  exportCsvFeedbackData,
  deleteAllFeedbacks,
  getFeedback,
  getFeedbacks,
  deleteFeedback,
  resetSubmitFeedback,
  resetDeleteFeedback,
} from 'volto-feedback/actions';
export {
  getFeedbackFormSteps,
  getFeedbackFormByStep,
  getFeedbackQuestions,
  getFeedbackTreshold,
  getTranslatedQuestion,
} from 'volto-feedback/helpers';
export { default as GoogleReCaptchaWidget } from 'volto-feedback/components/widgets/GoogleReCaptchaWidget';
export { default as HoneypotWidget } from 'volto-feedback/components/widgets/HoneypotWidget/HoneypotWidget';
export { default as Feedback } from 'volto-feedback/components/Feedback/Feedback';
export AnswersSteps from 'volto-feedback/components/FeedbackForm/Steps/AnswersStep';
export CommentsStep from 'volto-feedback/components/FeedbackForm/Steps/CommentsStep';
export FeedbackForm from 'volto-feedback/components/FeedbackForm/FeedbackForm';

export default function applyConfig(config) {
  config.settings.loadables['GoogleReCaptcha'] = loadable(() =>
    import('react-google-recaptcha-v3'),
  );

  config.settings.nonContentRoutes = [
    ...config.settings.nonContentRoutes,
    '/feedback-panel',
  ];

  config.addonReducers = {
    ...config.addonReducers,
    submitFeedback,
    exportCsvFeedbackData,
    deleteAllFeedbacks,
    getFeedback,
    getFeedbacks,
    deleteFeedback,
  };

  config.settings['volto-feedback'] = {
    feedbackTreshold: FEEDBACK_TRESHOLD,
    questions: {
      negativeFeedback: NEGATIVE_FEEDBACK_QUESTIONS,
      positiveFeedback: POSITIVE_FEEDBACK_QUESTIONS,
    },

    formSteps: [
      {
        step: 0,
        pane: AnswersStep,
      },
      {
        step: 1,
        pane: CommentsStep,
      },
    ],
  };

  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '',
      component: VFToolbar,
    },
  ];

  // config.addonRoutes.push({
  //   path: '/customer-satisfaction-panel',
  //   component: CSPanel,
  // });

  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/feedback-panel',
      component: VFPanel,
    },
  ];

  return config;
}
