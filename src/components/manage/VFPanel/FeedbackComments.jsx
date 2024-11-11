import React, { useState, useEffect, useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Table,
  Icon as SIcon,
  Loader,
  Form,
  Checkbox,
  Confirm,
} from 'semantic-ui-react';
import { Pagination } from '@plone/volto/components';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import {
  getFeedback,
  updateFeedback,
  updateFeedbackList,
} from 'volto-feedback/actions';
import { generateFeedbackCommentUUID } from 'volto-feedback/helpers';
import config from '@plone/volto/registry';
import 'semantic-ui-css/components/icon.css';
import './feedback-comments.css';

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
  read: { id: 'feedbacks_comments_read', defaultMessage: 'Read' },
  comments_button: {
    id: 'feedbacks_comments_button_open',
    defaultMessage: '{total} comments.',
  },
  filter_unread: {
    id: 'feedbacks_comments_filter_unread',
    defaultMessage: 'Show comments to read.',
  },
  set_all_read: {
    id: 'feedbacks_comments_set_all_read',
    defaultMessage: 'Set all as read.',
  },
  all: {
    id: 'feedbacks_comments_all',
    defaultMessage: 'All comments',
  },
  yes: {
    id: 'feedbacks_comments_toggle_all_yes',
    defaultMessage: 'Yes',
  },
  cancelButton: {
    id: 'feedbacks_comments_toggle_all_cancel',
    defaultMessage: 'No',
  },
  set_all_read_confirm_title: {
    id: 'feedbacks_comments_set_all_read_confirm_title',
    defaultMessage: 'Set all as...',
  },
  set_all_read_confirm_title_read: {
    id: 'feedbacks_comments_set_all_read_confirm_title_read',
    defaultMessage:
      'Are you sure you want to set all visible comments as "read"?',
  },
  set_all_read_confirm_title_unread: {
    id: 'feedbacks_comments_set_all_read_confirm_title_unread',
    defaultMessage:
      'Are you sure you want to set all visible comments as "unread"?',
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
  const dispatch = useDispatch();
  const moment = Moment.default;

  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState({ on: 'date', order: 'descending' });
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [checkAllRead, setCheckAllRead] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const b_size = 25;
  moment.locale(intl.locale);

  const feedbackCommentsResults = useSelector((state) => {
    return state.getFeedback?.subrequests?.[item?.uid];
  });

  const updateFeedbackListResult = useSelector((state) => {
    return state.updateFeedbackList;
  });

  useEffect(() => {
    if (feedbackCommentsResults?.loaded) {
      setComments(feedbackCommentsResults.items);
    }
  }, [feedbackCommentsResults]);

  const close = () => {
    setOpen(false);
  };

  const changeSort = (column) => {
    if (sort.on === column) {
      if (sort.order === 'ascending') {
        setSort({ ...sort, order: 'descending' });
      } else {
        setSort({ ...sort, order: 'ascending' });
      }
    } else {
      setSort({ ...sort, on: column, order: 'ascending' });
    }
  };

  const loadCommentsData = async () => {
    const b_start = currentPage * b_size;
    await dispatch(
      getFeedback(item.uid, item.uid, {
        b_start,
        b_size,
        sort_on: sort.on,
        sort_order: sort.order,
        show_unread: filters.unread,
      }),
    );
  };

  //toggle READ on single comment
  const toggleRead = (comment, read) => {
    dispatch(updateFeedback(comment.id, { read: read }));
    let new_comments = [...comments];
    new_comments.filter((c) => c.id === comment.id)[0].read = read;
    setComments(new_comments);
  };

  const [comments, setComments] = useState([]);

  const additionalColumns =
    config.settings['volto-feedback'].additionalCommentFields ?? [];

  const toggleAllRead = (read) => {
    const feedbacks = comments.reduce((acc, c) => {
      acc[c.id] = { read };
      return acc;
    }, {});
    dispatch(updateFeedbackList(feedbacks));
  };
  useEffect(() => {
    if (!updateFeedbackListResult.loading && updateFeedbackListResult.loaded) {
      loadCommentsData();
    }
  }, [updateFeedbackListResult.loaded]);

  useEffect(() => {
    loadCommentsData();
  }, [currentPage, sort, filters]);

  return (
    <>
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
            })}
          >
            {item.comments}

            {item.has_unread && <span className="unread-items"></span>}
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
            <>
              <Form className="search-comments-form">
                <Checkbox
                  slider
                  label={intl.formatMessage(messages.filter_unread)}
                  onChange={(e, data) =>
                    setFilters({ ...filters, unread: data.checked })
                  }
                  checked={filters.unread}
                />
              </Form>

              <Table compact attached fixed striped sortable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                      width={1}
                      textAlign="center"
                      sorted={sort.on === 'vote' ? sort.order : null}
                      onClick={() => changeSort('vote')}
                    >
                      {intl.formatMessage(messages.vote)}
                    </Table.HeaderCell>
                    <Table.HeaderCell width={8}>
                      {intl.formatMessage(messages.comment)}
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      width={2}
                      sorted={sort.on === 'date' ? sort.order : null}
                      onClick={() => changeSort('date')}
                    >
                      {intl.formatMessage(messages.date)}
                    </Table.HeaderCell>
                    {additionalColumns.map((column, i) => (
                      <Table.HeaderCell width={1} key={i}>
                        {column.label}
                      </Table.HeaderCell>
                    ))}
                    <Table.HeaderCell
                      width={1}
                      textAlign="center"
                      id="read-head-col"
                    >
                      {intl.formatMessage(messages.read)}

                      <div className="ui fitted checkbox">
                        <input
                          type="checkbox"
                          title={intl.formatMessage(messages.set_all_read)}
                          checked={checkAllRead}
                          onChange={(e) => {
                            const read = e.target.checked;
                            setCheckAllRead(read);
                            setModalConfirmOpen(true);
                          }}
                        />
                        <label></label>
                      </div>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {comments?.map((c) => (
                    <tr
                      key={generateFeedbackCommentUUID(c.date)}
                      className={c.read ? '' : 'comment-to-read'}
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
                          {column.component
                            ? column.component(c)
                            : c[column.id]}
                        </Table.Cell>
                      ))}
                      <Table.Cell textAlign="center">
                        <Checkbox
                          checked={
                            typeof c.read == 'string'
                              ? c.read === 'true'
                              : c.read
                          }
                          onChange={(e, data) => toggleRead(c, data.checked)}
                        />
                      </Table.Cell>
                    </tr>
                  ))}
                </Table.Body>
              </Table>
              <div className="contents-pagination">
                <Pagination
                  current={currentPage}
                  total={Math.ceil(feedbackCommentsResults?.total / b_size)}
                  pageSize={b_size}
                  onChangePage={(e, p) => {
                    setCurrentPage(p.value);
                  }}
                  //  pageSizes={[b_size, intl.formatMessage(messages.all)]}
                  // onChangePageSize={(e, s) => setB_size(s.value)}
                />
              </div>
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={close}>
            {intl.formatMessage(messages.close)}
          </Button>
        </Modal.Actions>
      </Modal>

      <Confirm
        open={modalConfirmOpen}
        confirmButton={intl.formatMessage(messages.yes)}
        cancelButton={intl.formatMessage(messages.cancelButton)}
        header={intl.formatMessage(messages.set_all_read_confirm_title)}
        content={
          <div className="content">
            <p>
              {checkAllRead
                ? intl.formatMessage(messages.set_all_read_confirm_title_read)
                : intl.formatMessage(
                    messages.set_all_read_confirm_title_unread,
                  )}
            </p>
          </div>
        }
        onCancel={() => {
          setModalConfirmOpen(false);
          setCheckAllRead(!checkAllRead);
        }}
        onConfirm={() => {
          toggleAllRead(checkAllRead);
          setModalConfirmOpen(false);
        }}
        size="small"
      />
    </>
  );
};

export default injectLazyLibs(['moment'])(FeedbackComments);
