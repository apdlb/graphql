import { Button, Icon, message, Spin, Table } from 'antd';
import { PaginationConfig, SorterResult, TableStateFilters } from 'antd/lib/table';
import gql from 'graphql-tag';
import _ from 'lodash';
import React, { memo, useReducer } from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';

import PATHS from '../../../utils/paths';

const ENTITIES_QUERY = gql`
  query EntitiesConnection($current: Int, $pageSize: Int) {
    entitiesConnection(skip: $current, first: $pageSize) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          field1
          field2
          field3
        }
        cursor
      }
      aggregate {
        count
      }
    }
  }
`;

const Entities: React.FC = () => {
  const initialValues = {
    current: 0,
    pageSize: 10,
    total: 0
  };
  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "load":
        return action.payload;
      case "page":
        return { ...state, current: action.payload };
      default:
        throw new Error();
    }
  };
  const [pagination, dispatch] = useReducer(reducer, initialValues);

  return (
    <Translate>
      {({ translate }) => {
        return (
          <>
            <Query query={ENTITIES_QUERY} variables={pagination}>
              {({ loading, error, data }: QueryResult) => {
                let entities = [];
                if (loading)
                  return (
                    <Spin size="large" indicator={<Icon type="loading" />} />
                  );
                if (error) {
                  message.error("An error has occurred");
                } else {
                  entities = data?.entitiesConnection?.edges || [];
                }

                console.log(data);

                const columns = [
                  {
                    title: translate("entities.labels.field1"),
                    dataIndex: "node.field1",
                    sorter: true
                  },
                  {
                    title: translate("entities.labels.field2"),
                    dataIndex: "node.field2",
                    sorter: true
                  },
                  {
                    title: translate("entities.labels.field3"),
                    dataIndex: "node.field3",
                    render: (field3: boolean) => (
                      <Icon type={field3 ? "check" : "close"} />
                    )
                  },
                  {
                    title: translate("generic.labels.actions"),
                    render: (record: any) =>
                      renderActions({ record, onClickDelete: () => {} }),
                    width: "10%",
                    align: "center" as const
                  }
                ];

                const handleOnChange = (
                  pagination: PaginationConfig,
                  filters: TableStateFilters,
                  sorter: SorterResult<any>
                ) => {
                  dispatch({ type: "page", payload: pagination.current });
                };

                return (
                  <>
                    <Table
                      columns={columns}
                      rowKey={(record: any) => record.node.id}
                      dataSource={entities}
                      pagination={pagination}
                      onChange={handleOnChange}
                    />
                    <Link to={PATHS.ENTITIES_NEW}>
                      <Button
                        className="float"
                        type="primary"
                        shape="circle"
                        icon="plus"
                      />
                    </Link>
                  </>
                );
              }}
            </Query>
          </>
        );
      }}
    </Translate>
  );
};

const renderActions = ({ record, onClickDelete }: any) => {
  return (
    <Translate>
      {({ translate }) => {
        return (
          <>
            <Link to={_.replace(PATHS.ENTITIES_ID, ":id", record._id)}>
              <Icon
                type="edit"
                title={translate("generic.labels.edit") as string}
              />
            </Link>
            <Button
              type="link"
              icon="delete"
              onClick={() => onClickDelete(record._id)}
              title={translate("generic.labels.delete") as string}
            />
          </>
        );
      }}
    </Translate>
  );
};

export default memo(Entities);
