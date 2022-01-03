import React, { Fragment } from "react";
import { useLatestWhen } from "../hooks/useLatestWhen";

const showCount = 10;

const triangleSize = 7;

const getBackgroundColor = (dark) =>
  dark ? "rgba(255,255,255,.9)" : "rgba(0, 26, 39, 0.9)";

export default function tooltipRenderer(props) {
  return <TooltipRenderer {...props} />;
}

const TooltipRenderer = (props) => {
  // console.log('props: ', props);
  const latestFit = useLatestWhen(props.anchor.fit, !!props.anchor.fit);

  if (!props.focusedDatum) {
    return null;
  }

  const { primaryAxis, secondaryAxis, getDatumStyle, focusedDatum } = props;

  const { tooltip, dark } = props.getOptions();

  const groupDatums = props.focusedDatum?.tooltipGroup ?? [];

  const resolvedShowCount = showCount % 2 === 0 ? showCount : showCount + 1;
  const length = groupDatums.length;

  const activeIndex = groupDatums.findIndex((d) => d === focusedDatum);

  let start = activeIndex > -1 ? activeIndex - resolvedShowCount / 2 : 0;
  start = Math.max(start, 0);

  let end = activeIndex > -1 ? start + resolvedShowCount : length;
  end = Math.min(end, length);

  start = Math.max(end - resolvedShowCount, 0);

  const visibleSortedGroupDatums = groupDatums.slice(start, end);
  const hasPrevious = start > 0;
  const hasNext = end < length;

  const finalAlign = `${latestFit?.side}-${latestFit?.align}`;

  let arrowPosition;
  let triangleStyles;

  if (!arrowPosition) {
    if (finalAlign === "left-center") {
      arrowPosition = "right";
    } else if (finalAlign === "right-center") {
      arrowPosition = "left";
    } else if (finalAlign === "top-center") {
      arrowPosition = "bottom";
    } else if (finalAlign === "bottom-center") {
      arrowPosition = "top";
    } else if (finalAlign === "right-start") {
      arrowPosition = "bottomLeft";
    } else if (finalAlign === "right-end") {
      arrowPosition = "topLeft";
    } else if (finalAlign === "left-start") {
      arrowPosition = "bottomRight";
    } else if (finalAlign === "left-end") {
      arrowPosition = "topRight";
    }
  }

  const backgroundColor = getBackgroundColor(dark);

  if (arrowPosition === "bottom") {
    triangleStyles = {
      top: "100%",
      left: "50%",
      transform: "translate3d(-50%, 0%, 0)",
      borderLeft: `${triangleSize * 0.8}px solid transparent`,
      borderRight: `${triangleSize * 0.8}px solid transparent`,
      borderTop: `${triangleSize}px solid ${backgroundColor}`,
    };
  } else if (arrowPosition === "top") {
    triangleStyles = {
      top: "0%",
      left: "50%",
      transform: "translate3d(-50%, -100%, 0)",
      borderLeft: `${triangleSize * 0.8}px solid transparent`,
      borderRight: `${triangleSize * 0.8}px solid transparent`,
      borderBottom: `${triangleSize}px solid ${backgroundColor}`,
    };
  } else if (arrowPosition === "right") {
    triangleStyles = {
      top: "50%",
      left: "100%",
      transform: "translate3d(0%, -50%, 0)",
      borderTop: `${triangleSize * 0.8}px solid transparent`,
      borderBottom: `${triangleSize * 0.8}px solid transparent`,
      borderLeft: `${triangleSize}px solid ${backgroundColor}`,
    };
  } else if (arrowPosition === "left") {
    triangleStyles = {
      top: "50%",
      left: "0%",
      transform: "translate3d(-100%, -50%, 0)",
      borderTop: `${triangleSize * 0.8}px solid transparent`,
      borderBottom: `${triangleSize * 0.8}px solid transparent`,
      borderRight: `${triangleSize}px solid ${backgroundColor}`,
    };
  } else if (arrowPosition === "topRight") {
    triangleStyles = {
      top: "0%",
      left: "100%",
      transform: "translate3d(-50%, -50%, 0) rotate(-45deg)",
      borderTop: `${triangleSize * 0.8}px solid transparent`,
      borderBottom: `${triangleSize * 0.8}px solid transparent`,
      borderLeft: `${triangleSize * 2}px solid ${backgroundColor}`,
    };
  } else if (arrowPosition === "bottomRight") {
    triangleStyles = {
      top: "100%",
      left: "100%",
      transform: "translate3d(-50%, -50%, 0) rotate(45deg)",
      borderTop: `${triangleSize * 0.8}px solid transparent`,
      borderBottom: `${triangleSize * 0.8}px solid transparent`,
      borderLeft: `${triangleSize * 2}px solid ${backgroundColor}`,
    };
  } else if (arrowPosition === "topLeft") {
    triangleStyles = {
      top: "0%",
      left: "0%",
      transform: "translate3d(-50%, -50%, 0) rotate(45deg)",
      borderTop: `${triangleSize * 0.8}px solid transparent`,
      borderBottom: `${triangleSize * 0.8}px solid transparent`,
      borderRight: `${triangleSize * 2}px solid ${backgroundColor}`,
    };
  } else if (arrowPosition === "bottomLeft") {
    triangleStyles = {
      top: "100%",
      left: "0%",
      transform: "translate3d(-50%, -50%, 0) rotate(-45deg)",
      borderTop: `${triangleSize * 0.8}px solid transparent`,
      borderBottom: `${triangleSize * 0.8}px solid transparent`,
      borderRight: `${triangleSize * 2}px solid ${backgroundColor}`,
    };
  } else {
    triangleStyles = {
      opacity: 0,
    };
  }

  return (
    <div
      style={{
        position: "relative",
        fontSize: "10px",
        padding: "5px",
        background: getBackgroundColor(dark),
        color: dark ? "black" : "white",
        borderRadius: "3px",
      }}
    >
      <div
        style={{ position: "absolute", width: 0, height: 0, ...triangleStyles }}
      />
      <div>
        <div style={{ marginBottom: "3px", textAlign: "center" }}>
          {tooltip.groupingMode === "series" ? (
            <strong>{focusedDatum.seriesLabel}</strong>
          ) : tooltip.groupingMode === "secondary" ? (
            <strong>
              {secondaryAxis.formatters.tooltip(focusedDatum.secondaryValue)}
            </strong>
          ) : (
            <strong>
              {primaryAxis.formatters.tooltip(focusedDatum.primaryValue)}
            </strong>
          )}
        </div>
        <table
          style={{
            whiteSpace: "nowrap",
          }}
        >
          <tbody>
            {hasPrevious ? (
              <tr
                style={{
                  opacity: 0.8,
                }}
              >
                <td />
                <td>...</td>
                <td />
              </tr>
            ) : null}
            {visibleSortedGroupDatums.map((sortedDatum, i) => {
              const active = sortedDatum === focusedDatum;

              return (
                <tr
                  key={i}
                  style={{
                    opacity: active ? 1 : 0.8,
                    fontWeight: active ? "bold" : undefined,
                  }}
                >
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14">
                      <circle
                        cx="7"
                        cy="7"
                        r="5"
                        style={{
                          ...getDatumStyle(sortedDatum),
                          stroke: dark ? "black" : "white",
                          strokeWidth: active ? 2 : 1,
                        }}
                      />
                    </svg>
                  </td>
                  {tooltip.groupingMode === "series" ? (
                    <Fragment>
                      <td>
                        {primaryAxis.formatters.tooltip(
                          sortedDatum.primaryValue
                        )}
                        : &nbsp;
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                        }}
                      >
                        {secondaryAxis.formatters.tooltip(
                          sortedDatum.secondaryValue
                        )}
                      </td>
                    </Fragment>
                  ) : tooltip.groupingMode === "secondary" ? (
                    <Fragment>
                      <td>{sortedDatum.seriesLabel}: &nbsp;</td>
                      <td
                        style={{
                          textAlign: "right",
                        }}
                      >
                        {primaryAxis.formatters.tooltip(
                          sortedDatum.primaryValue
                        )}
                      </td>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td style={{ verticalAlign: "middle" }}>
                        {sortedDatum.seriesLabel}: &nbsp;
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          textAlign: "right",
                        }}
                      >
                        {secondaryAxis.formatters.tooltip(
                          sortedDatum.secondaryValue
                        )}
                      </td>
                    </Fragment>
                  )}
                </tr>
              );
            })}
            {hasNext ? (
              <tr
                style={{
                  opacity: 0.8,
                }}
              >
                <td />
                <td>...</td>
                <td />
              </tr>
            ) : null}
            {(focusedDatum.tooltipGroup ?? []).length > 1
              ? props.secondaryAxes
                  .filter((d) => d.stacked)
                  .map((secondaryAxis, i) => {
                    return <tr key={`${secondaryAxis.id}_${i}`}></tr>;
                  })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
