import { Button, Icon, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult, TableCurrentDataSource } from 'antd/lib/table';
import _ from 'lodash';
import React, { memo } from 'react';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';

import { RecordActions } from '../../interfaces';

interface Props<T> {
  columns: ColumnProps<T>[];
  dataSource: T[];
  pagination: PaginationConfig | false;
  onChange: (
    pagination: PaginationConfig,
    filters: Record<keyof T, string[]>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>
  ) => void;
  keyId: string;
  actions?: RecordActions;
  urlNew?: String;
}

const PaginationFilterTable: React.FC<Props<any>> = ({
  columns,
  dataSource,
  pagination,
  onChange,
  keyId,
  actions,
  urlNew
}) => {
  const getRecordId = (record: any) => {
    const split = keyId.split(".");
    let recordId = record[split[0]];
    for (const index of split.slice(1)) {
      recordId = recordId[index];
    }
    return recordId;
  };

  return (
    <Translate>
      {({ translate }) => {
        if (!_.isEmpty(actions)) {
          columns.push({
            title: translate("generic.labels.actions"),
            render: (record: any) =>
              renderActions(record, getRecordId(record), actions),
            width: "10%",
            align: "center" as const
          });
        }

        return (
          <>
            <Table
              columns={columns}
              rowKey={getRecordId}
              dataSource={dataSource}
              pagination={pagination}
              onChange={onChange}
            />
            {urlNew && (
              <Link to={urlNew as string}>
                <Button
                  className="float"
                  type="primary"
                  shape="circle"
                  icon="plus"
                />
              </Link>
            )}
          </>
        );
      }}
    </Translate>
  );
};

const renderActions = (
  record: any,
  recordId: String | Number,
  actions: RecordActions | undefined
) => {
  return (
    <Translate>
      {({ translate }) => {
        const onClickDelete = (id: String | Number) => {
          Modal.confirm({
            title: translate("generic.labels.delete"),
            content: translate("generic.modals.delete"),
            okText: translate("generic.labels.yes"),
            cancelText: translate("generic.labels.no"),
            onOk: () => {
              return actions?.onClickDelete ? actions.onClickDelete(id) : {};
            },
            onCancel: () => {}
          });
        };

        return (
          <>
            {actions?.edit && (
              <Link
                to={_.replace(
                  actions?.editRedirection || "",
                  ":id",
                  recordId as string
                )}
              >
                <Icon
                  type="edit"
                  title={translate("generic.labels.edit") as string}
                />
              </Link>
            )}
            {actions?.delete && (
              <Button
                type="link"
                icon="delete"
                onClick={() => onClickDelete(recordId)}
                title={translate("generic.labels.delete") as string}
              />
            )}
          </>
        );
      }}
    </Translate>
  );
};

export default memo(PaginationFilterTable);
