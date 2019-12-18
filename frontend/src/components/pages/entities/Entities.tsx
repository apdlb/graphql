import { Icon, message } from 'antd';
import { PaginationConfig, SorterResult, TableStateFilters } from 'antd/lib/table';
import _ from 'lodash';
import React, { memo, useEffect, useReducer } from 'react';
import { QueryResult, useMutation, useQuery } from 'react-apollo';
import { Translate } from 'react-localize-redux';

import { DELETE_ENTITY_MUTATION, ENTITIES_CONNECTION_QUERY } from '../../../graphql/entities';
import { initialPaginationValues, paginationReducer } from '../../../reducers/paginationReducer';
import CONSTANTS from '../../../utils/constants';
import PATHS from '../../../utils/paths';
import Loading from '../../shared/Loading';
import PaginationFilterTable from '../../shared/PaginationFilterTable';

const Entities: React.FC = () => {
  const [pagination, dispatchPagination] = useReducer(
    paginationReducer,
    initialPaginationValues
  );

  const { loading, error, data, refetch }: QueryResult = useQuery(
    ENTITIES_CONNECTION_QUERY,
    {
      variables: pagination
    }
  );
  const [deleteEntity] = useMutation(DELETE_ENTITY_MUTATION);

  const count = data?.entitiesConnection?.aggregate?.count || 0;
  useEffect(() => {
    dispatchPagination({
      type: "total",
      payload: count
    });
  }, [count]);

  let entities = [] as any;
  if (loading) return <Loading />;

  const deleteRecord = (id: string) => {
    deleteEntity({ variables: { id } }).then(() => {
      const total = pagination.total - 1;
      let current = pagination.current;
      let skip = pagination.skip;

      if (total % pagination.pageSize === 0) {
        current = current - 1;
        skip = skip - pagination.pageSize;
      }

      const newPagination = { ...pagination, current, skip, total };
      refetch(newPagination).then(() => {
        dispatchPagination({
          type: "deleteRecord",
          payload: { current, skip, total }
        });
      });
    });
  };

  return (
    <Translate>
      {({ translate }) => {
        if (error) {
          message.error(translate("generic.labels.error"));
        } else {
          entities = data?.entitiesConnection?.edges || [];
        }

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
