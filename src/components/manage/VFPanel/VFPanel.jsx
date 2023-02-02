import React, { useState, useEffect, useMemo } from 'react';
import { Portal } from 'react-portal';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Segment,
  Checkbox,
  Button,
  Table,
  Loader,
  Form,
  Input,
  Message,
} from 'semantic-ui-react';

import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { Pagination, Toolbar, Unauthorized } from '@plone/volto/components';
import { Helmet, flattenToAppURL } from '@plone/volto/helpers';

import { FeedbackComments } from 'volto-feedback/components/manage';

import {
  getFeedbacks,
  getFeedback,
  deleteFeedback,
  resetDeleteFeedback,
} from 'volto-feedback/actions';
import VFPanelMenu from './VFPanelMenu';
import './vf-panel.css';

const messages = defineMessages({
  feedbacks_controlpanel: {
    id: 'Feedbacks',
    defaultMessage: 'Feedbacks',
  },
  select_all: {
    id: 'feedbacks_select_all',
    defaultMessage: 'Select/Deselect all',
  },
  select_item: {
    id: 'feedbacks_select_item',
    defaultMessage: 'Select item',
  },
  all: {
    id: 'feedbacks_all',
    defaultMessage: 'All',
  },
  page: {
    id: 'feedbacks_page',
    defaultMessage: 'Page',
  },
  vote: {
    id: 'feedbacks_votes',
    defaultMessage: 'Vote',
  },
  last_vote: {
    id: 'feedbacks_last_vote',
    defaultMessage: 'Last vote',
  },
  comments: {
    id: 'feedbacks_comments',
    defaultMessage: 'Comments',
  },
  filter_title: {
    id: 'feedbacks_filter_title',
    defaultMessage: 'Filter title',
  },
  items_selected: {
    id: 'feedbacks_items_selected',
    defaultMessage: 'items selected.',
  },
  reset_feedbacks: {
    id: 'feedbacks_reset_feedbacks',
    defaultMessage: 'Reset feedbacks',
  },
  confirm_delete_selected: {
    id: 'feedbacks_confirm_delete_selected',
    defaultMessage: "Are you sure you want to reset this page's feedbacks?",
  },
  error: {
    id: 'feedbacks_error',
    defaultMessage: 'An error has occurred',
  },
  delete_error: {
    id: 'feedbacks_delete_error',
    defaultMessage:
      'An error has occurred while trying to delete feedbacks for {element}',
  },
});
const VFPanel = ({ moment: Moment }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname ?? '/';

  const moment = Moment.default;
  moment.locale(intl.locale);

  const [b_size, setB_size] = useState(50);

  const [sort_on, setSort_on] = useState('last_vote');
  const [sort_order, setSort_order] = useState('descending');

  const [currentPage, setCurrentPage] = useState(0);
  const [searchableText, setSearchableText] = useState('');
  const [text, setText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [itemsSelected, setItemsSelected] = useState([]);

  // TRY TO USE THIS
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setText(searchableText);
      // Send Axios request here
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchableText]);

  const [viewComments, setViewComments] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const feedbacks = useSelector((state) => state.getFeedbacks);
  const isUnauthorized = useMemo(
    () => feedbacks?.error && feedbacks?.error?.status === 401,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feedbacks?.error],
  );
  const deleteFeedbacksState = useSelector(
    (state) => state.deleteFeedbacks.subrequests,
  );

  const deleteFeedbacksEnd =
    Object.keys(deleteFeedbacksState ?? [])?.filter(
      (k) => deleteFeedbacksState[k].loaded === true,
    )?.length > 0;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const doSearch = () => {
    return dispatch(
      getFeedbacks({
        b_size,
        b_start: currentPage * b_size,
        sort_on,
        sort_order,
        text: text && text.length > 0 ? text + '*' : null,
      }),
    );
  };

  useEffect(() => {
    doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b_size, currentPage, sort_order, sort_on, text]);

  const changeSort = (column) => {
    if (sort_on === column) {
      if (sort_order === 'ascending') {
        setSort_order('descending');
      } else {
        setSort_order('ascending');
      }
    } else {
      setSort_on(column);
    }
  };

  const resetSelectedFeedbacks = async () => {
    // eslint-disable-next-line no-unused-expressions
    try {
      const asyncDeleteFuncs = itemsSelected?.map((item) => {
        dispatch(deleteFeedback(item));
      });
      await Promise.all(asyncDeleteFuncs);
      setShowConfirmDelete(false);
    } catch (e) {
      toastify.toast.error(
        <Toast
          error
          title={intl.formatMessage(messages.error)}
          content={intl.formatMessage(messages.delete_error, {
            element: e?.item?.title ?? '',
          })}
        />,
      );
    }
  };

  useEffect(() => {
    if (deleteFeedbacksEnd) {
      doSearch().then(() => {
        setItemsSelected([]);
      });
      dispatch(resetDeleteFeedback());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFeedbacksEnd]);

  return (
    <>
      {!isUnauthorized ? (
        <Container id="page-feedbacks" className="controlpanel-feedbacks">
          <Helmet title={intl.formatMessage(messages.feedbacks_controlpanel)} />
          <Segment.Group raised>
            <Segment className="primary">
              {intl.formatMessage(messages.feedbacks_controlpanel)}
            </Segment>

            <VFPanelMenu />

            <Segment>
              {itemsSelected.length > 0 && (
                <Message className="selected-items" color="teal">
                  <div className="text">
                    {itemsSelected?.length}{' '}
                    {intl.formatMessage(messages.items_selected)}
                  </div>
                  <div className="actions">
                    <Button
                      color="red"
                      onClick={() => {
                        resetFeedbacks(itemsSelected);
                      }}
                    >
                      {intl.formatMessage(messages.reset_feedbacks)}
                    </Button>
                  </div>
                </Message>
              )}
              {feedbacks?.loading && <Loader active inline="centered" />}
              {feedbacks?.loaded && (
                <>
                  <Form className="search-form">
                    <Input
                      fluid
                      icon="search"
                      value={searchableText}
                      onChange={(e) => {
                        setSearchableText(e.target.value);
                      }}
                      placeholder={intl.formatMessage(messages.filter_title)}
                    />
                  </Form>
                  <Table selectable compact singleLine attached sortable fixed>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell
                          width={1}
                          textAlign="center"
                          verticalAlign="center"
                        >
                          <Checkbox
                            title={intl.formatMessage(messages.select_all)}
                            onChange={(e, o) => {
                              if (o.checked) {
                                setItemsSelected(feedbacks?.result?.items);
                              } else {
                                setItemsSelected([]);
                              }
                            }}
                          />
                        </Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={sort_on === 'title' ? sort_order : null}
                          onClick={() => changeSort('title')}
                          width={4}
                        >
                          {intl.formatMessage(messages.page)}
                        </Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={sort_on === 'vote' ? sort_order : null}
                          onClick={() => changeSort('vote')}
                          textAlign="center"
                        >
                          {intl.formatMessage(messages.vote)}
                        </Table.HeaderCell>
                        <Table.HeaderCell
                          sorted={sort_on === 'last_vote' ? sort_order : null}
                          onClick={() => changeSort('last_vote')}
                          textAlign="center"
                          width={3}
                        >
                          {intl.formatMessage(messages.last_vote)}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                          {intl.formatMessage(messages.comments)}
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {feedbacks.result?.items?.map((item) => (
                        <tr key={item.uid}>
                          <Table.Cell>
                            <Checkbox
                              title={intl.formatMessage(messages.select_item)}
                              label={intl.formatMessage(messages.select_item)}
                              onChange={(e, o) => {
                                if (o.checked) {
                                  let s = [...itemsSelected];
                                  s.push(item);
                                  setItemsSelected(s);
                                } else {
                                  setItemsSelected(
                                    itemsSelected.filter(
                                      (i) => i.url !== item.url,
                                    ),
                                  );
                                }
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <a
                              href={flattenToAppURL(item.url)}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {item.title}
                            </a>
                          </Table.Cell>
                          <Table.Cell textAlign="center">{item.ok}</Table.Cell>
                          <Table.Cell textAlign="center">{item.nok}</Table.Cell>
                          <Table.Cell textAlign="center">
                            {moment(item.last_vote).format(
                              'DD/MM/YYYY HH:mm:ss',
                            )}
                          </Table.Cell>
                          <Table.Cell
                            textAlign="center"
                            className="comments-column"
                          >
                            {item.comments?.length > 0 && (
                              <Button
                                size="mini"
                                onClick={() => {
                                  setViewComments(item);
                                }}
                              >
                                {item.comments.length}
                              </Button>
                            )}
                          </Table.Cell>
                        </tr>
                      ))}
                    </Table.Body>
                  </Table>

                  <div className="contents-pagination">
                    <Pagination
                      current={currentPage}
                      total={Math.ceil(feedbacks?.result?.items_total / b_size)}
                      pageSize={b_size}
                      pageSizes={[50, intl.formatMessage(messages.all)]}
                      onChangePage={(e, p) => {
                        setCurrentPage(p.value);
                      }}
                      onChangePageSize={(e, s) => setB_size(s.value)}
                    />
                  </div>
                </>
              )}
              <FeedbackComments
                item={activeFeedback}
                isOpen={viewComments}
                setIsOpen={setViewComments}
                onClose={() => {
                  setViewComments(false);
                }}
              />
            </Segment>
          </Segment.Group>
          {showConfirmDelete && (
            <Confirm
              cancelButton={intl.formatMessage(messages.cancel)}
              open={showConfirmDelete}
              header={intl.formatMessage(messages.delete_confirm)}
              content={
                <div className="content ui ">
                  {itemsSelected?.map((item, i) => (
                    <div key={item?.uid}>{item.title}</div>
                  ))}
                </div>
              }
              onCancel={() => setShowConfirmDelete(false)}
              onConfirm={async () => {
                await resetSelectedFeedbacks();
                // toastify.toast.error(
                //   <Toast
                //     error
                //     title={intl.formatMessage(messages.error)}
                //     content={intl.formatMessage(
                //       messages.rw_save_search_missing_name,
                //     )}
                //   />,
                // );
              }}
              size="mini"
            />
          )}
        </Container>
      ) : (
        <Unauthorized />
      )}
      {isClient && (
        <Portal node={document.getElementById('toolbar')}>
          <Toolbar pathname={pathname} inner={<span />} />
        </Portal>
      )}
    </>
  );
};
export default injectLazyLibs(['moment'])(VFPanel);
