export const SUBMIT_FEEDBACK_ACTION = 'SUBMIT_FEEDBACK_ACTION';
export const RESET_SUBMIT_FEEDBACK_ACTION = 'RESET_SUBMIT_FEEDBACK_ACTION';
export const RESET_DELETE_FEEDBACK = 'RESET_DELETE_FEEDBACK_FEEDBACK';

/**
 * submitFeedback function
 * @function submitFeedback
 * @param {string} path
 * @param {Object} data
 */
export function submitFeedback(path = '', data) {
  return {
    type: SUBMIT_FEEDBACK_ACTION,
    request: {
      op: 'post',
      path: path + '/@feedback-add',
      data,
    },
  };
}

export function resetSubmitFeedback() {
  return {
    type: RESET_SUBMIT_FEEDBACK_ACTION,
  };
}

export function resetDeleteFeedback() {
  return { type: RESET_DELETE_FEEDBACK };
}

/**
 * EXPORT_CSV_FEEDBACK_DATA action
 * @module actions/exportCsvFeedbackData
 */
export const EXPORT_CSV_FEEDBACK_DATA = 'EXPORT_CSV_FEEDBACK_DATA';

export function exportCsvFeedbackData() {
  return {
    type: EXPORT_CSV_FEEDBACK_DATA,
    request: {
      op: 'get',
      path: '/@feedback-csv',
    },
  };
}

/**
 * DELETE_ALL_FEEDBACK_DATA action
 * @module actions/deleteAllFeedback
 */
export const DELETE_ALL_FEEDBACK_DATA = 'DELETE_ALL_FEEDBACK_DATA';

export function deleteAllFeedbacks() {
  return {
    type: DELETE_ALL_FEEDBACK_DATA,
    request: {
      op: 'del',
      path: '/@feedback-delete',
    },
  };
}

/**
 * GET_FEEDBACKS action
 * @module actions/getFeedbacks
 */
export const GET_FEEDBACKS = 'GET_FEEDBACKS';
export function getFeedbacks(data) {
  return {
    type: GET_FEEDBACKS,
    request: {
      op: 'get',
      path: '/@feedback',
      params: data,
    },
  };
}

/**
 * GET_FEEDBACK action
 * @module actions/getFeedback
 */
export const GET_FEEDBACK = 'GET_FEEDBACK';
export function getFeedback(uid, subrequest) {
  return {
    type: GET_FEEDBACK,
    subrequest,
    request: {
      op: 'get',
      path: `/@feedback/${uid}`,
    },
  };
}

/**
 * DELETE_FEEDBACK action
 * @module actions/getFeedbacks
 */
export const DELETE_FEEDBACK = 'DELETE_FEEDBACK';
export function deleteFeedback(item) {
  return {
    type: DELETE_FEEDBACK,
    mode: 'serial',
    request: !Array.isArray(item)
      ? {
          op: 'del',
          path: '/@feedback-delete/' + item?.uid,
        }
      : item?.map((it) => ({
          op: 'del',
          path: '/@feedback-delete/' + it?.uid,
        })),
  };
}

/**
 * DELETE_FEEDBACK action
 * @module actions/getFeedbacks
 */
export const UPDATE_FEEDBACK = 'UPDATE_FEEDBACK';
export function updateFeedback(parent_uid, item) {
  return {
    type: UPDATE_FEEDBACK,
    request: {
      op: 'patch',
      path: '/@feedback/' + parent_uid,
      data: item,
    },
  };
}
