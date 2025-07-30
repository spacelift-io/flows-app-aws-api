import createCapacityProvider from "./createCapacityProvider";
import createCluster from "./createCluster";
import createService from "./createService";
import createTaskSet from "./createTaskSet";
import deleteAccountSetting from "./deleteAccountSetting";
import deleteAttributes from "./deleteAttributes";
import deleteCapacityProvider from "./deleteCapacityProvider";
import deleteCluster from "./deleteCluster";
import deleteService from "./deleteService";
import deleteTaskDefinitions from "./deleteTaskDefinitions";
import deleteTaskSet from "./deleteTaskSet";
import deregisterContainerInstance from "./deregisterContainerInstance";
import deregisterTaskDefinition from "./deregisterTaskDefinition";
import describeCapacityProviders from "./describeCapacityProviders";
import describeClusters from "./describeClusters";
import describeContainerInstances from "./describeContainerInstances";
import describeServiceDeployments from "./describeServiceDeployments";
import describeServiceRevisions from "./describeServiceRevisions";
import describeServices from "./describeServices";
import describeTaskDefinition from "./describeTaskDefinition";
import describeTaskSets from "./describeTaskSets";
import describeTasks from "./describeTasks";
import discoverPollEndpoint from "./discoverPollEndpoint";
import executeCommand from "./executeCommand";
import getTaskProtection from "./getTaskProtection";
import listAccountSettings from "./listAccountSettings";
import listAttributes from "./listAttributes";
import listClusters from "./listClusters";
import listContainerInstances from "./listContainerInstances";
import listServiceDeployments from "./listServiceDeployments";
import listServices from "./listServices";
import listServicesByNamespace from "./listServicesByNamespace";
import listTagsForResource from "./listTagsForResource";
import listTaskDefinitionFamilies from "./listTaskDefinitionFamilies";
import listTaskDefinitions from "./listTaskDefinitions";
import listTasks from "./listTasks";
import putAccountSetting from "./putAccountSetting";
import putAccountSettingDefault from "./putAccountSettingDefault";
import putAttributes from "./putAttributes";
import putClusterCapacityProviders from "./putClusterCapacityProviders";
import registerContainerInstance from "./registerContainerInstance";
import registerTaskDefinition from "./registerTaskDefinition";
import runTask from "./runTask";
import startTask from "./startTask";
import stopServiceDeployment from "./stopServiceDeployment";
import stopTask from "./stopTask";
import submitAttachmentStateChanges from "./submitAttachmentStateChanges";
import submitContainerStateChange from "./submitContainerStateChange";
import submitTaskStateChange from "./submitTaskStateChange";
import tagResource from "./tagResource";
import untagResource from "./untagResource";
import updateCapacityProvider from "./updateCapacityProvider";
import updateCluster from "./updateCluster";
import updateClusterSettings from "./updateClusterSettings";
import updateContainerAgent from "./updateContainerAgent";
import updateContainerInstancesState from "./updateContainerInstancesState";
import updateService from "./updateService";
import updateServicePrimaryTaskSet from "./updateServicePrimaryTaskSet";
import updateTaskProtection from "./updateTaskProtection";
import updateTaskSet from "./updateTaskSet";

export const blocks = {
  createCapacityProvider,
  createCluster,
  createService,
  createTaskSet,
  deleteAccountSetting,
  deleteAttributes,
  deleteCapacityProvider,
  deleteCluster,
  deleteService,
  deleteTaskDefinitions,
  deleteTaskSet,
  deregisterContainerInstance,
  deregisterTaskDefinition,
  describeCapacityProviders,
  describeClusters,
  describeContainerInstances,
  describeServiceDeployments,
  describeServiceRevisions,
  describeServices,
  describeTaskDefinition,
  describeTaskSets,
  describeTasks,
  discoverPollEndpoint,
  executeCommand,
  getTaskProtection,
  listAccountSettings,
  listAttributes,
  listClusters,
  listContainerInstances,
  listServiceDeployments,
  listServices,
  listServicesByNamespace,
  listTagsForResource,
  listTaskDefinitionFamilies,
  listTaskDefinitions,
  listTasks,
  putAccountSetting,
  putAccountSettingDefault,
  putAttributes,
  putClusterCapacityProviders,
  registerContainerInstance,
  registerTaskDefinition,
  runTask,
  startTask,
  stopServiceDeployment,
  stopTask,
  submitAttachmentStateChanges,
  submitContainerStateChange,
  submitTaskStateChange,
  tagResource,
  untagResource,
  updateCapacityProvider,
  updateCluster,
  updateClusterSettings,
  updateContainerAgent,
  updateContainerInstancesState,
  updateService,
  updateServicePrimaryTaskSet,
  updateTaskProtection,
  updateTaskSet,
};
