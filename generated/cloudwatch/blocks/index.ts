import deleteAlarms from "./deleteAlarms";
import deleteAnomalyDetector from "./deleteAnomalyDetector";
import deleteDashboards from "./deleteDashboards";
import deleteInsightRules from "./deleteInsightRules";
import deleteMetricStream from "./deleteMetricStream";
import describeAlarmHistory from "./describeAlarmHistory";
import describeAlarms from "./describeAlarms";
import describeAlarmsForMetric from "./describeAlarmsForMetric";
import describeAnomalyDetectors from "./describeAnomalyDetectors";
import describeInsightRules from "./describeInsightRules";
import disableAlarmActions from "./disableAlarmActions";
import disableInsightRules from "./disableInsightRules";
import enableAlarmActions from "./enableAlarmActions";
import enableInsightRules from "./enableInsightRules";
import getDashboard from "./getDashboard";
import getInsightRuleReport from "./getInsightRuleReport";
import getMetricData from "./getMetricData";
import getMetricStatistics from "./getMetricStatistics";
import getMetricStream from "./getMetricStream";
import getMetricWidgetImage from "./getMetricWidgetImage";
import listDashboards from "./listDashboards";
import listManagedInsightRules from "./listManagedInsightRules";
import listMetricStreams from "./listMetricStreams";
import listMetrics from "./listMetrics";
import listTagsForResource from "./listTagsForResource";
import putAnomalyDetector from "./putAnomalyDetector";
import putCompositeAlarm from "./putCompositeAlarm";
import putDashboard from "./putDashboard";
import putInsightRule from "./putInsightRule";
import putManagedInsightRules from "./putManagedInsightRules";
import putMetricAlarm from "./putMetricAlarm";
import putMetricData from "./putMetricData";
import putMetricStream from "./putMetricStream";
import setAlarmState from "./setAlarmState";
import startMetricStreams from "./startMetricStreams";
import stopMetricStreams from "./stopMetricStreams";
import tagResource from "./tagResource";
import untagResource from "./untagResource";

export const blocks = {
  deleteAlarms,
  deleteAnomalyDetector,
  deleteDashboards,
  deleteInsightRules,
  deleteMetricStream,
  describeAlarmHistory,
  describeAlarms,
  describeAlarmsForMetric,
  describeAnomalyDetectors,
  describeInsightRules,
  disableAlarmActions,
  disableInsightRules,
  enableAlarmActions,
  enableInsightRules,
  getDashboard,
  getInsightRuleReport,
  getMetricData,
  getMetricStatistics,
  getMetricStream,
  getMetricWidgetImage,
  listDashboards,
  listManagedInsightRules,
  listMetricStreams,
  listMetrics,
  listTagsForResource,
  putAnomalyDetector,
  putCompositeAlarm,
  putDashboard,
  putInsightRule,
  putManagedInsightRules,
  putMetricAlarm,
  putMetricData,
  putMetricStream,
  setAlarmState,
  startMetricStreams,
  stopMetricStreams,
  tagResource,
  untagResource,
};
