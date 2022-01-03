import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { upsert } from "../../../../utils/arrays";

const Table = ({ title, data, columns, controls }) => {
  const [tableData, setTableData] = useState([...data]);
  const [modifiedItems, setModifiedItems] = useState([]);

  const onChangeRow = (updatedItem) => {
    const upsertById = (array) => [
      ...upsert(array, ({ _id }) => _id === updatedItem._id, updatedItem),
    ];

    setTableData(upsertById);
    setModifiedItems(upsertById);
  };

  const onSubmit = () => {
    setModifiedItems([]);
  };
  const onCancel = () => {
    setTableData([...data]);
    setModifiedItems([]);
  };

  useEffect(() => {
    setTableData([...data]);
  }, [data]);

  return (
    <div className="table-wrapper uk-background-default uk-border-rounded uk-padding-small uk-overflow-hidden">
      <div className="uk-margin-small">
        <div className="uk-heading-small">{title}</div>
      </div>

      <div className="grid">
        <div className="grid__row">
          <div className="grid__col bg-white">
            <div className="table table--18">
              <div className="table__header">
                <div className="table__row">
                  {columns.map(({ key, label }) => (
                    <div key={key} className="table__cell uk-text-truncate">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              {!tableData.length ? (
                <div className="uk-flex uk-flex-1 uk-flex-center uk-flex-middle">
                  No users to display
                </div>
              ) : (
                <div className="table__body">
                  {tableData.map((item) => (
                    <div key={item._id} className="table__row">
                      {columns.map(({ key, cell, classes }) => (
                        <div
                          key={key}
                          className={clsx("table__cell uk-text-truncate", {
                            [classes]: classes,
                          })}
                        >
                          {cell
                            ? cell({
                                cellData: item[key],
                                rowData: item,
                                column: key,
                                onChangeRow,
                              })
                            : item[key]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="table-controls uk-grid uk-grid-column-small uk-grid-row-collapse uk-child-width-auto"
        uk-grid=""
      >
        {controls.map(({ text, classes, onClick }, idx) => (
          <div key={idx}>
            <button
              className={clsx(`form__submit btn ${classes} uk-margin-remove`, {
                disabled: !modifiedItems.length,
              })}
              disabled={!modifiedItems.length}
              onClick={() =>
                onClick({
                  data: {
                    original: data,
                    modified: modifiedItems,
                  },
                  onSubmit,
                  onCancel,
                })
              }
            >
              {text}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
