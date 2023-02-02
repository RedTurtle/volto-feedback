import React, { useState, useEffect } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import {
  Modal,
  Button,
  Table,
  Label,
  Segment,
  Icon as SIcon,
} from 'semantic-ui-react';

import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@plone/volto/components';
import clearSVG from '@plone/volto/icons/clear.svg';
import { getFeedback } from 'volto-feedback/actions';

// import ThumbsUp from '../../../icons/thumbs-up-regular.svg';
// import ThumbsDown from '../../../icons/thumbs-down-regular.svg';

const messages = defineMessages({
  close: {
    id: 'feedback_close_comments',
    defaultMessage: 'Close',
  },
  comment: {
    id: 'feedback_comment',
    defaultMessage: 'Comment',
  },
  date: {
    id: 'feedback_comment_date',
    defaultMessage: 'Date',
  },
  vote: {
    id: 'feedbacks_comments_votes',
    defaultMessage: 'Vote',
  },
});
const FeedbackComments = ({
  item,
  isOpen,
  setIsOpen,
  onClose = () => {},
  moment: Moment,
}) => {
  const intl = useIntl();
  const moment = Moment.default;
  moment.locale(intl.locale);

  const feedbackCommentsResults = useSelector(
    (state) => state.getFeedback.subrequests,
  );
  const dispatch = useDispatch();

  const close = () => {
    setOpen(false);
    onClose();
  };

  const loadCommentsData = (item) => {
    dispatch(getFeedback(item, item));
  };

  return (
    <Modal
      onClose={() => close()}
      onOpen={() => loadCommentsData(item)}
      open={isOpen}
      id="feedback-comments-modal"
    >
      <Modal.Header>{item?.title}</Modal.Header>
      <Modal.Content>
        <Table selectable compact attached fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>
                {intl.formatMessage(messages.vote)}
              </Table.HeaderCell>
              <Table.HeaderCell width={8}>
                {intl.formatMessage(messages.comment)}
              </Table.HeaderCell>
              <Table.HeaderCell width={3}>
                {intl.formatMessage(messages.date)}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {feedbackCommentsResults?.comments?.map((c) => (
              <tr key={c.date}>
                <Table.Cell>
                  <Label
                    color={c.vote === 'ok' ? 'green' : 'red'}
                    className="vote-label"
                  >
                    <SIcon name="star" />
                    {c.vote}
                  </Label>
                </Table.Cell>
                <Table.Cell>{c.comment}</Table.Cell>
                <Table.Cell>
                  {moment(c.date).format('DD/MM/YYYY HH:mm')}
                </Table.Cell>
              </tr>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="black"
          onClick={() => {
            close();
          }}
        >
          {intl.formatMessage(messages.close)}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default injectLazyLibs(['moment'])(FeedbackComments);
