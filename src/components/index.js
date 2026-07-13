import loadable from '@loadable/component';

/*
 * FormHeader is a tiny, always-needed component (a div + span). Lazy-loading
 * it via @loadable/component caused a guaranteed hydration mismatch: unlike
 * properly-registered loadables (see config.settings.loadables in index.js),
 * this bare `loadable()` call isn't tracked by Volto's own SSR chunk
 * extraction, so the server rendered it immediately while the client's first
 * hydration pass rendered nothing until its chunk finished loading. Import it
 * directly instead - there's no benefit to code-splitting something this small.
 */
export { default as FormHeader } from './FeedbackForm/Steps/Commons/FormHeader';

/*--------------------------------
--- BUNDLE VoltoFeedbackView ---
---------------------------------*/
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
