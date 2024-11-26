import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import TransactionMenu from "../housekeeping/TransactionMenu";
import Box from "@mui/material/Box";
import MonthlySummary from "../housekeeping/parts/MonthlySummary";
import Calendar from "../housekeeping/parts/Calendar";
import { Transaction } from "../types";
import { useState } from "react";
import { formatDate } from "date-fns";
import TransactionForm from "../housekeeping/TransactionForm";
import { Schema } from "../validations/schema";

interface HomeProps {
  isAuth: boolean;
  monthTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

const Home: React.FC<HomeProps> = ({
  isAuth,
  monthTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) => {
  const navigate = useNavigate();

  const today = formatDate(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const dailyTransactions = monthTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });

  React.useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const onCloseForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
    setSelectedTransaction(null);
  };

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (selectedTransaction) {
      setSelectedTransaction(null);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  };

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setIsEntryDrawerOpen(true);
    setSelectedTransaction(transaction);
  };

  
  return (
    <div className="home">
      {/* 左 */}
      <Box className="house">
        <MonthlySummary monthTransactions={monthTransactions} />
        <Calendar
          monthTransactions={monthTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
        />
      </Box>

      {/* 右 */}
      <Box className="side">
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
        />
        <TransactionForm
          onCloseForm={onCloseForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          onUpdateTransaction={onUpdateTransaction}
        />
      </Box>
    </div>
  );
};

export default Home;
