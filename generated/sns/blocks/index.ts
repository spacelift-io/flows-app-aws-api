import addPermission from "./addPermission";
import checkIfPhoneNumberIsOptedOut from "./checkIfPhoneNumberIsOptedOut";
import confirmSubscription from "./confirmSubscription";
import createPlatformApplication from "./createPlatformApplication";
import createPlatformEndpoint from "./createPlatformEndpoint";
import createSMSSandboxPhoneNumber from "./createSMSSandboxPhoneNumber";
import createTopic from "./createTopic";
import deleteEndpoint from "./deleteEndpoint";
import deletePlatformApplication from "./deletePlatformApplication";
import deleteSMSSandboxPhoneNumber from "./deleteSMSSandboxPhoneNumber";
import deleteTopic from "./deleteTopic";
import getDataProtectionPolicy from "./getDataProtectionPolicy";
import getEndpointAttributes from "./getEndpointAttributes";
import getPlatformApplicationAttributes from "./getPlatformApplicationAttributes";
import getSMSAttributes from "./getSMSAttributes";
import getSMSSandboxAccountStatus from "./getSMSSandboxAccountStatus";
import getSubscriptionAttributes from "./getSubscriptionAttributes";
import getTopicAttributes from "./getTopicAttributes";
import listEndpointsByPlatformApplication from "./listEndpointsByPlatformApplication";
import listOriginationNumbers from "./listOriginationNumbers";
import listPhoneNumbersOptedOut from "./listPhoneNumbersOptedOut";
import listPlatformApplications from "./listPlatformApplications";
import listSMSSandboxPhoneNumbers from "./listSMSSandboxPhoneNumbers";
import listSubscriptions from "./listSubscriptions";
import listSubscriptionsByTopic from "./listSubscriptionsByTopic";
import listTagsForResource from "./listTagsForResource";
import listTopics from "./listTopics";
import optInPhoneNumber from "./optInPhoneNumber";
import publish from "./publish";
import publishBatch from "./publishBatch";
import putDataProtectionPolicy from "./putDataProtectionPolicy";
import removePermission from "./removePermission";
import setEndpointAttributes from "./setEndpointAttributes";
import setPlatformApplicationAttributes from "./setPlatformApplicationAttributes";
import setSMSAttributes from "./setSMSAttributes";
import setSubscriptionAttributes from "./setSubscriptionAttributes";
import setTopicAttributes from "./setTopicAttributes";
import subscribe from "./subscribe";
import tagResource from "./tagResource";
import unsubscribe from "./unsubscribe";
import untagResource from "./untagResource";
import verifySMSSandboxPhoneNumber from "./verifySMSSandboxPhoneNumber";

export const blocks = {
  addPermission,
  checkIfPhoneNumberIsOptedOut,
  confirmSubscription,
  createPlatformApplication,
  createPlatformEndpoint,
  createSMSSandboxPhoneNumber,
  createTopic,
  deleteEndpoint,
  deletePlatformApplication,
  deleteSMSSandboxPhoneNumber,
  deleteTopic,
  getDataProtectionPolicy,
  getEndpointAttributes,
  getPlatformApplicationAttributes,
  getSMSAttributes,
  getSMSSandboxAccountStatus,
  getSubscriptionAttributes,
  getTopicAttributes,
  listEndpointsByPlatformApplication,
  listOriginationNumbers,
  listPhoneNumbersOptedOut,
  listPlatformApplications,
  listSMSSandboxPhoneNumbers,
  listSubscriptions,
  listSubscriptionsByTopic,
  listTagsForResource,
  listTopics,
  optInPhoneNumber,
  publish,
  publishBatch,
  putDataProtectionPolicy,
  removePermission,
  setEndpointAttributes,
  setPlatformApplicationAttributes,
  setSMSAttributes,
  setSubscriptionAttributes,
  setTopicAttributes,
  subscribe,
  tagResource,
  unsubscribe,
  untagResource,
  verifySMSSandboxPhoneNumber,
};
