import { Icon, message, Spin } from 'antd';
import { PaginationConfig, SorterResult, TableStateFilters } from 'antd/lib/table';
import _ from 'lodash';
import React, { memo, useEffect, useReducer } from 'react';
import { QueryResult, useQuery } from 'react-apollo';
import { Translate } from 'react-localize-redux';

import { ENTITIES_CONNECTION_QUERY } from '../../../graphql/entities';
import { initialPaginationValues, paginationReducer } from '../../../reducers/paginationReducer';
import CONSTANTS from '../../../utils/constants';
import PATHS from '../../../utils/paths';
import PaginationFilterTable from '../../shared/PaginationFilterTable';

const Entities: React.FC = () => {
  const [pagination, dispatchPagination] = useReducer(
    paginationReducer,
    initialPaginationValues
  );

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

  const deleteRecord = (id: string) => {
    console.log(id);
  };

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
          }
        ];

        const handleOnChange = (
          pagination: PaginationConfig,
          filters: TableStateFilters,
          sorter: SorterResult<any>
        ) => {
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
          <PaginationFilterTable
            columns={columns}
            keyId="node.id"
            dataSource={entities}
            pagination={pagination}
            onChange={handleOnChange}
            actions={{
              edit: true,
              editRedirection: PATHS.ENTITIES_ID,
              delete: true,
              onClickDelete: deleteRecord
            }}
            urlNew={PATHS.ENTITIES_NEW}
          />
        );
      }}
    </Translate>
  );
};

export default memo(Entities);
