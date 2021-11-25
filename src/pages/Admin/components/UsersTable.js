import React, { useCallback, useContext, useMemo } from "react";

import { UserContext } from "../../../context/User/userContext";
import { usaStatesAbbr } from "../../../helpers/constants";
import { usaOption, userRoles } from "../state/constants";
import LoadingContainer from "../../../components/common/LoadingContainer/LoadingContainer";
import Table from "../../../components/common/Tables/Table/Table";
import Dropdown from "../../../components/common/Controls/Dropdown/Dropdown";
import Select from "./SelectInput";

const UsersTable = () => {
  const {
    state: { users, loading, loadingText },
    editUsers,
    deleteUser,
  } = useContext(UserContext);

  const actions = [
    {
      title: "Delete",
      handler: ({ _id }) => {
        deleteUser(_id);
      },
    },
  ];

  const columns = useMemo(
    () => [
      { key: "email", label: "Email" },
      { key: "username", label: "Username" },
      {
        key: "role",
        label: "Role",
        cell: ({ cellData, rowData, column, onChangeRow }) => (
          <Select
            classes={"border uk-border-pill"}
            value={cellData}
            options={userRoles}
            onChange={(value) => onChangeRow({ ...rowData, [column]: value })}
          />
        ),
      },
      {
        key: "location",
        label: "Location",
        cell: ({ cellData, rowData, column, onChangeRow }) => (
          <Select
            classes={"border uk-border-pill"}
            value={cellData}
            options={[usaOption, ...usaStatesAbbr]}
            onChange={(value) => onChangeRow({ ...rowData, [column]: value })}
          />
        ),
      },
      {
        key: "actions",
        classes: "uk-flex uk-flex-left uk-flex-right@m uk-flex-bottom",
        cell: ({ rowData }) => <Dropdown data={rowData} items={actions} />,
      },
    ],
    [actions]
  );

  const submitChanges = useCallback(
    ({ data, onSubmit }) => {
      editUsers(data.modified);
      onSubmit();
    },
    [editUsers]
  );

  const cancelChanges = useCallback(({ onCancel }) => onCancel(), []);

  const controls = [
    { classes: "btn--blue-bg", text: "Submit", onClick: submitChanges },
    { classes: "btn--pink-bg", text: "Cancel", onClick: cancelChanges },
  ];

  return (
    <LoadingContainer loading={loading} loadingText={loadingText}>
      {users.length && (
        <Table data={users} columns={columns} controls={controls} />
      )}
    </LoadingContainer>
  );
};

export default UsersTable;
