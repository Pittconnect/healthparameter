import React from "react";
import RectLegend from "../legends/RectLegend";
import { CONCENTRIC_COLORS } from "../../helpers";

const d3 = window.d3;

const Circle = ({
  data,
  sqrtScale,
  colorScale,
  width,
  top,
  left,
}) => {
  return (
    <circle
      r={sqrtScale(data.value)}
      cx={width / 2 - left}
      cy={top}
      fill={colorScale(data.name)}
    />
  );
};

const ConcentricChart = (props) => {
  const {
    legendWidth,
    legendHeight,
    legendTop,
    legendRight,
    legendBottom,
    legendLeft,
    useLegend,
    legendOnRight = true,
  } = props;

  const totalTest = props.data.totalTestResults;
  const hospitalized = props.data.hospitalizedCurrently;

  const _height = legendOnRight ? props.height : props.height - legendHeight;

  const sqrtScale = d3
    .scaleSqrt()
    .domain([
      0,
      props.maxTotalTests.totalTestResults +
        props.maxTotalTests.hospitalizedCurrently,
    ])
    .range([0, (_height - props.top - props.bottom) / 2]);

  const colorScale = d3
    .scaleOrdinal()
    .domain(props.data)
    .range(CONCENTRIC_COLORS);

  const itemWidth = legendOnRight ? 170 : 180;
  const itemHeight = 26;
  const itemFontSize = 17;

  return (
    <>
      <h1 className="chart-header">{`State: ${props.data.stateName}`}</h1>
      <svg width={props.width} height={props.height}>
        <g transform={`translate(${0}, ${0})`}>
          {props.dataKeys.map((_k, _n) => (
            <Circle
              key={_n}
              data={{
                name: Object.keys(_k)[0],
                value: props.data[Object.keys(_k)[0]],
              }}
              width={legendOnRight ? props.width - legendWidth : props.width}
              height={
                legendOnRight ? props.height : props.height - legendHeight
              }
              top={
                legendOnRight
                  ? legendHeight / 2 + props.top <
                    sqrtScale(totalTest) + props.top
                    ? sqrtScale(totalTest) + props.top
                    : legendHeight / 2 + props.top
                  : sqrtScale(totalTest) + legendHeight
              }
              right={props.right}
              bottom={props.bottom}
              left={
                _k.hospitalizedCurrently
                  ? sqrtScale(totalTest) -
                    sqrtScale(hospitalized) +
                    sqrtScale(props.data[Object.keys(_k)[0]])
                  : sqrtScale(totalTest) -
                    sqrtScale(hospitalized) -
                    sqrtScale(props.data[Object.keys(_k)[0]])
              }
              sqrtScale={sqrtScale}
              colorScale={colorScale}
            />
          ))}
        </g>
        {useLegend && (
          <g
            transform={`translate(${
              legendOnRight
                ? `${props.width - itemWidth - legendLeft - legendRight}, ${
                    legendHeight / 2 + props.top <
                    sqrtScale(totalTest) + props.top
                      ? sqrtScale(totalTest) - legendHeight / 2 + props.top
                      : props.top
                  }`
                : `${0}, ${0}`
            })`}
          >
            {props.dataKeys.map((_k, _n) => (
              <RectLegend
                key={_n}
                containerWidth={legendWidth}
                containerHeight={legendHeight}
                elementWidth={itemWidth}
                elementHeight={itemHeight}
                paddingTop={legendTop}
                paddingRight={legendRight}
                paddingBottom={legendBottom}
                paddingLeft={legendLeft}
                elementLabel={`${Object.values(_k)[0]}: ${
                  props.data[Object.keys(_k)[0]] || 0
                }`}
                elementFontSize={itemFontSize}
                elementIndex={_n}
                colorScale={colorScale}
              />
            ))}
          </g>
        )}
      </svg>
    </>
  );
};

export default ConcentricChart;
