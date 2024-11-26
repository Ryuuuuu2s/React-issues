import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";
import { Transaction } from "../../types";
import { financeCalculations } from "../../utils/financeCalculations";

import "./MonthlySummary.css";
import { formatCurrency } from "../../utils/formatting";

interface MonthlySummaryProps {
  monthTransactions: Transaction[];
}

const MonthlySummary = ({ monthTransactions }: MonthlySummaryProps) => {

  console.log(monthTransactions);

  const {income, expense, balance} = financeCalculations(monthTransactions)


  return (
    <div className="MonthlySummary">
      {/* 収入 */}
      <div className="MonthlySummary_item blue">
        <div className="MonthlySummary_item_topic">
          <FontAwesomeIcon icon={faArrowUp} />
          <p>収入</p>
        </div>
        <p className="MonthlySummary_item_price">￥ {formatCurrency(income)}</p>
      </div>
      {/* 支出 */}
      <div className="MonthlySummary_item red">
        <div className="MonthlySummary_item_topic">
          <FontAwesomeIcon icon={faArrowDown} />
          <p>支出</p>
        </div>
        <p className="MonthlySummary_item_price">￥ {formatCurrency(expense)}</p>
      </div>
      {/* 残高 */}
      <div className="MonthlySummary_item green">
        <div className="MonthlySummary_item_topic">
          <FontAwesomeIcon icon={faPiggyBank} />
          <p>残高</p>
        </div>
        <p className="MonthlySummary_item_price">￥ {formatCurrency(balance)}</p>
      </div>
    </div>
  );
};

export default MonthlySummary;
