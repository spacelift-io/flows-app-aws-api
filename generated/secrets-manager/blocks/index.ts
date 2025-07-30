import batchGetSecretValue from "./batchGetSecretValue";
import cancelRotateSecret from "./cancelRotateSecret";
import createSecret from "./createSecret";
import deleteResourcePolicy from "./deleteResourcePolicy";
import deleteSecret from "./deleteSecret";
import describeSecret from "./describeSecret";
import getRandomPassword from "./getRandomPassword";
import getResourcePolicy from "./getResourcePolicy";
import getSecretValue from "./getSecretValue";
import listSecretVersionIds from "./listSecretVersionIds";
import listSecrets from "./listSecrets";
import putResourcePolicy from "./putResourcePolicy";
import putSecretValue from "./putSecretValue";
import removeRegionsFromReplication from "./removeRegionsFromReplication";
import replicateSecretToRegions from "./replicateSecretToRegions";
import restoreSecret from "./restoreSecret";
import rotateSecret from "./rotateSecret";
import stopReplicationToReplica from "./stopReplicationToReplica";
import tagResource from "./tagResource";
import untagResource from "./untagResource";
import updateSecret from "./updateSecret";
import updateSecretVersionStage from "./updateSecretVersionStage";
import validateResourcePolicy from "./validateResourcePolicy";

export const blocks = {
  batchGetSecretValue,
  cancelRotateSecret,
  createSecret,
  deleteResourcePolicy,
  deleteSecret,
  describeSecret,
  getRandomPassword,
  getResourcePolicy,
  getSecretValue,
  listSecretVersionIds,
  listSecrets,
  putResourcePolicy,
  putSecretValue,
  removeRegionsFromReplication,
  replicateSecretToRegions,
  restoreSecret,
  rotateSecret,
  stopReplicationToReplica,
  tagResource,
  untagResource,
  updateSecret,
  updateSecretVersionStage,
  validateResourcePolicy,
};
