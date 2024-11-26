import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { calculateDailyBalances } from "../../utils/financeCalculations";
import { Transaction } from "../../types";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from "@mui/material";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface BarChart  {
  monthTransactions: Transaction[];
  isLoading: boolean;
}


const BarChart = ({monthTransactions, isLoading}: BarChart) => {

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    // legend: {
    //   position: "top" as const,
    // },
    title: {
      display: true,
      text: "日別収支",
    },
  },
};

const dailyBalances = calculateDailyBalances(monthTransactions)

const dateLabels = Object.keys(dailyBalances).sort();
const expenseData = dateLabels.map((day) => dailyBalances[day].expense);
const incomeData = dateLabels.map((day) => dailyBalances[day].income);


  const data: ChartData<"bar"> = {
    labels: dateLabels,
    datasets: [
      {
        label: "支出",
        data: expenseData,
        backgroundColor: "pink",
      },
      {
        label: "収入",
        data: incomeData,
        backgroundColor: "lightblue",
      },
    ],
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : monthTransactions.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChart;
