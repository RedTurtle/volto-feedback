import loadable from '@loadable/component';

/*--------------------------------
--- BUNDLE VoltoFeedbackView ---
---------------------------------*/
export const FormHeader = loadable(() =>
  import(
    /* webpackChunkName: "VoltoFeedbackView" */ './FeedbackForm/Steps/Commons/FormHeader'
  ),
);
export const FeedbackForm = loadable(() =>
  import(
    /* webpackChunkName: "VoltoFeedbackView" */ './FeedbackForm/FeedbackForm'
  ),
);
export const AnswersStep = loadable(() =>
  import(
    /* webpackChunkName: "VoltoFeedbackView" */ './FeedbackForm/Steps/AnswersStep'
  ),
);
export const CommentsStep = loadable(() =>
  import(
    /* webpackChunkName: "VoltoFeedbackView" */ './FeedbackForm/Steps/CommentsStep'
  ),
);
