import {
  SUBMIT_FEEDBACK_ACTION,
  RESET_SUBMIT_FEEDBACK_ACTION,
  EXPORT_CSV_FEEDBACK_DATA,
  DELETE_ALL_FEEDBACK_DATA,
  GET_FEEDBACK,
  GET_FEEDBACKS,
  DELETE_FEEDBACK,
  RESET_DELETE_FEEDBACK,
} from 'volto-feedback/actions';

const RESET_GET_FEEDBACK = 'RESET_GET_FEEDBACK';

const initialState = {
  error: null,
  loaded: false,
  loading: false,
  subrequests: {},
};

/**
 * submitFeedback reducer.
 * @function submitForm
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export const submitFeedback = (state = initialState, action = {}) => {
  switch (action.type) {
    case `${SUBMIT_FEEDBACK_ACTION}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${SUBMIT_FEEDBACK_ACTION}_SUCCESS`:
      return {
        ...state,
        error: null,
        loaded: true,
        loading: false,
      };
    case `${SUBMIT_FEEDBACK_ACTION}_FAIL`:
      return {
        ...state,
        error: action.error,
        loaded: false,
        loading: false,
      };
    case `${RESET_SUBMIT_FEEDBACK_ACTION}`:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/comma-separated-values;charset=utf-8,' +
      encodeURIComponent(text),
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * exportCsvFeedbackData reducer.
 * @function exportCsvFeedbackData
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export const exportCsvFeedbackData = (state = initialState, action = {}) => {
  switch (action.type) {
    case `${EXPORT_CSV_FEEDBACK_DATA}_PENDING`:
      return {
        ...state,
        error: null,
        result: null,
        loaded: false,
        loading: true,
      };
    case `${EXPORT_CSV_FEEDBACK_DATA}_SUCCESS`:
      download('export-customer-satisfaction.csv', action.result);

      return {
        ...state,
        error: null,
        result: action.result,
        loaded: true,
        loading: false,
      };
    case `${EXPORT_CSV_FEEDBACK_DATA}_FAIL`:
      return {
        ...state,
        error: action.error,
        result: null,
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
};

/**
 * deleteAllFeedbacks reducer.
 * @function deleteAllFeedback
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export const deleteAllFeedbacks = (state = initialState, action = {}) => {
  switch (action.type) {
    case `${DELETE_ALL_FEEDBACK_DATA}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
        result: null,
      };
    case `${DELETE_ALL_FEEDBACK_DATA}_SUCCESS`:
      return {
        ...state,
        error: null,
        loaded: true,
        result: action.result,
        loading: false,
      };
    case `${DELETE_ALL_FEEDBACK_DATA}_FAIL`:
      return {
        ...state,
        error: action.error,
        result: null,
        loaded: true,
        loading: false,
      };

    default:
      return state;
  }
};

/**
 * getFeedbacks reducer.
 * @function getFeedbacks
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export const getFeedbacks = (state = initialState, action = {}) => {
  switch (action.type) {
    case `${GET_FEEDBACKS}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
        result: null,
      };
    case `${GET_FEEDBACKS}_SUCCESS`:
      return {
        ...state,
        error: null,
        loaded: true,
        result: action.result,
        loading: false,
      };
    case `${GET_FEEDBACKS}_FAIL`:
      return {
        ...state,
        error: action.error,
        result: null,
        loaded: true,
        loading: false,
      };
    default:
      return state;
  }
};

/**
 * getFeedback reducer.
 * @function getFeedback
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export const getFeedback = (state = initialState, action = {}) => {
  switch (action.type) {
    case `${GET_FEEDBACK}_PENDING`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                ...(state.subrequests[action.subrequest] || {
                  items: [],
                  total: 0,
                  batching: {},
                }),
                error: null,
                loaded: false,
                loading: true,
              },
            },
          }
        : {
            ...state,
            error: null,
            loaded: false,
            loading: true,
            result: null,
          };
    case `${GET_FEEDBACK}_SUCCESS`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                error: null,
                items: action.result.items,
                total: action.result.items_total,
                loaded: true,
                loading: false,
                batching: { ...action.result.batching },
              },
            },
          }
        : {
            ...state,
            error: null,
            items: action.result.items,
            total: action.result.items_total,
            loaded: true,
            loading: false,
            batching: { ...action.result.batching },
          };
    case `${GET_FEEDBACK}_FAIL`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                error: action.error,
                items: [],
                total: 0,
                loading: false,
                loaded: false,
                batching: {},
              },
            },
          }
        : {
            ...state,
            error: action.error,
            items: [],
            total: 0,
            loading: false,
            loaded: false,
            batching: {},
          };
    case RESET_GET_FEEDBACK:
      return action.subrequest
        ? {
            ...state,
            subrequests: omit(state.subrequests, [action.subrequest]),
          }
        : {
            ...state,
            error: null,
            items: [],
            total: 0,
            loading: false,
            loaded: false,
            batching: {},
          };
    default:
      return state;
  }
};

function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

export const deleteFeedback = (state = initialState, action = {}) => {
  switch (action.type) {
    case `${DELETE_FEEDBACK}_PENDING`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                ...(state.subrequests[action.subrequest] || {
                  data: null,
                }),
                loaded: false,
                loading: true,
                error: null,
              },
            },
          }
        : {
            ...state,
            [getRequestKey(action.type)]: {
              loading: true,
              loaded: false,
              error: null,
            },
          };
    case `${DELETE_FEEDBACK}_SUCCESS`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                loading: false,
                loaded: true,
                error: null,
              },
            },
          }
        : {
            ...state,
            [getRequestKey(action.type)]: {
              loading: false,
              loaded: true,
              error: null,
            },
          };
    case `${DELETE_FEEDBACK}_FAIL`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                data: null,
                loading: false,
                loaded: false,
                error: action.error,
              },
            },
          }
        : {
            ...state,
            data: null,
            [getRequestKey(action.type)]: {
              loading: false,
              loaded: false,
              error: action.error,
            },
          };
    case `${RESET_DELETE_FEEDBACK}`:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
