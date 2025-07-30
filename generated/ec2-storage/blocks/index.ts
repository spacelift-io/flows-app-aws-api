import createVolume from "./createVolume";
import deleteVolume from "./deleteVolume";
import attachVolume from "./attachVolume";
import detachVolume from "./detachVolume";
import describeVolumes from "./describeVolumes";
import describeVolumeStatus from "./describeVolumeStatus";
import describeVolumeAttribute from "./describeVolumeAttribute";
import modifyVolume from "./modifyVolume";
import modifyVolumeAttribute from "./modifyVolumeAttribute";
import enableVolumeIO from "./enableVolumeIO";
import describeVolumesModifications from "./describeVolumesModifications";
import createSnapshot from "./createSnapshot";
import createSnapshots from "./createSnapshots";
import deleteSnapshot from "./deleteSnapshot";
import copySnapshot from "./copySnapshot";
import describeSnapshots from "./describeSnapshots";
import describeSnapshotAttribute from "./describeSnapshotAttribute";
import modifySnapshotAttribute from "./modifySnapshotAttribute";
import resetSnapshotAttribute from "./resetSnapshotAttribute";
import describeSnapshotTierStatus from "./describeSnapshotTierStatus";
import modifySnapshotTier from "./modifySnapshotTier";
import restoreSnapshotTier from "./restoreSnapshotTier";
import lockSnapshot from "./lockSnapshot";
import unlockSnapshot from "./unlockSnapshot";
import describeLockedSnapshots from "./describeLockedSnapshots";
import listSnapshotsInRecycleBin from "./listSnapshotsInRecycleBin";
import restoreSnapshotFromRecycleBin from "./restoreSnapshotFromRecycleBin";
import enableFastSnapshotRestores from "./enableFastSnapshotRestores";
import disableFastSnapshotRestores from "./disableFastSnapshotRestores";
import describeFastSnapshotRestores from "./describeFastSnapshotRestores";
import importSnapshot from "./importSnapshot";
import importVolume from "./importVolume";
import createReplaceRootVolumeTask from "./createReplaceRootVolumeTask";
import describeReplaceRootVolumeTasks from "./describeReplaceRootVolumeTasks";
import getEbsDefaultKmsKeyId from "./getEbsDefaultKmsKeyId";
import modifyEbsDefaultKmsKeyId from "./modifyEbsDefaultKmsKeyId";
import resetEbsDefaultKmsKeyId from "./resetEbsDefaultKmsKeyId";
import getEbsEncryptionByDefault from "./getEbsEncryptionByDefault";
import enableEbsEncryptionByDefault from "./enableEbsEncryptionByDefault";
import disableEbsEncryptionByDefault from "./disableEbsEncryptionByDefault";
import enableSnapshotBlockPublicAccess from "./enableSnapshotBlockPublicAccess";
import disableSnapshotBlockPublicAccess from "./disableSnapshotBlockPublicAccess";
import getSnapshotBlockPublicAccessState from "./getSnapshotBlockPublicAccessState";
import createDelegateMacVolumeOwnershipTask from "./createDelegateMacVolumeOwnershipTask";
import createMacSystemIntegrityProtectionModificationTask from "./createMacSystemIntegrityProtectionModificationTask";
import describeMacModificationTasks from "./describeMacModificationTasks";

export const blocks = {
  createVolume,
  deleteVolume,
  attachVolume,
  detachVolume,
  describeVolumes,
  describeVolumeStatus,
  describeVolumeAttribute,
  modifyVolume,
  modifyVolumeAttribute,
  enableVolumeIO,
  describeVolumesModifications,
  createSnapshot,
  createSnapshots,
  deleteSnapshot,
  copySnapshot,
  describeSnapshots,
  describeSnapshotAttribute,
  modifySnapshotAttribute,
  resetSnapshotAttribute,
  describeSnapshotTierStatus,
  modifySnapshotTier,
  restoreSnapshotTier,
  lockSnapshot,
  unlockSnapshot,
  describeLockedSnapshots,
  listSnapshotsInRecycleBin,
  restoreSnapshotFromRecycleBin,
  enableFastSnapshotRestores,
  disableFastSnapshotRestores,
  describeFastSnapshotRestores,
  importSnapshot,
  importVolume,
  createReplaceRootVolumeTask,
  describeReplaceRootVolumeTasks,
  getEbsDefaultKmsKeyId,
  modifyEbsDefaultKmsKeyId,
  resetEbsDefaultKmsKeyId,
  getEbsEncryptionByDefault,
  enableEbsEncryptionByDefault,
  disableEbsEncryptionByDefault,
  enableSnapshotBlockPublicAccess,
  disableSnapshotBlockPublicAccess,
  getSnapshotBlockPublicAccessState,
  createDelegateMacVolumeOwnershipTask,
  createMacSystemIntegrityProtectionModificationTask,
  describeMacModificationTasks,
};
