import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Grid } from 'semantic-ui-react';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

const GoogleReCaptchaWidget = ({ onVerify, GoogleReCaptcha, action }) => {
  const intl = useIntl();
  const {
    GoogleReCaptcha: ReCaptcha,
    GoogleReCaptchaProvider,
  } = GoogleReCaptcha;

  // reCAPTCHA needs `window`/`document` to inject Google's script, so it
  // can't render during SSR. Branching on `__CLIENT__` directly in the
  // render output made the server render nothing while the client's first
  // hydration pass rendered the whole provider/grid/recaptcha subtree,
  // causing a guaranteed hydration mismatch on every page load. Instead,
  // render nothing on both the server AND the client's first render, and
  // only mount the widget after hydration completes (via this effect).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <GoogleReCaptchaProvider
      reCaptchaKey={
        process.env.RAZZLE_RECAPTCHA_KEY ?? window.env.RAZZLE_RECAPTCHA_KEY
      }
      language={intl.locale ?? 'en'}
    >
      <Grid.Row centered className="row-padded-top">
        <Grid.Column textAlign="center">
          <ReCaptcha onVerify={onVerify} action={action} />
        </Grid.Column>
      </Grid.Row>
    </GoogleReCaptchaProvider>
  ) : (
    <></>
  );
};

export default injectLazyLibs(['GoogleReCaptcha'])(GoogleReCaptchaWidget);
