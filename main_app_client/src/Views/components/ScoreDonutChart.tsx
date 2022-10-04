import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { Box, Typography } from '@mui/material';

interface IProps {
  score: number | string;
}
const ScoreDonutChart = (props: IProps) => {
  const score = props.score;
  const scoreArea = typeof score === 'number' ? score : 0;
  const COLORS = [scoreArea >= 5 ? '#00aa55' : '#bd1e00', '#ddd'];
  let grayArea = 10;
  if (typeof score === 'number'){
    grayArea = 10 - score;
  }
  const scoreData = [
    { value: scoreArea },
    { value: grayArea }
  ];
  return (
    <>
      <Box sx={{position: 'relative'}}>
        <Typography variant="h1" sx={{position: 'absolute', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>{score}</Typography>
      </Box>
      <PieChart width={110} height={110}>
        <Pie
          data={scoreData}
          cx="50%"
          cy="50%"
          innerRadius={42}
          outerRadius={55}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {scoreData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </>
  );
};

export default ScoreDonutChart;