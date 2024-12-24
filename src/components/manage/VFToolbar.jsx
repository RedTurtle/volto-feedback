import React, { useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Plug } from '@plone/volto/components/manage/Pluggable';
import FeedbackSVG from '../../icons/feedback.svg';
import './vf-toolbar.css';

const messages = defineMessages({
  feedback: {
    id: 'Feedback control panel',
    defaultMessage: 'Feedback control panel',
  },
});

export const VFToolbar = () => {
  const intl = useIntl();
  const actions = useSelector((state) => {
    return state?.actions?.actions;
  });
  const hasPermissions = useMemo(
    () => actions?.user?.some((ua) => ua?.id === 'feedback-dashboard'),
    [actions],
  );
  return hasPermissions ? (
    <Plug pluggable="main.toolbar.bottom" id="feedback-toolbar">
      <Link
        to="/feedback-panel"
        aria-label={intl.formatMessage(messages.feedback)}
        tabIndex={0}
        className="deleteBlocks"
        id="toolbar-feedback-panel"
      >
        <Icon name={FeedbackSVG} size="30px" />
      </Link>
    </Plug>
  ) : null;
};

export default VFToolbar;
