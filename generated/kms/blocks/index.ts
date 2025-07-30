import cancelKeyDeletion from "./cancelKeyDeletion";
import connectCustomKeyStore from "./connectCustomKeyStore";
import createAlias from "./createAlias";
import createCustomKeyStore from "./createCustomKeyStore";
import createGrant from "./createGrant";
import createKey from "./createKey";
import decrypt from "./decrypt";
import deleteAlias from "./deleteAlias";
import deleteCustomKeyStore from "./deleteCustomKeyStore";
import deleteImportedKeyMaterial from "./deleteImportedKeyMaterial";
import deriveSharedSecret from "./deriveSharedSecret";
import describeCustomKeyStores from "./describeCustomKeyStores";
import describeKey from "./describeKey";
import disableKey from "./disableKey";
import disableKeyRotation from "./disableKeyRotation";
import disconnectCustomKeyStore from "./disconnectCustomKeyStore";
import enableKey from "./enableKey";
import enableKeyRotation from "./enableKeyRotation";
import encrypt from "./encrypt";
import generateDataKey from "./generateDataKey";
import generateDataKeyPair from "./generateDataKeyPair";
import generateDataKeyPairWithoutPlaintext from "./generateDataKeyPairWithoutPlaintext";
import generateDataKeyWithoutPlaintext from "./generateDataKeyWithoutPlaintext";
import generateMac from "./generateMac";
import generateRandom from "./generateRandom";
import getKeyPolicy from "./getKeyPolicy";
import getKeyRotationStatus from "./getKeyRotationStatus";
import getParametersForImport from "./getParametersForImport";
import getPublicKey from "./getPublicKey";
import importKeyMaterial from "./importKeyMaterial";
import listAliases from "./listAliases";
import listGrants from "./listGrants";
import listKeyPolicies from "./listKeyPolicies";
import listKeyRotations from "./listKeyRotations";
import listKeys from "./listKeys";
import listResourceTags from "./listResourceTags";
import listRetirableGrants from "./listRetirableGrants";
import putKeyPolicy from "./putKeyPolicy";
import reEncrypt from "./reEncrypt";
import replicateKey from "./replicateKey";
import retireGrant from "./retireGrant";
import revokeGrant from "./revokeGrant";
import rotateKeyOnDemand from "./rotateKeyOnDemand";
import scheduleKeyDeletion from "./scheduleKeyDeletion";
import sign from "./sign";
import tagResource from "./tagResource";
import untagResource from "./untagResource";
import updateAlias from "./updateAlias";
import updateCustomKeyStore from "./updateCustomKeyStore";
import updateKeyDescription from "./updateKeyDescription";
import updatePrimaryRegion from "./updatePrimaryRegion";
import verify from "./verify";
import verifyMac from "./verifyMac";

export const blocks = {
  cancelKeyDeletion,
  connectCustomKeyStore,
  createAlias,
  createCustomKeyStore,
  createGrant,
  createKey,
  decrypt,
  deleteAlias,
  deleteCustomKeyStore,
  deleteImportedKeyMaterial,
  deriveSharedSecret,
  describeCustomKeyStores,
  describeKey,
  disableKey,
  disableKeyRotation,
  disconnectCustomKeyStore,
  enableKey,
  enableKeyRotation,
  encrypt,
  generateDataKey,
  generateDataKeyPair,
  generateDataKeyPairWithoutPlaintext,
  generateDataKeyWithoutPlaintext,
  generateMac,
  generateRandom,
  getKeyPolicy,
  getKeyRotationStatus,
  getParametersForImport,
  getPublicKey,
  importKeyMaterial,
  listAliases,
  listGrants,
  listKeyPolicies,
  listKeyRotations,
  listKeys,
  listResourceTags,
  listRetirableGrants,
  putKeyPolicy,
  reEncrypt,
  replicateKey,
  retireGrant,
  revokeGrant,
  rotateKeyOnDemand,
  scheduleKeyDeletion,
  sign,
  tagResource,
  untagResource,
  updateAlias,
  updateCustomKeyStore,
  updateKeyDescription,
  updatePrimaryRegion,
  verify,
  verifyMac,
};
