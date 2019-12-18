import { Button, Icon, message, Spin, Table } from 'antd';
import { PaginationConfig, SorterResult, TableStateFilters } from 'antd/lib/table';
import _ from 'lodash';
import React, { memo, useEffect, useReducer } from 'react';
import { QueryResult, useQuery } from 'react-apollo';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';

import { ENTITIES_CONNECTION_QUERY } from '../../../graphql/entities';
import CONSTANTS from '../../../utils/constants';
import PATHS from '../../../utils/paths';

const Entities: React.FC = () => {
  const [pagination, dispatchPagination] = useReducer(reducer, initialValues);

  const { loading, error, data }: QueryResult = useQuery(
    ENTITIES_CONNECTION_QUERY,
    {
      variables: pagination
    }
  );

  const count = data?.entitiesConnection?.aggregate?.count || 0;
  useEffect(() => {
    dispatchPagination({
      type: "total",
      payload: count
    });
  }, [count]);

  let entities = [] as any;
  if (loading) return <Spin size="large" indicator={<Icon type="loading" />} />;
  if (error) {
    message.error("An error has occurred");
  } else {
    entities = data?.entitiesConnection?.edges || [];
  }

  return (
    <Translate>
      {({ translate }) => {
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
          console.log(sorter);
          if (!_.isEmpty(sorter)) {
            const orderBy = sorter.order
              ? `${sorter.field.replace(
                  "node.",
                  ""
                )}_${CONSTANTS.ORDER_ANTD_TABLE_ORDER_MAP.get(sorter.order)}`
              : undefined;
            dispatchPagination({
              type: "sort",
              payload: orderBy
            });
          }

          dispatchPagination({
            type: "page",
            payload: pagination.current
          });
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
    </Translate>
  );
};

const initialValues = {
  skip: 0,
  orderBy: `id_${CONSTANTS.ORDER_ASC}`,
  current: 1,
  pageSize: CONSTANTS.PAGE_SIZE_5,
  total: 0
};
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "total":
      return { ...state, total: action.payload };
    case "sort":
      if (action.payload) {
        return { ...state, orderBy: action.payload };
      } else {
        const { orderBy, ...rest } = state;
        return rest;
      }
    case "page":
      return {
        ...state,
        current: action.payload,
        skip: action.payload * state.pageSize - state.pageSize
      };
    default:
      throw Error();
  }
};

const renderActions = ({ record, onClickDelete }: any) => {
  return (
    <Translate>
      {({ translate }) => {
        return (
          <>
            <Link to={_.replace(PATHS.ENTITIES_ID, ":id", record.node.id)}>
              <Icon
                type="edit"
                title={translate("generic.labels.edit") as string}
              />
            </Link>
            <Button
              type="link"
              icon="delete"
              onClick={() => onClickDelete(record.node.id)}
              title={translate("generic.labels.delete") as string}
            />
          </>
        );
      }}
    </Translate>
  );
};

export default memo(Entities);
