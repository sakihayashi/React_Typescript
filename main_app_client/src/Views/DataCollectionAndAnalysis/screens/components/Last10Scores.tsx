import React from 'react';

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { observer } from 'mobx-react-lite';

import { useRootContext } from '../../../../RootStore';


interface IProps {
  cx: number;
  cy: number;
}
export const chartStyle = {
  overflow: 'visible'
};
export const CustomizedDot = (props: IProps) => {

  const { cx, cy } = props;

  return (
    <svg x={cx - 5} y={cy - 5} width="10" height="10" viewBox="0 0 58 58" fill="none">
      <circle cx="29" cy="29" r="29" fill="#444"/>
    </svg>
  );
};

const Last10Scores = () => {
  const root = useRootContext();
  const dataCollectionStore = root.dataCollectionStore;
  return (
    <ResponsiveContainer width="100%" height="115%">
      <AreaChart
        width={400}
        height={100}
        data={dataCollectionStore.last10Sessions}
        margin={{
          top: 0,
          right: 10,
          left: 0,
          bottom: 0,
        }}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9A34BF" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#9A34BF" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <ReferenceLine y={5} stroke="red" />
        <CartesianGrid vertical={true} />
        <XAxis dataKey="none"/>
        <YAxis
          tick={{stroke: '#555', strokeWidth: 1}} ticks={[0, null, 10]} tickSize={1} tickCount={3} allowDecimals={true}
        />
        <Tooltip formatter={(value) => parseFloat(Number(value).toFixed(1))} />
        <Area
          type="linear"
          dataKey="quality_score"
          stroke="#222"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorUv)"
          dot={<CustomizedDot cx={null} cy={null}/>}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default observer(Last10Scores);
