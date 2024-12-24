import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Button, Confirm, Loader, Dimmer } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import Toast from '@plone/volto/components/manage/Toast/Toast';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import downloadSVG from '@plone/volto/icons/download.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import {
  exportCsvFeedbackData,
  deleteAllFeedbacks,
} from 'volto-feedback/actions';

const messages = defineMessages({
  export_csv: {
    id: 'feedback_export_csv',
    defaultMessage: 'Export in CSV',
  },
  delete_all: {
    id: 'feedback_delete_all',
    defaultMessage: 'Delete all feedbacks',
  },
  confirm_delete_all: {
    id: 'feedback_confirm_delete_all',
    defaultMessage: 'Are you sure you want to delete all feedbacks?',
  },
  cancel: {
    id: 'feedbacks_cancel_delete_all',
    defaultMessage: 'Cancel',
  },
  error_delete_all: {
    id: 'feedbacks_error_delete_all',
    defaultMessage: 'An error has occurred',
  },
  success_delete_all: {
    id: 'feedbacks_success_delete_all',
    defaultMessage: 'Success',
  },
  delete_all_success: {
    id: 'feedbacks_delete_all_success',
    defaultMessage: 'All feedbacks deleted successfully!',
  },
  delete_all_error: {
    id: 'feedbacks_delete_all_error',
    defaultMessage:
      'An error has occurred while trying to delete all feedbacks',
  },
  loading: {
    id: 'feedbacks_loading',
    defaultMessage: 'Loading...',
  },
});
const VFPanelMenu = ({ toastify, doSearch, can_delete_feedbacks }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const deleteAllFeedbacksState = useSelector(
    (state) => state.deleteAllFeedbacks,
  );
  const deleteAll = async () => {
    try {
      await dispatch(deleteAllFeedbacks());
      setOpenConfirm(false);
      toastify.toast.success(
        <Toast
          success
          title={intl.formatMessage(messages.success_delete_all)}
          content={intl.formatMessage(messages.delete_all_success)}
        />,
      );
      doSearch();
    } catch (e) {
      toastify.toast.error(
        <Toast
          error
          title={intl.formatMessage(messages.error_delete_all)}
          content={intl.formatMessage(messages.delete_all_error, {
            element: e?.item?.title ?? '',
          })}
        />,
      );
    }
  };
  return (
    <Menu secondary>
      <Menu.Item>
        <Button
          primary
          icon
          labelPosition="right"
          onClick={() => {
            dispatch(exportCsvFeedbackData());
          }}
        >
          {intl.formatMessage(messages.export_csv)}
          <i className="icon">
            <Icon name={downloadSVG} size="20px" />
          </i>
        </Button>
      </Menu.Item>

      {can_delete_feedbacks && (
        <Menu.Menu position="right">
          <Menu.Item>
            <Button
              color="red"
              icon
              labelPosition="right"
              onClick={() => setOpenConfirm(true)}
            >
              {intl.formatMessage(messages.delete_all)}
              <i className="icon">
                <Icon name={trashSVG} size="20px" />
              </i>
            </Button>
          </Menu.Item>
        </Menu.Menu>
      )}
      <Confirm
        role="dialog"
        aria-modal="true"
        cancelButton={intl.formatMessage(messages.cancel)}
        open={openConfirm}
        header={intl.formatMessage(messages.delete_all)}
        content={
          <div className="content ui ">
            {!deleteAllFeedbacksState.loaded &&
              deleteAllFeedbacksState.loading && (
                <Dimmer active>
                  <Loader inverted inline="centered" size="large">
                    {intl.formatMessage(messages.loading)}
                  </Loader>
                </Dimmer>
              )}
            {!deleteAllFeedbacksState.loading &&
              intl.formatMessage(messages.confirm_delete_all)}
          </div>
        }
        onCancel={() => setOpenConfirm(false)}
        onConfirm={deleteAll}
        size="small"
      />
    </Menu>
  );
};

export default injectLazyLibs(['toastify'])(VFPanelMenu);
