import associateAlias from "./associateAlias";
import associateDistributionTenantWebACL from "./associateDistributionTenantWebACL";
import associateDistributionWebACL from "./associateDistributionWebACL";
import copyDistribution from "./copyDistribution";
import createAnycastIpList from "./createAnycastIpList";
import createCachePolicy from "./createCachePolicy";
import createCloudFrontOriginAccessIdentity from "./createCloudFrontOriginAccessIdentity";
import createConnectionGroup from "./createConnectionGroup";
import createContinuousDeploymentPolicy from "./createContinuousDeploymentPolicy";
import createDistribution from "./createDistribution";
import createDistributionTenant from "./createDistributionTenant";
import createDistributionWithTags from "./createDistributionWithTags";
import createFieldLevelEncryptionConfig from "./createFieldLevelEncryptionConfig";
import createFieldLevelEncryptionProfile from "./createFieldLevelEncryptionProfile";
import createFunction from "./createFunction";
import createInvalidation from "./createInvalidation";
import createInvalidationForDistributionTenant from "./createInvalidationForDistributionTenant";
import createKeyGroup from "./createKeyGroup";
import createKeyValueStore from "./createKeyValueStore";
import createMonitoringSubscription from "./createMonitoringSubscription";
import createOriginAccessControl from "./createOriginAccessControl";
import createOriginRequestPolicy from "./createOriginRequestPolicy";
import createPublicKey from "./createPublicKey";
import createRealtimeLogConfig from "./createRealtimeLogConfig";
import createResponseHeadersPolicy from "./createResponseHeadersPolicy";
import createStreamingDistribution from "./createStreamingDistribution";
import createStreamingDistributionWithTags from "./createStreamingDistributionWithTags";
import createVpcOrigin from "./createVpcOrigin";
import deleteAnycastIpList from "./deleteAnycastIpList";
import deleteCachePolicy from "./deleteCachePolicy";
import deleteCloudFrontOriginAccessIdentity from "./deleteCloudFrontOriginAccessIdentity";
import deleteConnectionGroup from "./deleteConnectionGroup";
import deleteContinuousDeploymentPolicy from "./deleteContinuousDeploymentPolicy";
import deleteDistribution from "./deleteDistribution";
import deleteDistributionTenant from "./deleteDistributionTenant";
import deleteFieldLevelEncryptionConfig from "./deleteFieldLevelEncryptionConfig";
import deleteFieldLevelEncryptionProfile from "./deleteFieldLevelEncryptionProfile";
import deleteFunction from "./deleteFunction";
import deleteKeyGroup from "./deleteKeyGroup";
import deleteKeyValueStore from "./deleteKeyValueStore";
import deleteMonitoringSubscription from "./deleteMonitoringSubscription";
import deleteOriginAccessControl from "./deleteOriginAccessControl";
import deleteOriginRequestPolicy from "./deleteOriginRequestPolicy";
import deletePublicKey from "./deletePublicKey";
import deleteRealtimeLogConfig from "./deleteRealtimeLogConfig";
import deleteResponseHeadersPolicy from "./deleteResponseHeadersPolicy";
import deleteStreamingDistribution from "./deleteStreamingDistribution";
import deleteVpcOrigin from "./deleteVpcOrigin";
import describeFunction from "./describeFunction";
import describeKeyValueStore from "./describeKeyValueStore";
import disassociateDistributionTenantWebACL from "./disassociateDistributionTenantWebACL";
import disassociateDistributionWebACL from "./disassociateDistributionWebACL";
import getAnycastIpList from "./getAnycastIpList";
import getCachePolicy from "./getCachePolicy";
import getCachePolicyConfig from "./getCachePolicyConfig";
import getCloudFrontOriginAccessIdentity from "./getCloudFrontOriginAccessIdentity";
import getCloudFrontOriginAccessIdentityConfig from "./getCloudFrontOriginAccessIdentityConfig";
import getConnectionGroup from "./getConnectionGroup";
import getConnectionGroupByRoutingEndpoint from "./getConnectionGroupByRoutingEndpoint";
import getContinuousDeploymentPolicy from "./getContinuousDeploymentPolicy";
import getContinuousDeploymentPolicyConfig from "./getContinuousDeploymentPolicyConfig";
import getDistribution from "./getDistribution";
import getDistributionConfig from "./getDistributionConfig";
import getDistributionTenant from "./getDistributionTenant";
import getDistributionTenantByDomain from "./getDistributionTenantByDomain";
import getFieldLevelEncryption from "./getFieldLevelEncryption";
import getFieldLevelEncryptionConfig from "./getFieldLevelEncryptionConfig";
import getFieldLevelEncryptionProfile from "./getFieldLevelEncryptionProfile";
import getFieldLevelEncryptionProfileConfig from "./getFieldLevelEncryptionProfileConfig";
import getFunction from "./getFunction";
import getInvalidation from "./getInvalidation";
import getInvalidationForDistributionTenant from "./getInvalidationForDistributionTenant";
import getKeyGroup from "./getKeyGroup";
import getKeyGroupConfig from "./getKeyGroupConfig";
import getManagedCertificateDetails from "./getManagedCertificateDetails";
import getMonitoringSubscription from "./getMonitoringSubscription";
import getOriginAccessControl from "./getOriginAccessControl";
import getOriginAccessControlConfig from "./getOriginAccessControlConfig";
import getOriginRequestPolicy from "./getOriginRequestPolicy";
import getOriginRequestPolicyConfig from "./getOriginRequestPolicyConfig";
import getPublicKey from "./getPublicKey";
import getPublicKeyConfig from "./getPublicKeyConfig";
import getRealtimeLogConfig from "./getRealtimeLogConfig";
import getResponseHeadersPolicy from "./getResponseHeadersPolicy";
import getResponseHeadersPolicyConfig from "./getResponseHeadersPolicyConfig";
import getStreamingDistribution from "./getStreamingDistribution";
import getStreamingDistributionConfig from "./getStreamingDistributionConfig";
import getVpcOrigin from "./getVpcOrigin";
import listAnycastIpLists from "./listAnycastIpLists";
import listCachePolicies from "./listCachePolicies";
import listCloudFrontOriginAccessIdentities from "./listCloudFrontOriginAccessIdentities";
import listConflictingAliases from "./listConflictingAliases";
import listConnectionGroups from "./listConnectionGroups";
import listContinuousDeploymentPolicies from "./listContinuousDeploymentPolicies";
import listDistributionTenants from "./listDistributionTenants";
import listDistributionTenantsByCustomization from "./listDistributionTenantsByCustomization";
import listDistributions from "./listDistributions";
import listDistributionsByAnycastIpListId from "./listDistributionsByAnycastIpListId";
import listDistributionsByCachePolicyId from "./listDistributionsByCachePolicyId";
import listDistributionsByConnectionMode from "./listDistributionsByConnectionMode";
import listDistributionsByKeyGroup from "./listDistributionsByKeyGroup";
import listDistributionsByOriginRequestPolicyId from "./listDistributionsByOriginRequestPolicyId";
import listDistributionsByRealtimeLogConfig from "./listDistributionsByRealtimeLogConfig";
import listDistributionsByResponseHeadersPolicyId from "./listDistributionsByResponseHeadersPolicyId";
import listDistributionsByVpcOriginId from "./listDistributionsByVpcOriginId";
import listDistributionsByWebACLId from "./listDistributionsByWebACLId";
import listDomainConflicts from "./listDomainConflicts";
import listFieldLevelEncryptionConfigs from "./listFieldLevelEncryptionConfigs";
import listFieldLevelEncryptionProfiles from "./listFieldLevelEncryptionProfiles";
import listFunctions from "./listFunctions";
import listInvalidations from "./listInvalidations";
import listInvalidationsForDistributionTenant from "./listInvalidationsForDistributionTenant";
import listKeyGroups from "./listKeyGroups";
import listKeyValueStores from "./listKeyValueStores";
import listOriginAccessControls from "./listOriginAccessControls";
import listOriginRequestPolicies from "./listOriginRequestPolicies";
import listPublicKeys from "./listPublicKeys";
import listRealtimeLogConfigs from "./listRealtimeLogConfigs";
import listResponseHeadersPolicies from "./listResponseHeadersPolicies";
import listStreamingDistributions from "./listStreamingDistributions";
import listTagsForResource from "./listTagsForResource";
import listVpcOrigins from "./listVpcOrigins";
import publishFunction from "./publishFunction";
import tagResource from "./tagResource";
import testFunction from "./testFunction";
import untagResource from "./untagResource";
import updateCachePolicy from "./updateCachePolicy";
import updateCloudFrontOriginAccessIdentity from "./updateCloudFrontOriginAccessIdentity";
import updateConnectionGroup from "./updateConnectionGroup";
import updateContinuousDeploymentPolicy from "./updateContinuousDeploymentPolicy";
import updateDistribution from "./updateDistribution";
import updateDistributionTenant from "./updateDistributionTenant";
import updateDistributionWithStagingConfig from "./updateDistributionWithStagingConfig";
import updateDomainAssociation from "./updateDomainAssociation";
import updateFieldLevelEncryptionConfig from "./updateFieldLevelEncryptionConfig";
import updateFieldLevelEncryptionProfile from "./updateFieldLevelEncryptionProfile";
import updateFunction from "./updateFunction";
import updateKeyGroup from "./updateKeyGroup";
import updateKeyValueStore from "./updateKeyValueStore";
import updateOriginAccessControl from "./updateOriginAccessControl";
import updateOriginRequestPolicy from "./updateOriginRequestPolicy";
import updatePublicKey from "./updatePublicKey";
import updateRealtimeLogConfig from "./updateRealtimeLogConfig";
import updateResponseHeadersPolicy from "./updateResponseHeadersPolicy";
import updateStreamingDistribution from "./updateStreamingDistribution";
import updateVpcOrigin from "./updateVpcOrigin";
import verifyDnsConfiguration from "./verifyDnsConfiguration";

export const blocks = {
  associateAlias,
  associateDistributionTenantWebACL,
  associateDistributionWebACL,
  copyDistribution,
  createAnycastIpList,
  createCachePolicy,
  createCloudFrontOriginAccessIdentity,
  createConnectionGroup,
  createContinuousDeploymentPolicy,
  createDistribution,
  createDistributionTenant,
  createDistributionWithTags,
  createFieldLevelEncryptionConfig,
  createFieldLevelEncryptionProfile,
  createFunction,
  createInvalidation,
  createInvalidationForDistributionTenant,
  createKeyGroup,
  createKeyValueStore,
  createMonitoringSubscription,
  createOriginAccessControl,
  createOriginRequestPolicy,
  createPublicKey,
  createRealtimeLogConfig,
  createResponseHeadersPolicy,
  createStreamingDistribution,
  createStreamingDistributionWithTags,
  createVpcOrigin,
  deleteAnycastIpList,
  deleteCachePolicy,
  deleteCloudFrontOriginAccessIdentity,
  deleteConnectionGroup,
  deleteContinuousDeploymentPolicy,
  deleteDistribution,
  deleteDistributionTenant,
  deleteFieldLevelEncryptionConfig,
  deleteFieldLevelEncryptionProfile,
  deleteFunction,
  deleteKeyGroup,
  deleteKeyValueStore,
  deleteMonitoringSubscription,
  deleteOriginAccessControl,
  deleteOriginRequestPolicy,
  deletePublicKey,
  deleteRealtimeLogConfig,
  deleteResponseHeadersPolicy,
  deleteStreamingDistribution,
  deleteVpcOrigin,
  describeFunction,
  describeKeyValueStore,
  disassociateDistributionTenantWebACL,
  disassociateDistributionWebACL,
  getAnycastIpList,
  getCachePolicy,
  getCachePolicyConfig,
  getCloudFrontOriginAccessIdentity,
  getCloudFrontOriginAccessIdentityConfig,
  getConnectionGroup,
  getConnectionGroupByRoutingEndpoint,
  getContinuousDeploymentPolicy,
  getContinuousDeploymentPolicyConfig,
  getDistribution,
  getDistributionConfig,
  getDistributionTenant,
  getDistributionTenantByDomain,
  getFieldLevelEncryption,
  getFieldLevelEncryptionConfig,
  getFieldLevelEncryptionProfile,
  getFieldLevelEncryptionProfileConfig,
  getFunction,
  getInvalidation,
  getInvalidationForDistributionTenant,
  getKeyGroup,
  getKeyGroupConfig,
  getManagedCertificateDetails,
  getMonitoringSubscription,
  getOriginAccessControl,
  getOriginAccessControlConfig,
  getOriginRequestPolicy,
  getOriginRequestPolicyConfig,
  getPublicKey,
  getPublicKeyConfig,
  getRealtimeLogConfig,
  getResponseHeadersPolicy,
  getResponseHeadersPolicyConfig,
  getStreamingDistribution,
  getStreamingDistributionConfig,
  getVpcOrigin,
  listAnycastIpLists,
  listCachePolicies,
  listCloudFrontOriginAccessIdentities,
  listConflictingAliases,
  listConnectionGroups,
  listContinuousDeploymentPolicies,
  listDistributionTenants,
  listDistributionTenantsByCustomization,
  listDistributions,
  listDistributionsByAnycastIpListId,
  listDistributionsByCachePolicyId,
  listDistributionsByConnectionMode,
  listDistributionsByKeyGroup,
  listDistributionsByOriginRequestPolicyId,
  listDistributionsByRealtimeLogConfig,
  listDistributionsByResponseHeadersPolicyId,
  listDistributionsByVpcOriginId,
  listDistributionsByWebACLId,
  listDomainConflicts,
  listFieldLevelEncryptionConfigs,
  listFieldLevelEncryptionProfiles,
  listFunctions,
  listInvalidations,
  listInvalidationsForDistributionTenant,
  listKeyGroups,
  listKeyValueStores,
  listOriginAccessControls,
  listOriginRequestPolicies,
  listPublicKeys,
  listRealtimeLogConfigs,
  listResponseHeadersPolicies,
  listStreamingDistributions,
  listTagsForResource,
  listVpcOrigins,
  publishFunction,
  tagResource,
  testFunction,
  untagResource,
  updateCachePolicy,
  updateCloudFrontOriginAccessIdentity,
  updateConnectionGroup,
  updateContinuousDeploymentPolicy,
  updateDistribution,
  updateDistributionTenant,
  updateDistributionWithStagingConfig,
  updateDomainAssociation,
  updateFieldLevelEncryptionConfig,
  updateFieldLevelEncryptionProfile,
  updateFunction,
  updateKeyGroup,
  updateKeyValueStore,
  updateOriginAccessControl,
  updateOriginRequestPolicy,
  updatePublicKey,
  updateRealtimeLogConfig,
  updateResponseHeadersPolicy,
  updateStreamingDistribution,
  updateVpcOrigin,
  verifyDnsConfiguration,
};
