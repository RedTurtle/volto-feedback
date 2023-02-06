# volto-feedback

Volto addon for end-user feedbacks.

Install with mrs-developer (see [Volto docs](https://docs.voltocms.com/customizing/add-ons/)) or with:

```bash
yarn add volto-feedback
```

## Usage

This addons exports FeedbackForm component that could be added in your site pages to get feedback from users on the usefulness of the page through rating, commenting and choosing an answer from a predefined set.

```jsx
import { FeedbackForm } from 'volto-feedback';

...
<FeedbackForm/>
...
```

It features a set of fully customizable panes and questions for the form, which can be set using standard Volto config. Otherwise, it defaults to 5 positive and 5 negative set of questions, based on user rating, and an optional comment.
The answers shown depend on user feedback, with a default threshold of 3.5 stars to set
positive apart from negative feedback.

```jsx
    ...
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
    ...
```

All exported components, actions and helpers can be directly customized using standard Volto customization pattern. This is the list of exported components

```jsx
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
  generateFeedbackCommentUUID,
} from 'volto-feedback/helpers';
export {
  GoogleReCaptchaWidget,
  HoneypotWidget,
} from 'volto-feedback/components/widgets';
export {
  Feedback,
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
```

It needs this Plone addon to work.

It also need a RAZZLE_RECAPTCHA_KEY in your .env to work or RAZZLE_HONEYPOT_FIELD env var..

## Feedback Form

show form

## Panel

This addon also adds a button to the toolbar to access customer satisfaction panel:

<img alt="Toolbar button" src="./docs/toolbar-panel-button.png" width="50px" />

Into the panel, you can view a summary of feedbacks and answers/comments with respective ratings:

<img alt="Customer satisfaction panel" src="./docs/panel.png" width="600" />

Comments are shown in a modal and are filterable:
<img alt="Customer satisfaction panel" src="./docs/comments.png" width="600" />

## Honeypot integration

If you want to use Honeypot, you have to set env var RAZZLE_HONEYPOT_FIELD with the same value of the HONEYPOT_FIELD env var setted on plone backend.
