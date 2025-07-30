import cloneReceiptRuleSet from "./cloneReceiptRuleSet";
import createConfigurationSet from "./createConfigurationSet";
import createConfigurationSetEventDestination from "./createConfigurationSetEventDestination";
import createConfigurationSetTrackingOptions from "./createConfigurationSetTrackingOptions";
import createCustomVerificationEmailTemplate from "./createCustomVerificationEmailTemplate";
import createReceiptFilter from "./createReceiptFilter";
import createReceiptRule from "./createReceiptRule";
import createReceiptRuleSet from "./createReceiptRuleSet";
import createTemplate from "./createTemplate";
import deleteConfigurationSet from "./deleteConfigurationSet";
import deleteConfigurationSetEventDestination from "./deleteConfigurationSetEventDestination";
import deleteConfigurationSetTrackingOptions from "./deleteConfigurationSetTrackingOptions";
import deleteCustomVerificationEmailTemplate from "./deleteCustomVerificationEmailTemplate";
import deleteIdentity from "./deleteIdentity";
import deleteIdentityPolicy from "./deleteIdentityPolicy";
import deleteReceiptFilter from "./deleteReceiptFilter";
import deleteReceiptRule from "./deleteReceiptRule";
import deleteReceiptRuleSet from "./deleteReceiptRuleSet";
import deleteTemplate from "./deleteTemplate";
import deleteVerifiedEmailAddress from "./deleteVerifiedEmailAddress";
import describeActiveReceiptRuleSet from "./describeActiveReceiptRuleSet";
import describeConfigurationSet from "./describeConfigurationSet";
import describeReceiptRule from "./describeReceiptRule";
import describeReceiptRuleSet from "./describeReceiptRuleSet";
import getAccountSendingEnabled from "./getAccountSendingEnabled";
import getCustomVerificationEmailTemplate from "./getCustomVerificationEmailTemplate";
import getIdentityDkimAttributes from "./getIdentityDkimAttributes";
import getIdentityMailFromDomainAttributes from "./getIdentityMailFromDomainAttributes";
import getIdentityNotificationAttributes from "./getIdentityNotificationAttributes";
import getIdentityPolicies from "./getIdentityPolicies";
import getIdentityVerificationAttributes from "./getIdentityVerificationAttributes";
import getSendQuota from "./getSendQuota";
import getSendStatistics from "./getSendStatistics";
import getTemplate from "./getTemplate";
import listConfigurationSets from "./listConfigurationSets";
import listCustomVerificationEmailTemplates from "./listCustomVerificationEmailTemplates";
import listIdentities from "./listIdentities";
import listIdentityPolicies from "./listIdentityPolicies";
import listReceiptFilters from "./listReceiptFilters";
import listReceiptRuleSets from "./listReceiptRuleSets";
import listTemplates from "./listTemplates";
import listVerifiedEmailAddresses from "./listVerifiedEmailAddresses";
import putConfigurationSetDeliveryOptions from "./putConfigurationSetDeliveryOptions";
import putIdentityPolicy from "./putIdentityPolicy";
import reorderReceiptRuleSet from "./reorderReceiptRuleSet";
import sendBounce from "./sendBounce";
import sendBulkTemplatedEmail from "./sendBulkTemplatedEmail";
import sendCustomVerificationEmail from "./sendCustomVerificationEmail";
import sendEmail from "./sendEmail";
import sendRawEmail from "./sendRawEmail";
import sendTemplatedEmail from "./sendTemplatedEmail";
import setActiveReceiptRuleSet from "./setActiveReceiptRuleSet";
import setIdentityDkimEnabled from "./setIdentityDkimEnabled";
import setIdentityFeedbackForwardingEnabled from "./setIdentityFeedbackForwardingEnabled";
import setIdentityHeadersInNotificationsEnabled from "./setIdentityHeadersInNotificationsEnabled";
import setIdentityMailFromDomain from "./setIdentityMailFromDomain";
import setIdentityNotificationTopic from "./setIdentityNotificationTopic";
import setReceiptRulePosition from "./setReceiptRulePosition";
import testRenderTemplate from "./testRenderTemplate";
import updateAccountSendingEnabled from "./updateAccountSendingEnabled";
import updateConfigurationSetEventDestination from "./updateConfigurationSetEventDestination";
import updateConfigurationSetReputationMetricsEnabled from "./updateConfigurationSetReputationMetricsEnabled";
import updateConfigurationSetSendingEnabled from "./updateConfigurationSetSendingEnabled";
import updateConfigurationSetTrackingOptions from "./updateConfigurationSetTrackingOptions";
import updateCustomVerificationEmailTemplate from "./updateCustomVerificationEmailTemplate";
import updateReceiptRule from "./updateReceiptRule";
import updateTemplate from "./updateTemplate";
import verifyDomainDkim from "./verifyDomainDkim";
import verifyDomainIdentity from "./verifyDomainIdentity";
import verifyEmailAddress from "./verifyEmailAddress";
import verifyEmailIdentity from "./verifyEmailIdentity";

export const blocks = {
  cloneReceiptRuleSet,
  createConfigurationSet,
  createConfigurationSetEventDestination,
  createConfigurationSetTrackingOptions,
  createCustomVerificationEmailTemplate,
  createReceiptFilter,
  createReceiptRule,
  createReceiptRuleSet,
  createTemplate,
  deleteConfigurationSet,
  deleteConfigurationSetEventDestination,
  deleteConfigurationSetTrackingOptions,
  deleteCustomVerificationEmailTemplate,
  deleteIdentity,
  deleteIdentityPolicy,
  deleteReceiptFilter,
  deleteReceiptRule,
  deleteReceiptRuleSet,
  deleteTemplate,
  deleteVerifiedEmailAddress,
  describeActiveReceiptRuleSet,
  describeConfigurationSet,
  describeReceiptRule,
  describeReceiptRuleSet,
  getAccountSendingEnabled,
  getCustomVerificationEmailTemplate,
  getIdentityDkimAttributes,
  getIdentityMailFromDomainAttributes,
  getIdentityNotificationAttributes,
  getIdentityPolicies,
  getIdentityVerificationAttributes,
  getSendQuota,
  getSendStatistics,
  getTemplate,
  listConfigurationSets,
  listCustomVerificationEmailTemplates,
  listIdentities,
  listIdentityPolicies,
  listReceiptFilters,
  listReceiptRuleSets,
  listTemplates,
  listVerifiedEmailAddresses,
  putConfigurationSetDeliveryOptions,
  putIdentityPolicy,
  reorderReceiptRuleSet,
  sendBounce,
  sendBulkTemplatedEmail,
  sendCustomVerificationEmail,
  sendEmail,
  sendRawEmail,
  sendTemplatedEmail,
  setActiveReceiptRuleSet,
  setIdentityDkimEnabled,
  setIdentityFeedbackForwardingEnabled,
  setIdentityHeadersInNotificationsEnabled,
  setIdentityMailFromDomain,
  setIdentityNotificationTopic,
  setReceiptRulePosition,
  testRenderTemplate,
  updateAccountSendingEnabled,
  updateConfigurationSetEventDestination,
  updateConfigurationSetReputationMetricsEnabled,
  updateConfigurationSetSendingEnabled,
  updateConfigurationSetTrackingOptions,
  updateCustomVerificationEmailTemplate,
  updateReceiptRule,
  updateTemplate,
  verifyDomainDkim,
  verifyDomainIdentity,
  verifyEmailAddress,
  verifyEmailIdentity,
};
