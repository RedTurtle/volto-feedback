/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useIntl, defineMessages } from 'react-intl';
import { Form, Button, TextArea, Loader, Message } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { isCmsUi } from '@plone/volto/helpers';
// import ThumbsUp from '../../icons/thumbs-up-regular.svg';
// import ThumbsDown from '../../icons/thumbs-down-regular.svg';
import GoogleReCaptchaWidget from '../widgets/GoogleReCaptchaWidget';
import HoneypotWidget from '../widgets/HoneypotWidget/HoneypotWidget';
import { submitFeedback, resetSubmitFeedback } from 'volto-feedback/actions';
// import './feedback.css';

const messages = defineMessages({
  title: {
    id: 'feedback_title',
    defaultMessage: 'Was this page useful to you?',
  },
  yes: {
    id: 'feedback_yes',
    defaultMessage: 'Yes',
  },
  no: {
    id: 'feedback_no',
    defaultMessage: 'No',
  },
  suggestions_placeholder: {
    id: 'feedback_suggestions_placeholder',
    defaultMessage:
      'Explain us why, and help us improve the quality of the site',
  },
  submit: {
    id: 'feedback_submit',
    defaultMessage: 'Submit your comment',
  },
  thank_you: {
    id: 'feedback_thank_you',
    defaultMessage: 'Thank you for your feedback!',
  },
});

const Feedback = () => {
  const intl = useIntl();
  const location = useLocation();
  const path = location.pathname ?? '/';
  const dispatch = useDispatch();
  const [satisfaction, setSatisfaction] = useState(null);
  const [formData, setFormData] = useState({});
  const captcha = !!process.env.RAZZLE_RECAPTCHA_KEY ? 'GoogleReCaptcha' : null;
  const submitResults = useSelector((state) => state.submitFeedback);
  const [validToken, setValidToken] = useState(null);
  let fieldHoney = process.env.RAZZLE_HONEYPOT_FIELD;

  if (__CLIENT__) {
    fieldHoney = window.env.RAZZLE_HONEYPOT_FIELD;
  }

  const changeSatisfaction = (e, s) => {
    e.stopPropagation();
    e.preventDefault();

    if (s === satisfaction) {
      setSatisfaction(null);
    } else {
      setSatisfaction(s);
    }
  };

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    setSatisfaction(null);
    setValidToken(null);
    return () => {
      dispatch(resetSubmitFeedback());
    };
  }, [path]);

  useEffect(() => {
    updateFormData(
      'vote',
      satisfaction === true ? 'ok' : satisfaction === false ? 'nok' : null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [satisfaction]);

  // initialized honeypot field
  useEffect(() => {
    updateFormData(fieldHoney, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldHoney]);

  const onVerifyCaptcha = useCallback(
    (token) => {
      if (satisfaction != null && !validToken) {
        setValidToken(token);
      }
    },
    [satisfaction, setValidToken, validToken],
  );

  const sendFormData = () => {
    dispatch(
      submitFeedback(path, {
        ...formData,
        ...(captcha && { 'g-recaptcha-response': validToken }),
      }),
    );
  };

  let action = path?.length > 1 ? path.replace(/\//g, '') : path;
  if (action?.length > 0) {
    action = action?.replace(/-/g, '_');
  } else {
    action = 'homepage';
  }

  if (isCmsUi(path)) {
    return null;
  }

  return (
    <div className="feedback">
      <h2 id="vf-radiogroup-label">{intl.formatMessage(messages.title)}</h2>

      {!submitResults?.loading && !submitResults.loaded && (
        <Form
          onSubmit={() => {
            sendFormData();
          }}
        >
          <div className="buttons" aria-labelledby="vf-radiogroup-label">
            <Button
              animated={
                satisfaction == null || satisfaction !== true ? 'fade' : null
              }
              color="green"
              onClick={(e) => {
                changeSatisfaction(e, true);
              }}
              aria-controls="vf-more"
              active={satisfaction === true}
            >
              <Button.Content hidden>
                {intl.formatMessage(messages.yes)}
              </Button.Content>
              {(satisfaction == null || satisfaction !== true) && (
                <Button.Content visible>
                  {/* <Icon name={ThumbsUp} size="1.5rem" /> */}
                  su
                </Button.Content>
              )}
            </Button>

            <Button
              animated={
                satisfaction == null || satisfaction !== false ? 'fade' : null
              }
              color="red"
              onClick={(e) => {
                changeSatisfaction(e, false);
              }}
              aria-controls="vf-more"
              active={satisfaction === false}
            >
              <Button.Content hidden>
                {intl.formatMessage(messages.no)}
              </Button.Content>
              {(satisfaction == null || satisfaction !== false) && (
                <Button.Content visible>
                  {/* <Icon name={ThumbsDown} size="1.5rem" /> */}
                  giu
                </Button.Content>
              )}
            </Button>
          </div>

          <div
            id="vf-more"
            role="region"
            aria-expanded={satisfaction !== null}
            aria-hidden={satisfaction === null}
          >
            <div className="comment">
              <TextArea
                placeholder={intl.formatMessage(
                  messages.suggestions_placeholder,
                )}
                onChange={(e, v) => {
                  updateFormData('comment', v.value);
                }}
              />
            </div>

            <HoneypotWidget
              updateFormData={updateFormData}
              field={fieldHoney}
            />
            <GoogleReCaptchaWidget
              key={action}
              onVerify={onVerifyCaptcha}
              action={action}
            />

            <div className="submit-wrapper">
              <Button
                type="submit"
                content={intl.formatMessage(messages.submit)}
                primary
                disabled={captcha && !validToken}
              />
            </div>
          </div>
        </Form>
      )}
      {submitResults?.loading && <Loader active inline="centered" />}
      {submitResults?.loaded && (
        <Message positive>
          <p>{intl.formatMessage(messages.thank_you)}</p>
        </Message>
      )}
    </div>
  );
};

export default Feedback;
