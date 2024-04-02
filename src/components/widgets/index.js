import loadable from '@loadable/component';

/*--------------------------------
--- BOUNDLE VoltoFeedbackView ---
---------------------------------*/
export const HoneypotWidget = loadable(() =>
  import(
    /* webpackChunkName: "VoltoFeedbackView" */ './HoneypotWidget/HoneypotWidget'
  ),
);
export const GoogleReCaptchaWidget = loadable(() =>
  import(/* webpackChunkName: "VoltoFeedbackView" */ './GoogleReCaptchaWidget'),
);
