import batchExecuteStatement from "./batchExecuteStatement";
import batchGetItem from "./batchGetItem";
import batchWriteItem from "./batchWriteItem";
import createBackup from "./createBackup";
import createGlobalTable from "./createGlobalTable";
import createTable from "./createTable";
import deleteBackup from "./deleteBackup";
import deleteItem from "./deleteItem";
import deleteResourcePolicy from "./deleteResourcePolicy";
import deleteTable from "./deleteTable";
import describeBackup from "./describeBackup";
import describeContinuousBackups from "./describeContinuousBackups";
import describeContributorInsights from "./describeContributorInsights";
import describeEndpoints from "./describeEndpoints";
import describeExport from "./describeExport";
import describeGlobalTable from "./describeGlobalTable";
import describeGlobalTableSettings from "./describeGlobalTableSettings";
import describeImport from "./describeImport";
import describeKinesisStreamingDestination from "./describeKinesisStreamingDestination";
import describeLimits from "./describeLimits";
import describeTable from "./describeTable";
import describeTableReplicaAutoScaling from "./describeTableReplicaAutoScaling";
import describeTimeToLive from "./describeTimeToLive";
import disableKinesisStreamingDestination from "./disableKinesisStreamingDestination";
import enableKinesisStreamingDestination from "./enableKinesisStreamingDestination";
import executeStatement from "./executeStatement";
import executeTransaction from "./executeTransaction";
import exportTableToPointInTime from "./exportTableToPointInTime";
import getItem from "./getItem";
import getResourcePolicy from "./getResourcePolicy";
import importTable from "./importTable";
import listBackups from "./listBackups";
import listContributorInsights from "./listContributorInsights";
import listExports from "./listExports";
import listGlobalTables from "./listGlobalTables";
import listImports from "./listImports";
import listTables from "./listTables";
import listTagsOfResource from "./listTagsOfResource";
import putItem from "./putItem";
import putResourcePolicy from "./putResourcePolicy";
import query from "./query";
import restoreTableFromBackup from "./restoreTableFromBackup";
import restoreTableToPointInTime from "./restoreTableToPointInTime";
import scan from "./scan";
import tagResource from "./tagResource";
import transactGetItems from "./transactGetItems";
import transactWriteItems from "./transactWriteItems";
import untagResource from "./untagResource";
import updateContinuousBackups from "./updateContinuousBackups";
import updateContributorInsights from "./updateContributorInsights";
import updateGlobalTable from "./updateGlobalTable";
import updateGlobalTableSettings from "./updateGlobalTableSettings";
import updateItem from "./updateItem";
import updateKinesisStreamingDestination from "./updateKinesisStreamingDestination";
import updateTable from "./updateTable";
import updateTableReplicaAutoScaling from "./updateTableReplicaAutoScaling";
import updateTimeToLive from "./updateTimeToLive";

export const blocks = {
  batchExecuteStatement,
  batchGetItem,
  batchWriteItem,
  createBackup,
  createGlobalTable,
  createTable,
  deleteBackup,
  deleteItem,
  deleteResourcePolicy,
  deleteTable,
  describeBackup,
  describeContinuousBackups,
  describeContributorInsights,
  describeEndpoints,
  describeExport,
  describeGlobalTable,
  describeGlobalTableSettings,
  describeImport,
  describeKinesisStreamingDestination,
  describeLimits,
  describeTable,
  describeTableReplicaAutoScaling,
  describeTimeToLive,
  disableKinesisStreamingDestination,
  enableKinesisStreamingDestination,
  executeStatement,
  executeTransaction,
  exportTableToPointInTime,
  getItem,
  getResourcePolicy,
  importTable,
  listBackups,
  listContributorInsights,
  listExports,
  listGlobalTables,
  listImports,
  listTables,
  listTagsOfResource,
  putItem,
  putResourcePolicy,
  query,
  restoreTableFromBackup,
  restoreTableToPointInTime,
  scan,
  tagResource,
  transactGetItems,
  transactWriteItems,
  untagResource,
  updateContinuousBackups,
  updateContributorInsights,
  updateGlobalTable,
  updateGlobalTableSettings,
  updateItem,
  updateKinesisStreamingDestination,
  updateTable,
  updateTableReplicaAutoScaling,
  updateTimeToLive,
};
