import batchCheckLayerAvailability from "./batchCheckLayerAvailability";
import batchDeleteImage from "./batchDeleteImage";
import batchGetImage from "./batchGetImage";
import batchGetRepositoryScanningConfiguration from "./batchGetRepositoryScanningConfiguration";
import completeLayerUpload from "./completeLayerUpload";
import createPullThroughCacheRule from "./createPullThroughCacheRule";
import createRepository from "./createRepository";
import createRepositoryCreationTemplate from "./createRepositoryCreationTemplate";
import deleteLifecyclePolicy from "./deleteLifecyclePolicy";
import deletePullThroughCacheRule from "./deletePullThroughCacheRule";
import deleteRegistryPolicy from "./deleteRegistryPolicy";
import deleteRepository from "./deleteRepository";
import deleteRepositoryCreationTemplate from "./deleteRepositoryCreationTemplate";
import deleteRepositoryPolicy from "./deleteRepositoryPolicy";
import describeImageReplicationStatus from "./describeImageReplicationStatus";
import describeImageScanFindings from "./describeImageScanFindings";
import describeImages from "./describeImages";
import describePullThroughCacheRules from "./describePullThroughCacheRules";
import describeRegistry from "./describeRegistry";
import describeRepositories from "./describeRepositories";
import describeRepositoryCreationTemplates from "./describeRepositoryCreationTemplates";
import getAccountSetting from "./getAccountSetting";
import getAuthorizationToken from "./getAuthorizationToken";
import getDownloadUrlForLayer from "./getDownloadUrlForLayer";
import getLifecyclePolicy from "./getLifecyclePolicy";
import getLifecyclePolicyPreview from "./getLifecyclePolicyPreview";
import getRegistryPolicy from "./getRegistryPolicy";
import getRegistryScanningConfiguration from "./getRegistryScanningConfiguration";
import getRepositoryPolicy from "./getRepositoryPolicy";
import initiateLayerUpload from "./initiateLayerUpload";
import listImages from "./listImages";
import listTagsForResource from "./listTagsForResource";
import putAccountSetting from "./putAccountSetting";
import putImage from "./putImage";
import putImageScanningConfiguration from "./putImageScanningConfiguration";
import putImageTagMutability from "./putImageTagMutability";
import putLifecyclePolicy from "./putLifecyclePolicy";
import putRegistryPolicy from "./putRegistryPolicy";
import putRegistryScanningConfiguration from "./putRegistryScanningConfiguration";
import putReplicationConfiguration from "./putReplicationConfiguration";
import setRepositoryPolicy from "./setRepositoryPolicy";
import startImageScan from "./startImageScan";
import startLifecyclePolicyPreview from "./startLifecyclePolicyPreview";
import tagResource from "./tagResource";
import untagResource from "./untagResource";
import updatePullThroughCacheRule from "./updatePullThroughCacheRule";
import updateRepositoryCreationTemplate from "./updateRepositoryCreationTemplate";
import uploadLayerPart from "./uploadLayerPart";
import validatePullThroughCacheRule from "./validatePullThroughCacheRule";

export const blocks = {
  batchCheckLayerAvailability,
  batchDeleteImage,
  batchGetImage,
  batchGetRepositoryScanningConfiguration,
  completeLayerUpload,
  createPullThroughCacheRule,
  createRepository,
  createRepositoryCreationTemplate,
  deleteLifecyclePolicy,
  deletePullThroughCacheRule,
  deleteRegistryPolicy,
  deleteRepository,
  deleteRepositoryCreationTemplate,
  deleteRepositoryPolicy,
  describeImageReplicationStatus,
  describeImageScanFindings,
  describeImages,
  describePullThroughCacheRules,
  describeRegistry,
  describeRepositories,
  describeRepositoryCreationTemplates,
  getAccountSetting,
  getAuthorizationToken,
  getDownloadUrlForLayer,
  getLifecyclePolicy,
  getLifecyclePolicyPreview,
  getRegistryPolicy,
  getRegistryScanningConfiguration,
  getRepositoryPolicy,
  initiateLayerUpload,
  listImages,
  listTagsForResource,
  putAccountSetting,
  putImage,
  putImageScanningConfiguration,
  putImageTagMutability,
  putLifecyclePolicy,
  putRegistryPolicy,
  putRegistryScanningConfiguration,
  putReplicationConfiguration,
  setRepositoryPolicy,
  startImageScan,
  startLifecyclePolicyPreview,
  tagResource,
  untagResource,
  updatePullThroughCacheRule,
  updateRepositoryCreationTemplate,
  uploadLayerPart,
  validatePullThroughCacheRule,
};
