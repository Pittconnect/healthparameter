import React from "react";
import clsx from "clsx";

import LoadingContainer from "../../../../components/common/LoadingContainer/LoadingContainer";
import ContainerFormInputs from "./ContainerFormInputs";
import ContainerFormButtons from "./ContainerFormButtons";

const FormContainer = ({
  error,
  loading,
  loadingText,
  header,
  inputs,
  buttons,
  inputSpacing,
  onSubmit,
}) => {
  return (
    <LoadingContainer loading={loading} loadingText={loadingText}>
      <div
        className={clsx(
          "uk-flex uk-flex-column uk-background-default form uk-padding-small uk-border-rounded"
        )}
      >
        {/* <span
      className={clsx(
        "uk-flex uk-alert-danger uk-width-1-1 uk-margin-small uk-padding-small uk-text-default uk-text-center uk-text-left@s",
        {
          "uk-invisible uk-hidden-touch": !error,
        }
      )}
      uk-alert=""
    >
      {error}
    </span> */}
        <div className="uk-heading-small uk-margin-small">{header}</div>

        {(inputs || buttons) && (
          <form className="form__container" onSubmit={onSubmit}>
            {inputs && (
              <ContainerFormInputs inputs={inputs} spacing={inputSpacing} />
            )}
            {buttons && <ContainerFormButtons buttons={buttons} />}
          </form>
        )}
      </div>
    </LoadingContainer>
  );
};

export default FormContainer;
