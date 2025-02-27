import React, { useState, useEffect, useMemo } from 'react';
import { Portal } from 'react-portal';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Confirm,
  Segment,
  Checkbox,
  Button,
  Table,
  Loader,
  Form,
  Input,
  Message,
  Dimmer,
  Icon as SIcon,
} from 'semantic-ui-react';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import Pagination from '@plone/volto/components/theme/Pagination/Pagination';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Unauthorized from '@plone/volto/components/theme/Unauthorized/Unauthorized';
import Toast from '@plone/volto/components/manage/Toast/Toast';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import { FeedbackComments } from 'volto-feedback/components/manage';
import {
  getFeedbacks,
  deleteFeedback,
  resetDeleteFeedback,
} from 'volto-feedback/actions';
import { VFPanelMenu } from 'volto-feedback/components/manage';
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
  sorting_button: {
    id: 'sorting_button',
    defaultMessage:
      'Sorting Button: Click to arrange items in this column. {sort}',
  },
  ascending: {
    id: 'ascending',
    defaultMessage: 'Ascending',
  },
  descending: {
    id: 'descending',
    defaultMessage: 'Descending',
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
    defaultMessage: 'Are you sure you want to reset the following feedbacks?',
  },
  error: {
    id: 'feedbacks_error',
    defaultMessage: 'An error has occurred',
  },
  success: {
    id: 'feedbacks_success',
    defaultMessage: 'Success',
  },
  delete_success: {
    id: 'feedbacks_delete_success',
    defaultMessage: 'Selected feedbacks deleted successfully!',
  },
  delete_error: {
    id: 'feedbacks_delete_error',
    defaultMessage:
      'An error has occurred while trying to delete feedbacks for {element}',
  },
  cancel: {
    id: 'feedbacks_cancel_delete',
    defaultMessage: 'Cancel',
  },
  no_results: {
    id: 'feedbacks_no_results',
    defaultMessage: 'No results found',
  },
  loading: {
    id: 'feedbacks_loading',
    defaultMessage: 'Loading...',
  },
  filter_unread: {
    id: 'feedbacks_comments_filter_unread',
    defaultMessage: 'Show comments to read.',
  },
});
const VFPanel = ({ moment: Moment, toastify }) => {
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

  const [filters, setFilters] = useState({ text: '' });
  const [isClient, setIsClient] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [itemsSelected, setItemsSelected] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters({ ...filters, text: searchableText });
      // Send Axios request here
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchableText]);

  const feedbacks = useSelector((state) => state.getFeedbacks);
  const can_delete_feedbacks = useSelector(
    (state) =>
      state.getFeedbacks.result?.actions?.can_delete_feedbacks ?? false,
  );

  const isUnauthorized = useMemo(
    () => feedbacks?.error && feedbacks?.error?.status === 401,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feedbacks?.error],
  );

  const deleteFeedbackState = useSelector((state) => state?.deleteFeedback);

  const deleteFeedbackEnd = deleteFeedbackState?.delete?.loaded;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const doSearch = () => {
    return dispatch(
      getFeedbacks({
        b_size: isNaN(b_size) ? 10000000 : b_size,
        b_start: currentPage * (isNaN(b_size) ? 10000000 : b_size),
        sort_on,
        sort_order,
        title:
          filters.text && filters.text.length > 0 ? filters.text + '*' : null,
        has_unread: filters.has_unread,
      }),
    );
  };

  useEffect(() => {
    doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b_size, currentPage, sort_on, sort_order, filters]);

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
      await dispatch(deleteFeedback(itemsSelected));
      setShowConfirmDelete(false);
      toastify.toast.success(
        <Toast
          success
          title={intl.formatMessage(messages.success)}
          content={intl.formatMessage(messages.delete_success)}
        />,
      );
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
    if (deleteFeedbackEnd) {
      doSearch().then(() => {
        setItemsSelected([]);
      });
      dispatch(resetDeleteFeedback());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFeedbackEnd]);

  // Semantic table ordering is the exact opposite of Plone
  // ordering and it drove me nuts
  const fixSemanticOrdering = () =>
    sort_order === 'ascending' ? 'descending' : 'ascending';

  return (
    <>
      {!isUnauthorized ? (
        <Container id="page-feedbacks" className="controlpanel-feedbacks">
          <Helmet title={intl.formatMessage(messages.feedbacks_controlpanel)} />
          <Segment.Group raised>
            <Segment className="primary">
              {intl.formatMessage(messages.feedbacks_controlpanel)}
            </Segment>

            <VFPanelMenu
              doSearch={doSearch}
              can_delete_feedbacks={can_delete_feedbacks}
            />

            <Segment>
              {itemsSelected.length > 0 && (
                <Message className="selected-items" color="teal" role="alert">
                  <div className="text">
                    {itemsSelected?.length}{' '}
                    {intl.formatMessage(messages.items_selected)}
                  </div>
                  <div className="actions">
                    {can_delete_feedbacks && (
                      <Button
                        type="button"
                        color="red"
                        onClick={() => setShowConfirmDelete(true)}
                      >
                        {intl.formatMessage(messages.reset_feedbacks)}
                      </Button>
                    )}
                  </div>
                </Message>
              )}
              <Form className="search-form">
                <div className="search-filter">
                  <Input
                    fluid
                    icon="search"
                    value={searchableText}
                    onChange={(e) => {
                      setSearchableText(e.target.value);
                    }}
                    placeholder={intl.formatMessage(messages.filter_title)}
                  />
                </div>
                <div className="search-filter read">
                  <Checkbox
                    slider
                    label={intl.formatMessage(messages.filter_unread)}
                    onChange={(e, data) =>
                      setFilters({
                        ...filters,
                        has_unread: data.checked === true ? true : null,
                      })
                    }
                    checked={filters.has_unread}
                  />
                </div>
              </Form>
              <Table
                selectable
                compact
                singleLine
                attached
                sortable
                fixed
                striped
              >
                <Table.Header>
                  <Table.Row>
                    {can_delete_feedbacks && (
                      <Table.HeaderCell
                        width={1}
                        textAlign="center"
                        verticalAlign="middle"
                      >
                        <Checkbox
                          title={intl.formatMessage(messages.select_all)}
                          checked={
                            feedbacks?.result?.items?.length !== 0 &&
                            itemsSelected?.length ===
                              feedbacks?.result?.items?.length
                          }
                          onChange={(e, o) => {
                            if (o.checked) {
                              setItemsSelected(feedbacks?.result?.items);
                            } else {
                              setItemsSelected([]);
                            }
                          }}
                        />
                      </Table.HeaderCell>
                    )}
                    <Table.HeaderCell
                      sorted={
                        sort_on === 'title' ? fixSemanticOrdering() : null
                      }
                      width={4}
                    >
                      <Button
                        type="button"
                        basic
                        onClick={() => {
                          changeSort('title');
                        }}
                        aria-description={intl.formatMessage(
                          messages.sorting_button,
                          {
                            sort:
                              sort_on === 'title'
                                ? sort_order === 'ascending'
                                  ? intl.formatMessage(messages.ascending)
                                  : intl.formatMessage(messages.descending)
                                : '',
                          },
                        )}
                      >
                        {intl.formatMessage(messages.page)}
                      </Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={sort_on === 'vote' ? fixSemanticOrdering() : null}
                      textAlign="center"
                    >
                      <Button
                        type="button"
                        basic
                        onClick={() => {
                          changeSort('vote');
                        }}
                        aria-description={intl.formatMessage(
                          messages.sorting_button,
                          {
                            sort:
                              sort_on === 'vote'
                                ? sort_order === 'ascending'
                                  ? intl.formatMessage(messages.ascending)
                                  : intl.formatMessage(messages.descending)
                                : '',
                          },
                        )}
                      >
                        {intl.formatMessage(messages.vote)}
                      </Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={
                        sort_on === 'last_vote' ? fixSemanticOrdering() : null
                      }
                      textAlign="center"
                      width={3}
                    >
                      <Button
                        type="button"
                        basic
                        onClick={() => {
                          changeSort('last_vote');
                        }}
                        aria-description={intl.formatMessage(
                          messages.sorting_button,
                          {
                            sort:
                              sort_on === 'last_vote'
                                ? sort_order === 'ascending'
                                  ? intl.formatMessage(messages.ascending)
                                  : intl.formatMessage(messages.descending)
                                : '',
                          },
                        )}
                      >
                        {intl.formatMessage(messages.last_vote)}
                      </Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      textAlign="center"
                      sorted={
                        sort_on === 'comments' ? fixSemanticOrdering() : null
                      }
                    >
                      <Button
                        type="button"
                        basic
                        onClick={() => {
                          changeSort('comments');
                        }}
                        aria-description={intl.formatMessage(
                          messages.sorting_button,
                          {
                            sort:
                              sort_on === 'comments'
                                ? sort_order === 'ascending'
                                  ? intl.formatMessage(messages.ascending)
                                  : intl.formatMessage(messages.descending)
                                : '',
                          },
                        )}
                      >
                        {intl.formatMessage(messages.comments)}
                      </Button>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {feedbacks?.loaded &&
                    feedbacks.result?.items?.map((item) => (
                      <tr key={item.uid}>
                        {can_delete_feedbacks && (
                          <Table.Cell textAlign="center">
                            <Checkbox
                              title={intl.formatMessage(messages.select_item)}
                              checked={itemsSelected.some(
                                (is) => is.url === item.url,
                              )}
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
                        )}
                        <Table.Cell>
                          {item.url ? (
                            <a
                              href={flattenToAppURL(item.url)}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {item.title}
                            </a>
                          ) : (
                            <span>{item.title}</span>
                          )}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <SIcon name="star" />
                          {parseFloat(item.vote).toFixed(1)}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {moment(item.last_vote).format('DD/MM/YYYY HH:mm:ss')}
                        </Table.Cell>
                        <Table.Cell
                          textAlign="center"
                          className="comments-column"
                        >
                          {item.comments && <FeedbackComments item={item} />}
                        </Table.Cell>
                      </tr>
                    ))}
                </Table.Body>
              </Table>
              {feedbacks?.loading && <Loader active inline="centered" />}
              {feedbacks?.result?.items?.length === 0 && (
                <div className="no-results">
                  {intl.formatMessage(messages.no_results)}
                </div>
              )}

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
            </Segment>
          </Segment.Group>
          {showConfirmDelete && (
            <Confirm
              role="dialog"
              aria-modal="true"
              cancelButton={intl.formatMessage(messages.cancel)}
              open={showConfirmDelete}
              header={intl.formatMessage(messages.confirm_delete_selected)}
              content={
                <div className="content ui ">
                  {deleteFeedbackState?.loading && !deleteFeedbackEnd && (
                    <Dimmer active>
                      <Loader inverted inline="centered" size="large">
                        {intl.formatMessage(messages.loading)}
                      </Loader>
                    </Dimmer>
                  )}
                  {!deleteFeedbackState?.loading &&
                    itemsSelected?.map((item, i) => (
                      <div className="confirm-delete-item" key={item?.uid}>
                        {item.title}
                      </div>
                    ))}
                </div>
              }
              onCancel={() => setShowConfirmDelete(false)}
              onConfirm={async () => {
                await resetSelectedFeedbacks();
              }}
              size="small"
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
export default injectLazyLibs(['moment', 'toastify'])(VFPanel);
