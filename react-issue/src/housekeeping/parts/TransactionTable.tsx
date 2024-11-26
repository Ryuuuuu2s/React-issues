import * as React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { Transaction } from "../../types";
import { financeCalculations } from "../../utils/financeCalculations";
import { Grid } from "@mui/material";
import { formatCurrency } from "../../utils/formatting";
import IconComponents from "../../components/common/IconComponents";
import { compareDesc, parseISO } from "date-fns";

interface TransactionTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

// テーブルヘッド
function TransactionTableHead(props: TransactionTableHeadProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell align={"left"}>日付</TableCell>
        <TableCell align={"left"}>カテゴリー</TableCell>
        <TableCell align={"left"}>金額</TableCell>
        <TableCell align={"left"}>内容</TableCell>
      </TableRow>
    </TableHead>
  );
}

interface TransactionTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
}

// ツールバー
function TransactionTableToolbar(props: TransactionTableToolbarProps) {
  const { numSelected, onDelete } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected}件選択
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          月の収支
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      {/* フィルターあり */}
      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
}

interface FinancialItemProps {
  title: string;
  value: number;
  color: string;
}

// 収支表示コンポーネント
function FinancialItem({ title, value, color }: FinancialItemProps) {
  return (
    <Grid item xs={4} textAlign={"center"}>
      <Typography variant="subtitle1" component={"div"}>
        {title}
      </Typography>
      <Typography
        component={"span"}
        fontWeight={"fontWeightBold"}
        sx={{
          color: color,
          fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
          wordBreak: "break-word",
        }}
      >
        ￥{formatCurrency(value)}
      </Typography>
    </Grid>
  );
}

interface TransactionTableProps {
  monthTransactions: Transaction[];
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
}

// 本体
export default function TransactionTable({
  monthTransactions,
  onDeleteTransaction,
}: TransactionTableProps) {
  const theme = useTheme();
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = monthTransactions.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = () => {
    onDeleteTransaction(selected);
    setSelected([]);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - monthTransactions.length)
      : 0;

  // 取引データから表示件数分取得
  const visibleRows = React.useMemo(() => {
    const sortedMonthTransactions = [...monthTransactions].sort((a, b) =>
      compareDesc(parseISO(a.date), parseISO(b.date))
    );
    return sortedMonthTransactions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, monthTransactions]);

  const { income, expense, balance } = financeCalculations(monthTransactions);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, padding: "20px" }}>
        {/* 収入、支出、残高の表示 */}
        <Grid container sx={{ borderBottom: "1px solid #ccc" }}>
          {/* 収入 */}
          <FinancialItem
            title={"収入"}
            value={income}
            color={theme.palette.incomeColor.main}
          />
          {/* 支出 */}
          <FinancialItem
            title={"支出"}
            value={expense}
            color={theme.palette.expenseColor.main}
          />
          {/* 残高 */}
          <FinancialItem
            title={"残高"}
            value={balance}
            color={theme.palette.balanceColor.main}
          />
        </Grid>

        {/* ツールバー */}
        <TransactionTableToolbar
          numSelected={selected.length}
          onDelete={handleDelete}
        />

        {/* 取引一覧 */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <TransactionTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={monthTransactions.length}
            />
            <TableBody>
              {visibleRows.map((transaction, index) => {
                const isItemSelected = isSelected(transaction.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, transaction.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={transaction.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {transaction.date}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      {IconComponents[transaction.category]}
                      {transaction.category}
                    </TableCell>
                    <TableCell align="left">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell align="left">{transaction.content}</TableCell>
                    {/* <TableCell align="left">{transaction.protein}</TableCell> */}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* テーブル下部 */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={monthTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
}
