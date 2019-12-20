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
  const [pageInfo, dispatchPageInfo] = useReducer(
    paginationReducer,
    initialPaginationValues
  );
  const {
    data: { entities, entitiesConnection } = {},
    loading,
    error,
    refetch
  }: QueryResult = useQuery(ENTITIES_CONNECTION_QUERY, {
    variables: pageInfo
  });
  const [deleteEntity] = useMutation(DELETE_ENTITY_MUTATION);

  const total = entitiesConnection?.aggregate?.count || 0;
  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, [total]);

  let dataSource = [] as any;
  if (loading) return <Loading />;

  const deleteRecord = (id: string) => {
    deleteEntity({
      variables: { id },
      update(cache) {
        const oldCount = entitiesConnection.aggregate.count;
        const newCount = oldCount - 1;

        try {
          const data = cache.readQuery({
            query: ENTITIES_CONNECTION_QUERY,
            variables: pageInfo
          }) as any;

          // fetchMore({
          //   query: ENTITIES_CONNECTION_QUERY,
          //   variables: {
          //     first: CONSTANTS.PAGE_SIZE_2,
          //     skip:
          //       newCount % CONSTANTS.PAGE_SIZE_2 === 0
          //         ? newCount - CONSTANTS.PAGE_SIZE_2
          //         : (current - 1) * CONSTANTS.PAGE_SIZE_2
          //   },
          //   updateQuery: (prev, { fetchMoreResult }) => {
          //     if (!fetchMoreResult) return prev;
          //     return fetchMoreResult;
          //   }
          // });

          data.entitiesConnection.aggregate.count = newCount;
          cache.writeQuery({
            query: ENTITIES_CONNECTION_QUERY,
            variables: pageInfo,
            data
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  return (
    <Translate>
      {({ translate }) => {
        if (error) {
          message.error(translate("generic.labels.error"));
        } else {
          dataSource = entities?.edges || [];
        }

        const columns = [
          {
            title: translate("entities.labels.field1"),
            dataIndex: "node.id",
            sorter: true
          },
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
          const payload = {
            current: pagination.current
          } as any;

          if (!_.isEmpty(sorter)) {
            const orderBy = sorter.order
              ? `${sorter.field.replace(
                  "node.",
                  ""
                )}_${CONSTANTS.ORDER_ANTD_TABLE_ORDER_MAP.get(sorter.order)}`
              : undefined;
            payload.orderBy = orderBy;
          }

          dispatchPageInfo({ type: "page", payload });
        };

        return (
          <PaginationFilterTable
            columns={columns}
            keyId="node.id"
            dataSource={dataSource}
            pagination={{
              ...pageInfo,
              total
            }}
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
