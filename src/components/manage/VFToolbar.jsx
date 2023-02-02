import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Icon } from '@plone/volto/components';
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
  const token = useSelector((state) => state.userSession?.token);
  return token ? (
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
