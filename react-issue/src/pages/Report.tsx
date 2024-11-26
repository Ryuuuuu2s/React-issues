import React from "react";
import "./Report.css";
import { useNavigate } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import MonthSelector from "../housekeeping/parts/MonthSelector";
import BarChart from "../housekeeping/parts/BarChart";
import TransactionTable from "../housekeeping/parts/TransactionTable";
import CategoryChart from "../housekeeping/parts/CategoryChart";
import { Transaction } from "../types";

interface ReportProps {
  isAuth: boolean;
  currentMonth: Date;
  setCurrentMonth: (month: Date) => void;
  monthTransactions: Transaction[];
  isLoading: boolean;
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>
}

const Report: React.FC<ReportProps> = ({
  isAuth,
  currentMonth,
  setCurrentMonth,
  monthTransactions,
  isLoading,
  onDeleteTransaction,
}) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  return (
    <Grid container className="Report">
      <Grid item xs={12} className="date">
        {/* 日付選択エリア */}
        <MonthSelector
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </Grid>
      <div className="graphs">
        <Grid item xs={12} className="categoryGraph">
          <Paper className="graphsPaper">
            {/* 円グラフ */}
            <CategoryChart
              monthTransactions={monthTransactions}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} className="barGraph">
          <Paper className="graphsPaper">
            {/* 棒グラフ */}
            <BarChart
              monthTransactions={monthTransactions}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>
      </div>
      <Grid item xs={12} className="table">
        {/* テーブル */}
        <TransactionTable
          monthTransactions={monthTransactions}
          onDeleteTransaction={onDeleteTransaction}
        />
      </Grid>
    </Grid>
  );
};

export default Report;
