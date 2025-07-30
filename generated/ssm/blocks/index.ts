import addTagsToResource from "./addTagsToResource";
import associateOpsItemRelatedItem from "./associateOpsItemRelatedItem";
import cancelCommand from "./cancelCommand";
import cancelMaintenanceWindowExecution from "./cancelMaintenanceWindowExecution";
import createActivation from "./createActivation";
import createAssociation from "./createAssociation";
import createAssociationBatch from "./createAssociationBatch";
import createDocument from "./createDocument";
import createMaintenanceWindow from "./createMaintenanceWindow";
import createOpsItem from "./createOpsItem";
import createOpsMetadata from "./createOpsMetadata";
import createPatchBaseline from "./createPatchBaseline";
import createResourceDataSync from "./createResourceDataSync";
import deleteActivation from "./deleteActivation";
import deleteAssociation from "./deleteAssociation";
import deleteDocument from "./deleteDocument";
import deleteInventory from "./deleteInventory";
import deleteMaintenanceWindow from "./deleteMaintenanceWindow";
import deleteOpsItem from "./deleteOpsItem";
import deleteOpsMetadata from "./deleteOpsMetadata";
import deleteParameter from "./deleteParameter";
import deleteParameters from "./deleteParameters";
import deletePatchBaseline from "./deletePatchBaseline";
import deleteResourceDataSync from "./deleteResourceDataSync";
import deleteResourcePolicy from "./deleteResourcePolicy";
import deregisterManagedInstance from "./deregisterManagedInstance";
import deregisterPatchBaselineForPatchGroup from "./deregisterPatchBaselineForPatchGroup";
import deregisterTargetFromMaintenanceWindow from "./deregisterTargetFromMaintenanceWindow";
import deregisterTaskFromMaintenanceWindow from "./deregisterTaskFromMaintenanceWindow";
import describeActivations from "./describeActivations";
import describeAssociation from "./describeAssociation";
import describeAssociationExecutionTargets from "./describeAssociationExecutionTargets";
import describeAssociationExecutions from "./describeAssociationExecutions";
import describeAutomationExecutions from "./describeAutomationExecutions";
import describeAutomationStepExecutions from "./describeAutomationStepExecutions";
import describeAvailablePatches from "./describeAvailablePatches";
import describeDocument from "./describeDocument";
import describeDocumentPermission from "./describeDocumentPermission";
import describeEffectiveInstanceAssociations from "./describeEffectiveInstanceAssociations";
import describeEffectivePatchesForPatchBaseline from "./describeEffectivePatchesForPatchBaseline";
import describeInstanceAssociationsStatus from "./describeInstanceAssociationsStatus";
import describeInstanceInformation from "./describeInstanceInformation";
import describeInstancePatchStates from "./describeInstancePatchStates";
import describeInstancePatchStatesForPatchGroup from "./describeInstancePatchStatesForPatchGroup";
import describeInstancePatches from "./describeInstancePatches";
import describeInstanceProperties from "./describeInstanceProperties";
import describeInventoryDeletions from "./describeInventoryDeletions";
import describeMaintenanceWindowExecutionTaskInvocations from "./describeMaintenanceWindowExecutionTaskInvocations";
import describeMaintenanceWindowExecutionTasks from "./describeMaintenanceWindowExecutionTasks";
import describeMaintenanceWindowExecutions from "./describeMaintenanceWindowExecutions";
import describeMaintenanceWindowSchedule from "./describeMaintenanceWindowSchedule";
import describeMaintenanceWindowTargets from "./describeMaintenanceWindowTargets";
import describeMaintenanceWindowTasks from "./describeMaintenanceWindowTasks";
import describeMaintenanceWindows from "./describeMaintenanceWindows";
import describeMaintenanceWindowsForTarget from "./describeMaintenanceWindowsForTarget";
import describeOpsItems from "./describeOpsItems";
import describeParameters from "./describeParameters";
import describePatchBaselines from "./describePatchBaselines";
import describePatchGroupState from "./describePatchGroupState";
import describePatchGroups from "./describePatchGroups";
import describePatchProperties from "./describePatchProperties";
import describeSessions from "./describeSessions";
import disassociateOpsItemRelatedItem from "./disassociateOpsItemRelatedItem";
import getAccessToken from "./getAccessToken";
import getAutomationExecution from "./getAutomationExecution";
import getCalendarState from "./getCalendarState";
import getCommandInvocation from "./getCommandInvocation";
import getConnectionStatus from "./getConnectionStatus";
import getDefaultPatchBaseline from "./getDefaultPatchBaseline";
import getDeployablePatchSnapshotForInstance from "./getDeployablePatchSnapshotForInstance";
import getDocument from "./getDocument";
import getExecutionPreview from "./getExecutionPreview";
import getInventory from "./getInventory";
import getInventorySchema from "./getInventorySchema";
import getMaintenanceWindow from "./getMaintenanceWindow";
import getMaintenanceWindowExecution from "./getMaintenanceWindowExecution";
import getMaintenanceWindowExecutionTask from "./getMaintenanceWindowExecutionTask";
import getMaintenanceWindowExecutionTaskInvocation from "./getMaintenanceWindowExecutionTaskInvocation";
import getMaintenanceWindowTask from "./getMaintenanceWindowTask";
import getOpsItem from "./getOpsItem";
import getOpsMetadata from "./getOpsMetadata";
import getOpsSummary from "./getOpsSummary";
import getParameter from "./getParameter";
import getParameterHistory from "./getParameterHistory";
import getParameters from "./getParameters";
import getParametersByPath from "./getParametersByPath";
import getPatchBaseline from "./getPatchBaseline";
import getPatchBaselineForPatchGroup from "./getPatchBaselineForPatchGroup";
import getResourcePolicies from "./getResourcePolicies";
import getServiceSetting from "./getServiceSetting";
import labelParameterVersion from "./labelParameterVersion";
import listAssociationVersions from "./listAssociationVersions";
import listAssociations from "./listAssociations";
import listCommandInvocations from "./listCommandInvocations";
import listCommands from "./listCommands";
import listComplianceItems from "./listComplianceItems";
import listComplianceSummaries from "./listComplianceSummaries";
import listDocumentMetadataHistory from "./listDocumentMetadataHistory";
import listDocumentVersions from "./listDocumentVersions";
import listDocuments from "./listDocuments";
import listInventoryEntries from "./listInventoryEntries";
import listNodes from "./listNodes";
import listNodesSummary from "./listNodesSummary";
import listOpsItemEvents from "./listOpsItemEvents";
import listOpsItemRelatedItems from "./listOpsItemRelatedItems";
import listOpsMetadata from "./listOpsMetadata";
import listResourceComplianceSummaries from "./listResourceComplianceSummaries";
import listResourceDataSync from "./listResourceDataSync";
import listTagsForResource from "./listTagsForResource";
import modifyDocumentPermission from "./modifyDocumentPermission";
import putComplianceItems from "./putComplianceItems";
import putInventory from "./putInventory";
import putParameter from "./putParameter";
import putResourcePolicy from "./putResourcePolicy";
import registerDefaultPatchBaseline from "./registerDefaultPatchBaseline";
import registerPatchBaselineForPatchGroup from "./registerPatchBaselineForPatchGroup";
import registerTargetWithMaintenanceWindow from "./registerTargetWithMaintenanceWindow";
import registerTaskWithMaintenanceWindow from "./registerTaskWithMaintenanceWindow";
import removeTagsFromResource from "./removeTagsFromResource";
import resetServiceSetting from "./resetServiceSetting";
import resumeSession from "./resumeSession";
import sendAutomationSignal from "./sendAutomationSignal";
import sendCommand from "./sendCommand";
import startAccessRequest from "./startAccessRequest";
import startAssociationsOnce from "./startAssociationsOnce";
import startAutomationExecution from "./startAutomationExecution";
import startChangeRequestExecution from "./startChangeRequestExecution";
import startExecutionPreview from "./startExecutionPreview";
import startSession from "./startSession";
import stopAutomationExecution from "./stopAutomationExecution";
import terminateSession from "./terminateSession";
import unlabelParameterVersion from "./unlabelParameterVersion";
import updateAssociation from "./updateAssociation";
import updateAssociationStatus from "./updateAssociationStatus";
import updateDocument from "./updateDocument";
import updateDocumentDefaultVersion from "./updateDocumentDefaultVersion";
import updateDocumentMetadata from "./updateDocumentMetadata";
import updateMaintenanceWindow from "./updateMaintenanceWindow";
import updateMaintenanceWindowTarget from "./updateMaintenanceWindowTarget";
import updateMaintenanceWindowTask from "./updateMaintenanceWindowTask";
import updateManagedInstanceRole from "./updateManagedInstanceRole";
import updateOpsItem from "./updateOpsItem";
import updateOpsMetadata from "./updateOpsMetadata";
import updatePatchBaseline from "./updatePatchBaseline";
import updateResourceDataSync from "./updateResourceDataSync";
import updateServiceSetting from "./updateServiceSetting";

export const blocks = {
  addTagsToResource,
  associateOpsItemRelatedItem,
  cancelCommand,
  cancelMaintenanceWindowExecution,
  createActivation,
  createAssociation,
  createAssociationBatch,
  createDocument,
  createMaintenanceWindow,
  createOpsItem,
  createOpsMetadata,
  createPatchBaseline,
  createResourceDataSync,
  deleteActivation,
  deleteAssociation,
  deleteDocument,
  deleteInventory,
  deleteMaintenanceWindow,
  deleteOpsItem,
  deleteOpsMetadata,
  deleteParameter,
  deleteParameters,
  deletePatchBaseline,
  deleteResourceDataSync,
  deleteResourcePolicy,
  deregisterManagedInstance,
  deregisterPatchBaselineForPatchGroup,
  deregisterTargetFromMaintenanceWindow,
  deregisterTaskFromMaintenanceWindow,
  describeActivations,
  describeAssociation,
  describeAssociationExecutionTargets,
  describeAssociationExecutions,
  describeAutomationExecutions,
  describeAutomationStepExecutions,
  describeAvailablePatches,
  describeDocument,
  describeDocumentPermission,
  describeEffectiveInstanceAssociations,
  describeEffectivePatchesForPatchBaseline,
  describeInstanceAssociationsStatus,
  describeInstanceInformation,
  describeInstancePatchStates,
  describeInstancePatchStatesForPatchGroup,
  describeInstancePatches,
  describeInstanceProperties,
  describeInventoryDeletions,
  describeMaintenanceWindowExecutionTaskInvocations,
  describeMaintenanceWindowExecutionTasks,
  describeMaintenanceWindowExecutions,
  describeMaintenanceWindowSchedule,
  describeMaintenanceWindowTargets,
  describeMaintenanceWindowTasks,
  describeMaintenanceWindows,
  describeMaintenanceWindowsForTarget,
  describeOpsItems,
  describeParameters,
  describePatchBaselines,
  describePatchGroupState,
  describePatchGroups,
  describePatchProperties,
  describeSessions,
  disassociateOpsItemRelatedItem,
  getAccessToken,
  getAutomationExecution,
  getCalendarState,
  getCommandInvocation,
  getConnectionStatus,
  getDefaultPatchBaseline,
  getDeployablePatchSnapshotForInstance,
  getDocument,
  getExecutionPreview,
  getInventory,
  getInventorySchema,
  getMaintenanceWindow,
  getMaintenanceWindowExecution,
  getMaintenanceWindowExecutionTask,
  getMaintenanceWindowExecutionTaskInvocation,
  getMaintenanceWindowTask,
  getOpsItem,
  getOpsMetadata,
  getOpsSummary,
  getParameter,
  getParameterHistory,
  getParameters,
  getParametersByPath,
  getPatchBaseline,
  getPatchBaselineForPatchGroup,
  getResourcePolicies,
  getServiceSetting,
  labelParameterVersion,
  listAssociationVersions,
  listAssociations,
  listCommandInvocations,
  listCommands,
  listComplianceItems,
  listComplianceSummaries,
  listDocumentMetadataHistory,
  listDocumentVersions,
  listDocuments,
  listInventoryEntries,
  listNodes,
  listNodesSummary,
  listOpsItemEvents,
  listOpsItemRelatedItems,
  listOpsMetadata,
  listResourceComplianceSummaries,
  listResourceDataSync,
  listTagsForResource,
  modifyDocumentPermission,
  putComplianceItems,
  putInventory,
  putParameter,
  putResourcePolicy,
  registerDefaultPatchBaseline,
  registerPatchBaselineForPatchGroup,
  registerTargetWithMaintenanceWindow,
  registerTaskWithMaintenanceWindow,
  removeTagsFromResource,
  resetServiceSetting,
  resumeSession,
  sendAutomationSignal,
  sendCommand,
  startAccessRequest,
  startAssociationsOnce,
  startAutomationExecution,
  startChangeRequestExecution,
  startExecutionPreview,
  startSession,
  stopAutomationExecution,
  terminateSession,
  unlabelParameterVersion,
  updateAssociation,
  updateAssociationStatus,
  updateDocument,
  updateDocumentDefaultVersion,
  updateDocumentMetadata,
  updateMaintenanceWindow,
  updateMaintenanceWindowTarget,
  updateMaintenanceWindowTask,
  updateManagedInstanceRole,
  updateOpsItem,
  updateOpsMetadata,
  updatePatchBaseline,
  updateResourceDataSync,
  updateServiceSetting,
};
