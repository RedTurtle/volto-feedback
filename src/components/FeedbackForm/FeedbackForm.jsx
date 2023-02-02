/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useIntl, defineMessages } from 'react-intl';
import {
  Form,
  Button,
  TextArea,
  Loader,
  Message,
  Rating,
} from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { isCmsUi } from '@plone/volto/helpers';
import {
  HoneypotWidget,
  GoogleReCaptchaWidget,
} from 'volto-feedback/components/widgets';

import { submitFeedback, resetSubmitFeedback } from 'volto-feedback/actions';
import './feedback-form.css';
import {
  getFeedbackFormByStep,
  getNumberOfSteps,
  getQuestionIndex,
} from 'volto-feedback/helpers';
import 'semantic-ui-css/components/rating.css';

const messages = defineMessages({
  title: {
    id: 'feedback_form_title',
    defaultMessage: 'Was this page useful to you?',
  },
  yes: {
    id: 'feedback_form_yes',
    defaultMessage: 'Yes',
  },
  no: {
    id: 'feedback_form_no',
    defaultMessage: 'No',
  },
  suggestions_placeholder: {
    id: 'feedback_form_suggestions_placeholder',
    defaultMessage:
      'Explain us why, and help us improve the quality of the site',
  },
  submit: {
    id: 'feedback_form_submit',
    defaultMessage: 'Submit your comment',
  },
  thank_you: {
    id: 'feedback_form_thank_you',
    defaultMessage: 'Thank you for your feedback!',
  },
  next: {
    id: 'feedback_form_button_next',
    defaultMessage: 'Next',
  },
  prev: {
    id: 'feedback_form_button_prev',
    defaultMessage: 'Previous',
  },
});

const FeedbackForm = () => {
  const intl = useIntl();
  const location = useLocation();
  const path = location.pathname ?? '/';
  const dispatch = useDispatch();
  const [satisfaction, setSatisfaction] = useState(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const captcha = !!process.env.RAZZLE_RECAPTCHA_KEY ? 'GoogleReCaptcha' : null;
  const submitResults = useSelector((state) => state.submitFeedback);
  const [validToken, setValidToken] = useState(null);
  let fieldHoney = process.env.RAZZLE_HONEYPOT_FIELD;

  if (__CLIENT__) {
    fieldHoney = window.env.RAZZLE_HONEYPOT_FIELD;
  }

  const numberOfSteps = useMemo(() => getNumberOfSteps(), []);

  const changeSatisfaction = (e, { rating, maxRating }) => {
    e.stopPropagation();
    e.preventDefault();
    setSatisfaction(rating);
  };

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const getFormFieldValue = (field) => formData?.[field] ?? undefined;

  const nextStep = () => {
    if (step === numberOfSteps - 1)
      // actually have to submit form
      sendFormData();
    else setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    setSatisfaction(null);
    setValidToken(null);
    return () => {
      dispatch(resetSubmitFeedback());
    };
  }, [path]);

  useEffect(() => {
    updateFormData('vote', satisfaction ?? null);
    setStep(0);
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
    const actualAnswers = getQuestionIndex(formData['answers']);
    const data = {
      ...formData,
      answers: actualAnswers,
    };
    console.log('I will be submitting this data', data);
    // dispatch(
    //   submitFeedback(path, {
    //     ...data,
    //     ...(captcha && { 'g-recaptcha-response': validToken }),
    //   }),
    // );
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

  const renderFormStep = () => {
    if (step === undefined) return null;
    const StepToRender = getFeedbackFormByStep(step);
    return (
      <StepToRender
        updateFormData={updateFormData}
        userFeedback={satisfaction}
        intl={intl}
        step={step}
        totalSteps={numberOfSteps}
        getFormFieldValue={getFormFieldValue}
      />
    );
  };
  return (
    <div className="feedback-form">
      <h2 id="vf-radiogroup-label">{intl.formatMessage(messages.title)}</h2>

      {!submitResults?.loading && !submitResults.loaded && (
        // <Form
        //   onSubmit={() => {
        //     sendFormData();
        //   }}
        // >
        //   <div className="buttons" aria-labelledby="vf-radiogroup-label">
        //     <Button
        //       animated={
        //         satisfaction == null || satisfaction !== true ? 'fade' : null
        //       }
        //       color="green"
        //       onClick={(e) => {
        //         changeSatisfaction(e, true);
        //       }}
        //       aria-controls="vf-more"
        //       active={satisfaction === true}
        //     >
        //       <Button.Content hidden>
        //         {intl.formatMessage(messages.yes)}
        //       </Button.Content>
        //       {(satisfaction == null || satisfaction !== true) && (
        //         <Button.Content visible>
        //           <Icon name={ThumbsUp} size="1.5rem" />
        //         </Button.Content>
        //       )}
        //     </Button>

        //     <Button
        //       animated={
        //         satisfaction == null || satisfaction !== false ? 'fade' : null
        //       }
        //       color="red"
        //       onClick={(e) => {
        //         changeSatisfaction(e, false);
        //       }}
        //       aria-controls="vf-more"
        //       active={satisfaction === false}
        //     >
        //       <Button.Content hidden>
        //         {intl.formatMessage(messages.no)}
        //       </Button.Content>
        //       {(satisfaction == null || satisfaction !== false) && (
        //         <Button.Content visible>
        //           <Icon name={ThumbsDown} size="1.5rem" />
        //         </Button.Content>
        //       )}
        //     </Button>
        //   </div>

        //   <div
        //     id="vf-more"
        //     role="region"
        //     aria-expanded={satisfaction !== null}
        //     aria-hidden={satisfaction === null}
        //   >
        //     <div className="comment">
        //       <TextArea
        //         placeholder={intl.formatMessage(
        //           messages.suggestions_placeholder,
        //         )}
        //         onChange={(e, v) => {
        //           updateFormData('comment', v.value);
        //         }}
        //       />
        //     </div>

        //     <HoneypotWidget
        //       updateFormData={updateFormData}
        //       field={fieldHoney}
        //     />
        //     <GoogleReCaptchaWidget
        //       key={action}
        //       onVerify={onVerifyCaptcha}
        //       action={action}
        //     />

        //     <div className="submit-wrapper">
        //       <Button
        //         type="submit"
        //         content={intl.formatMessage(messages.submit)}
        //         primary
        //         disabled={captcha && !validToken}
        //       />
        //     </div>
        //   </div>
        //
        // </Form>
        <Form onSubmit={sendFormData}>
          <div className="rating-container">
            <Rating
              maxRating={5}
              clearable={false}
              size="huge"
              aria-controls="vf-more"
              className="volto-feedback-rating"
              onRate={changeSatisfaction}
            />
          </div>
          {renderFormStep()}
          <HoneypotWidget updateFormData={updateFormData} field={fieldHoney} />
          <GoogleReCaptchaWidget
            key={action}
            onVerify={onVerifyCaptcha}
            action={action}
          />
          <div
            className="form-step-actions"
            aria-hidden={satisfaction === null}
          >
            <button
              className="prev-action"
              disabled={!!(step - 1)}
              onClick={prevStep}
            >
              {intl.formatMessage(messages.prev)}
            </button>
            {step !== numberOfSteps - 1 && (
              <button onClick={nextStep} className="next-action">
                {intl.formatMessage(messages.next)}
              </button>
            )}
            {step === numberOfSteps - 1 && (
              <button className="next-action" type={'submit'}>
                {intl.formatMessage(messages.next)}
              </button>
            )}
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

export default FeedbackForm;
