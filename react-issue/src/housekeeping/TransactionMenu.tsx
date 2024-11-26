import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
//アイコン
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DailySummary from "./parts/DailySummary";
import { formatCurrency } from "../utils/formatting";
import { Transaction } from "../types";
import IconComponents from "../components/common/IconComponents";

interface TransactionMenuProps {
  dailyTransactions: Transaction[];
  currentDay: string;
  onAddTransactionForm: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
}

const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  onAddTransactionForm,
  onSelectTransaction,
}: TransactionMenuProps) => {
  return (
    <>
      <div>
        <Stack sx={{ height: "100%" }} spacing={2}>
          <Typography fontWeight={"fontWeightBold"}>日時： {currentDay}</Typography>
          <DailySummary  dailyTransactions={dailyTransactions}/>
          {/* 内訳タイトル&内訳追加ボタン */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            {/* 左側のメモアイコンとテキスト */}
            <Box display="flex" alignItems="center">
              <NotesIcon sx={{ mr: 1 }} />
              <Typography variant="body1">内訳</Typography>
            </Box>
            {/* 右側の追加ボタン */}
            <Button startIcon={<AddCircleIcon />} color="primary" onClick={onAddTransactionForm}>
              内訳を追加
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            <List aria-label="取引履歴">
              <Stack spacing={2}>
                {dailyTransactions.map((transaction) => (
                  <ListItem disablePadding key={transaction.id}>
                    <Card
                      sx={{
                        width: "100%",
                        backgroundColor: transaction.type === "income" ? "rgb(199, 228, 255)" : "rgb(255, 199, 199)",
                      }}
                      onClick={() => onSelectTransaction(transaction)}
                    >
                      <CardActionArea>
                        <CardContent>
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            wrap="wrap"
                          >
                            <Grid item xs={1}>
                              {/* icon */}
                              {IconComponents[transaction.category]}
                            </Grid>
                            <Grid item xs={2.5}>
                              <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                              >
                                {transaction.category}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" gutterBottom>
                                {transaction.content}
                              </Typography>
                            </Grid>
                            <Grid item xs={4.5}>
                              <Typography
                                gutterBottom
                                textAlign={"right"}
                                color="text.secondary"
                                sx={{
                                  wordBreak: "break-all",
                                }}
                              >
                                {formatCurrency(transaction.amount)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </ListItem>
                ))}
              </Stack>
            </List>
          </Box>
        </Stack>
      </div>
    </>
  );
};

export default TransactionMenu;
