import runInstances from "./runInstances";
import startInstances from "./startInstances";
import stopInstances from "./stopInstances";
import rebootInstances from "./rebootInstances";
import terminateInstances from "./terminateInstances";
import describeInstances from "./describeInstances";
import describeInstanceStatus from "./describeInstanceStatus";
import describeInstanceAttribute from "./describeInstanceAttribute";
import modifyInstanceAttribute from "./modifyInstanceAttribute";
import modifyInstancePlacement from "./modifyInstancePlacement";
import modifyInstanceCpuOptions from "./modifyInstanceCpuOptions";
import modifyInstanceCreditSpecification from "./modifyInstanceCreditSpecification";
import modifyInstanceCapacityReservationAttributes from "./modifyInstanceCapacityReservationAttributes";
import modifyInstanceMaintenanceOptions from "./modifyInstanceMaintenanceOptions";
import modifyInstanceMetadataOptions from "./modifyInstanceMetadataOptions";
import modifyInstanceNetworkPerformanceOptions from "./modifyInstanceNetworkPerformanceOptions";
import modifyInstanceEventStartTime from "./modifyInstanceEventStartTime";
import resetInstanceAttribute from "./resetInstanceAttribute";
import monitorInstances from "./monitorInstances";
import unmonitorInstances from "./unmonitorInstances";
import reportInstanceStatus from "./reportInstanceStatus";
import sendDiagnosticInterrupt from "./sendDiagnosticInterrupt";
import getConsoleOutput from "./getConsoleOutput";
import getConsoleScreenshot from "./getConsoleScreenshot";
import getPasswordData from "./getPasswordData";
import getInstanceTpmEkPub from "./getInstanceTpmEkPub";
import getInstanceUefiData from "./getInstanceUefiData";
import getInstanceMetadataDefaults from "./getInstanceMetadataDefaults";
import modifyInstanceMetadataDefaults from "./modifyInstanceMetadataDefaults";
import describeInstanceTypes from "./describeInstanceTypes";
import describeInstanceTypeOfferings from "./describeInstanceTypeOfferings";
import describeInstanceTopology from "./describeInstanceTopology";
import describeInstanceImageMetadata from "./describeInstanceImageMetadata";
import describeInstanceCreditSpecifications from "./describeInstanceCreditSpecifications";
import getInstanceTypesFromInstanceRequirements from "./getInstanceTypesFromInstanceRequirements";
import describeInstanceConnectEndpoints from "./describeInstanceConnectEndpoints";
import createInstanceConnectEndpoint from "./createInstanceConnectEndpoint";
import deleteInstanceConnectEndpoint from "./deleteInstanceConnectEndpoint";
import describeInstanceEventWindows from "./describeInstanceEventWindows";
import createInstanceEventWindow from "./createInstanceEventWindow";
import deleteInstanceEventWindow from "./deleteInstanceEventWindow";
import modifyInstanceEventWindow from "./modifyInstanceEventWindow";
import associateInstanceEventWindow from "./associateInstanceEventWindow";
import disassociateInstanceEventWindow from "./disassociateInstanceEventWindow";
import describeInstanceEventNotificationAttributes from "./describeInstanceEventNotificationAttributes";
import registerInstanceEventNotificationAttributes from "./registerInstanceEventNotificationAttributes";
import deregisterInstanceEventNotificationAttributes from "./deregisterInstanceEventNotificationAttributes";
import bundleInstance from "./bundleInstance";
import cancelBundleTask from "./cancelBundleTask";
import describeBundleTasks from "./describeBundleTasks";
import createInstanceExportTask from "./createInstanceExportTask";
import importInstance from "./importInstance";
import confirmProductInstance from "./confirmProductInstance";
import associateIamInstanceProfile from "./associateIamInstanceProfile";
import disassociateIamInstanceProfile from "./disassociateIamInstanceProfile";
import describeIamInstanceProfileAssociations from "./describeIamInstanceProfileAssociations";
import replaceIamInstanceProfileAssociation from "./replaceIamInstanceProfileAssociation";
import associateEnclaveCertificateIamRole from "./associateEnclaveCertificateIamRole";
import disassociateEnclaveCertificateIamRole from "./disassociateEnclaveCertificateIamRole";
import getAssociatedEnclaveCertificateIamRoles from "./getAssociatedEnclaveCertificateIamRoles";
import describeElasticGpus from "./describeElasticGpus";
import getDefaultCreditSpecification from "./getDefaultCreditSpecification";
import modifyDefaultCreditSpecification from "./modifyDefaultCreditSpecification";

export const blocks = {
  runInstances,
  startInstances,
  stopInstances,
  rebootInstances,
  terminateInstances,
  describeInstances,
  describeInstanceStatus,
  describeInstanceAttribute,
  modifyInstanceAttribute,
  modifyInstancePlacement,
  modifyInstanceCpuOptions,
  modifyInstanceCreditSpecification,
  modifyInstanceCapacityReservationAttributes,
  modifyInstanceMaintenanceOptions,
  modifyInstanceMetadataOptions,
  modifyInstanceNetworkPerformanceOptions,
  modifyInstanceEventStartTime,
  resetInstanceAttribute,
  monitorInstances,
  unmonitorInstances,
  reportInstanceStatus,
  sendDiagnosticInterrupt,
  getConsoleOutput,
  getConsoleScreenshot,
  getPasswordData,
  getInstanceTpmEkPub,
  getInstanceUefiData,
  getInstanceMetadataDefaults,
  modifyInstanceMetadataDefaults,
  describeInstanceTypes,
  describeInstanceTypeOfferings,
  describeInstanceTopology,
  describeInstanceImageMetadata,
  describeInstanceCreditSpecifications,
  getInstanceTypesFromInstanceRequirements,
  describeInstanceConnectEndpoints,
  createInstanceConnectEndpoint,
  deleteInstanceConnectEndpoint,
  describeInstanceEventWindows,
  createInstanceEventWindow,
  deleteInstanceEventWindow,
  modifyInstanceEventWindow,
  associateInstanceEventWindow,
  disassociateInstanceEventWindow,
  describeInstanceEventNotificationAttributes,
  registerInstanceEventNotificationAttributes,
  deregisterInstanceEventNotificationAttributes,
  bundleInstance,
  cancelBundleTask,
  describeBundleTasks,
  createInstanceExportTask,
  importInstance,
  confirmProductInstance,
  associateIamInstanceProfile,
  disassociateIamInstanceProfile,
  describeIamInstanceProfileAssociations,
  replaceIamInstanceProfileAssociation,
  associateEnclaveCertificateIamRole,
  disassociateEnclaveCertificateIamRole,
  getAssociatedEnclaveCertificateIamRoles,
  describeElasticGpus,
  getDefaultCreditSpecification,
  modifyDefaultCreditSpecification,
};
