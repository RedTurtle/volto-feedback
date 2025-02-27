# volto-feedback

Volto addon for end-user feedbacks.

Install with mrs-developer (see [Volto docs](https://docs.voltocms.com/customizing/add-ons/)) or with:

```bash
yarn add volto-feedback
```

It requires <https://github.com/RedTurtle/collective.feedback> installed into the backend.

**Please consult Version and breaking changes section for more information on versions and breaking changes**

## Usage

This addons exports FeedbackForm component that could be added in your site pages to get feedback from users on the usefulness of the page through rating, commenting and choosing an answer from a predefined set.

```jsx
import { FeedbackForm } from 'volto-feedback';

...
<FeedbackForm/>
...
```

It features a set of fully customizable form steps, rating threshold and questions for the form, which can be set using standard Volto config schema. Otherwise, it defaults to 5 positive and 5 negative set of questions (optional) and a comment (optional).
Answers shown are dependant on user feedback, with a default threshold of 3.5 that sets positive and negative feedbacks answers apart.
This is the default configuration:

```jsx
    ...
    config.settings['volto-feedback'] = {
        feedbackThreshold: FEEDBACK_THRESHOLD,
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
        /*
        Additional columns to display in comments table, for example if i customize steps.
        If component attribute is undefined, the simple value is displayed.
        Example:
        { id: 'email', label: 'Email', component: null },
        */
        additionalCommentFields: [
        ],
        /* Enable Feedback component in your CMS/Non content routes.
        Example:
        { path: '/sitemap', feedbackTitle: messages.sitemap_ft },
        { path: '/search', feedbackTitle: messages.search_brdc },
        */
        feedbackEnabledNonContentRoutes: [],
    };
    ...
```

All exported components, actions and helpers can be directly customized using standard Volto customization pattern. This is the list of available exports:

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
  updateFeedback,
  updateFeedbackList,
} from 'volto-feedback/actions';
export {
  getFeedbackFormSteps,
  getFeedbackFormByStep,
  getFeedbackQuestions,
  getFeedbackThreshold,
  getTranslatedQuestion,
  generateFeedbackCommentUUID,
  getNumberOfSteps,
  isFeedbackEnabledForRoute,
  getFeedbackEnabledNonContentRoutes,
  getStaticFeedbackRouteTitle,
  getFeedbackEnabledNonContentRoutesPathList,
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
```

It also need a RAZZLE_RECAPTCHA_KEY in your .env to work or RAZZLE_HONEYPOT_FIELD env var.

## Versions and breaking changes

### Important notice

Version 0.6.x includes breaking changes to the underlying service `@feedback-add`.
For full compatibility, you must install version 1.2.x in the backend.

Version 0.6.x adds optional configuration to enable feedback for non content routes/cms routes. To do this, the call to the associated Plone service is no longer contextual. Determining the context is done via a new param in the body of the request: `content`.

```jsx
 const path = location.pathname ?? '/';
 ...
 const sendFormData = () => {
    const data = {
      ...formData,
      ...(captcha && { 'g-recaptcha-response': validToken }),
      answer: getTranslatedQuestion(intl, formData.answer),
      content:
        isFeedbackEnabledForRoute(path) && isCmsUi(path)
          ? getStaticFeedbackRouteTitle(path)
          : path,
    };
    dispatch(submitFeedback(path, data));
  };
  ...
```

This will be the current pathname, or the title of the non content routes/cms routes enabled in the configuration settings:

```js
    'volto-feedback': {
      ...config.settings['volto-feedback'],
        /* Enable Feedback component in your CMS/Non content routes. */
      feedbackEnabledNonContentRoutes: [
        { path: '/sitemap', feedbackTitle: messages.sitemap_ft },
        { path: '/search', feedbackTitle: messages.search_brdc }
      ],
    }
```

## Translations

This addon has Italian and English localizations.

## Feedback Form

FeedbackForm is a component that can be added anywhere.
![image](https://user-images.githubusercontent.com/41484878/216962241-fa88d610-9fc7-4831-ac69-fd6e34655c71.png)

Form fields, answers and comments section may vary depending on selected threshold and your own configurations, these are the default ones:
![image](https://user-images.githubusercontent.com/41484878/216961741-404f357d-70fb-474b-989c-96bd51cfada1.png)
![image](https://user-images.githubusercontent.com/41484878/216961998-a4c1e7fa-1bd1-4349-a15a-1083c11c60de.png)
![image](https://user-images.githubusercontent.com/41484878/216962045-8086eb14-de68-4cbf-a6c4-6d2e4d993332.png)

Once a feedback is submitted, a success message is shown to the user:
![image](https://user-images.githubusercontent.com/41484878/216962200-b450216e-9a02-4d51-be3d-75b8a912df01.png)

## Panel

This addon also adds a button to the toolbar to access feedbacks panel:

![image](https://user-images.githubusercontent.com/41484878/216961401-527799d9-d336-488e-864e-cb919c4f4d8c.png)

Into the panel, you can view a summary of feedbacks and answers/comments with respective ratings:

![image](https://user-images.githubusercontent.com/41484878/216961272-72ecd260-9aa2-485e-9483-2a210b83901a.png)

Comments are shown in a modal and are filterable by vote and rating datetime:
![image](https://user-images.githubusercontent.com/41484878/216961506-b9d1e225-f36d-4c7f-a26c-c61794764fbc.png)

## Honeypot integration

If you want to use Honeypot, you have to set env var RAZZLE_HONEYPOT_FIELD with the same value of the HONEYPOT_FIELD env var set on plone backend.
