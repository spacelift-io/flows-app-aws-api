import batchExecuteStatement from "./batchExecuteStatement";
import cancelStatement from "./cancelStatement";
import describeStatement from "./describeStatement";
import describeTable from "./describeTable";
import executeStatement from "./executeStatement";
import getStatementResult from "./getStatementResult";
import getStatementResultV2 from "./getStatementResultV2";
import listDatabases from "./listDatabases";
import listSchemas from "./listSchemas";
import listStatements from "./listStatements";
import listTables from "./listTables";

export const blocks = {
  batchExecuteStatement,
  cancelStatement,
  describeStatement,
  describeTable,
  executeStatement,
  getStatementResult,
  getStatementResultV2,
  listDatabases,
  listSchemas,
  listStatements,
  listTables,
};
