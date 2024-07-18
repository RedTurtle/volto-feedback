import React, { useState, useEffect, useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import {
  Modal,
  Button,
  Table,
  Label,
  Segment,
  Icon as SIcon,
  Loader,
  Checkbox,
} from 'semantic-ui-react';
import orderBy from 'lodash/orderBy';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@plone/volto/components';
import clearSVG from '@plone/volto/icons/clear.svg';
import { getFeedback, updateFeedback } from 'volto-feedback/actions';
import 'semantic-ui-css/components/icon.css';
import { generateFeedbackCommentUUID } from 'volto-feedback/helpers';
import config from '@plone/volto/registry';

const messages = defineMessages({
  close: {
    id: 'feedback_close_comments',
    defaultMessage: 'Close',
  },
  comment: {
    id: 'feedback_comment',
    defaultMessage: 'Feedback',
  },
  date: {
    id: 'feedback_comment_date',
    defaultMessage: 'Date',
  },
  vote: {
    id: 'feedbacks_comments_votes',
    defaultMessage: 'Vote',
  },
  show_more: {
    id: 'feedback_show_more',
    defaultMessage: 'Read more',
  },
  show_less: {
    id: 'feedback_show_less',
    defaultMessage: '...show less',
  },
  no_feedback: {
    id: 'feedback_no_feedback',
    defaultMessage: 'No feedback provided',
  },
  readed: { id: 'feedbacks_comments_readed', defaultMessage: 'Readed' },
  comments_button: {
    id: 'feedbacks_comments_button_open',
    defaultMessage: '{total} comments. {unreaded} to read.',
  },
});

const ReadMore = ({ children, intl }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const needsShowMore = useMemo(() => children.length > 200, [children.length]);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  if (!children || !intl) return null;
  return (
    <p className="read-more-text">
      {isReadMore
        ? children.slice(0, 200) + (needsShowMore ? '...' : '')
        : children}
      {needsShowMore && (
        <Button
          onClick={toggleReadMore}
          className="read-more-show-less"
          title={
            isReadMore
              ? intl.formatMessage(messages.show_more)
              : intl.formatMessage(messages.show_less)
          }
        >
          {isReadMore
            ? intl.formatMessage(messages.show_more)
            : intl.formatMessage(messages.show_less)}
        </Button>
      )}
    </p>
  );
};

const FeedbackComments = ({ item, moment: Moment }) => {
  const intl = useIntl();
  const moment = Moment.default;
  const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('descending');
  const [sortOn, setSortOn] = useState('date');
  moment.locale(intl.locale);

  const feedbackCommentsResults = useSelector((state) => {
    return state.getFeedback?.subrequests?.[item?.uid];
  });
  const dispatch = useDispatch();

  const close = () => {
    setOpen(false);
  };

  const changeSort = (column) => {
    if (sortOn === column) {
      if (sortOrder === 'ascending') {
        setSortOrder('descending');
      } else {
        setSortOrder('ascending');
      }
    } else {
      setSortOn(column);
    }
  };

  const loadCommentsData = async () => {
    await dispatch(getFeedback(item.uid, item.uid));
  };

  const toggleReaded = (comment, readed) => {
    dispatch(updateFeedback(item.uid, { uid: comment.uid, readed: readed }));
    let new_comments = [...comments];
    new_comments.filter((c) => c.uid === comment.uid)[0].readed = readed;
    setComments(new_comments);
  };

  useEffect(() => {
    if (feedbackCommentsResults?.loaded) {
      setComments(feedbackCommentsResults.items);
    }
  }, [feedbackCommentsResults]);

  const [comments, setComments] = useState([]);

  const additionalColumns =
    config.settings['volto-feedback'].additionalCommentFields ?? [];
  return (
    <Modal
      onClose={close}
      onOpen={loadCommentsData}
      open={open}
      id="feedback-comments-modal"
      trigger={
        <Button
          size="mini"
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          className="open-feedback-comments"
          title={intl.formatMessage(messages.comments_button, {
            total: item.comments ?? 0,
            unreaded: item.unreaded ?? 0,
          })}
        >
          {item.comments}

          {item.unreaded > 0 && <span className="unreaded-items"></span>}
        </Button>
      }
      size="fullscreen"
    >
      <Modal.Header>{item?.title}</Modal.Header>
      <Modal.Content>
        {feedbackCommentsResults?.loading && (
          <Loader active className="workaround" inline="centered" />
        )}
        {feedbackCommentsResults?.loaded && (
          <Table compact attached fixed striped sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  width={1}
                  textAlign="center"
                  sorted={sortOn === 'vote' ? sortOrder : null}
                  onClick={() => changeSort('vote')}
                >
                  {intl.formatMessage(messages.vote)}
                </Table.HeaderCell>
                <Table.HeaderCell width={8}>
                  {intl.formatMessage(messages.comment)}
                </Table.HeaderCell>
                <Table.HeaderCell
                  width={2}
                  sorted={sortOn === 'date' ? sortOrder : null}
                  onClick={() => changeSort('date')}
                >
                  {intl.formatMessage(messages.date)}
                </Table.HeaderCell>
                {additionalColumns.map((column, i) => (
                  <Table.HeaderCell width={1} key={i}>
                    {column.label}
                  </Table.HeaderCell>
                ))}
                <Table.HeaderCell width={1} textAlign="center">
                  {intl.formatMessage(messages.readed)}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orderBy(
                comments,
                sortOn,
                sortOrder === 'ascending' ? 'asc' : 'desc',
              )?.map((c) => (
                <tr
                  key={generateFeedbackCommentUUID(c.date)}
                  className={c.readed ? '' : 'comment-to-read'}
                >
                  <Table.Cell textAlign="center">
                    <SIcon name="star" />
                    {Math.fround(c.vote)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="feedback-answer">{c.answer}</div>
                    <div className="feedback-comment">
                      <ReadMore intl={intl}>{c.comment}</ReadMore>
                      {!c.answer && !c.comment && (
                        <div className="feedback-no-feedback">
                          {intl.formatMessage(messages.no_feedback)}
                        </div>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {moment(c.date).format('DD/MM/YYYY HH:mm')}
                  </Table.Cell>
                  {additionalColumns.map((column, i) => (
                    <Table.Cell key={i + 'colcontent'}>
                      {column.component ? column.component(c) : c[column.id]}
                    </Table.Cell>
                  ))}
                  <Table.Cell textAlign="center">
                    <Checkbox
                      checked={c.readed}
                      onChange={(e, data) => toggleReaded(c, data.checked)}
                    />
                  </Table.Cell>
                </tr>
              ))}
            </Table.Body>
          </Table>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={close}>
          {intl.formatMessage(messages.close)}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default injectLazyLibs(['moment'])(FeedbackComments);
