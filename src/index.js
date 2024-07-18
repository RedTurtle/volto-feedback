import loadable from '@loadable/component';
import { VFToolbar, VFPanel } from 'volto-feedback/components/manage';
import {
  submitFeedback,
  exportCsvFeedbackData,
  deleteAllFeedbacks,
  getFeedback,
  getFeedbacks,
  deleteFeedback,
  updateFeedback,
} from 'volto-feedback/reducers';
import { CommentsStep, AnswersStep } from 'volto-feedback/components';
import {
  NEGATIVE_FEEDBACK_QUESTIONS,
  POSITIVE_FEEDBACK_QUESTIONS,
  FEEDBACK_THRESHOLD,
  FEEDBACK_MESSAGES,
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
  updateFeedback,
} from 'volto-feedback/actions';
export {
  getFeedbackFormSteps,
  getFeedbackFormByStep,
  getFeedbackQuestions,
  getFeedbackThreshold,
  getTranslatedQuestion,
  generateFeedbackCommentUUID,
  getNumberOfSteps,
} from 'volto-feedback/helpers';

export {
  GoogleReCaptchaWidget,
  HoneypotWidget,
} from 'volto-feedback/components/widgets';
export {
  AnswersStep,
  CommentsStep,
  FeedbackForm,
  FormHeader,
} from 'volto-feedback/components';
export {
  VFPanel,
  VFToolbar,
  VFPanelMenu,
  FeedbackComments,
} from 'volto-feedback/components/manage';

export default function applyConfig(config) {
  config.settings.loadables['GoogleReCaptcha'] = loadable(
    () => import('react-google-recaptcha-v3'),
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
    updateFeedback,
  };

  config.settings['volto-feedback'] = {
    feedbackThreshold: FEEDBACK_THRESHOLD,
    questions: {
      negativeFeedback: NEGATIVE_FEEDBACK_QUESTIONS,
      positiveFeedback: POSITIVE_FEEDBACK_QUESTIONS,
      messages: FEEDBACK_MESSAGES,
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
