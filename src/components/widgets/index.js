import loadable from '@loadable/component';

/*
 * HoneypotWidget is imported directly, not lazy-loaded: with a honeypot field
 * configured (RAZZLE_HONEYPOT_FIELD) the server renders its <div> right away,
 * while a bare loadable() renders nothing on the client until its chunk is
 * loaded (it isn't tracked by Volto's SSR chunk extraction), so hydration
 * mismatches on every page with the feedback form. Same fix as FormHeader.
 */
export { default as HoneypotWidget } from './HoneypotWidget/HoneypotWidget';

/*--------------------------------
--- BOUNDLE VoltoFeedbackView ---
---------------------------------*/
export const GoogleReCaptchaWidget = loadable(() =>
  import(/* webpackChunkName: "VoltoFeedbackView" */ './GoogleReCaptchaWidget'),
);
