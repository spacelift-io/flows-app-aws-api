import createSecurityGroup from "./createSecurityGroup";
import deleteSecurityGroup from "./deleteSecurityGroup";
import describeSecurityGroups from "./describeSecurityGroups";
import authorizeSecurityGroupIngress from "./authorizeSecurityGroupIngress";
import revokeSecurityGroupIngress from "./revokeSecurityGroupIngress";
import authorizeSecurityGroupEgress from "./authorizeSecurityGroupEgress";
import revokeSecurityGroupEgress from "./revokeSecurityGroupEgress";
import describeSecurityGroupRules from "./describeSecurityGroupRules";
import modifySecurityGroupRules from "./modifySecurityGroupRules";
import updateSecurityGroupRuleDescriptionsIngress from "./updateSecurityGroupRuleDescriptionsIngress";
import updateSecurityGroupRuleDescriptionsEgress from "./updateSecurityGroupRuleDescriptionsEgress";
import describeSecurityGroupReferences from "./describeSecurityGroupReferences";
import describeStaleSecurityGroups from "./describeStaleSecurityGroups";
import associateSecurityGroupVpc from "./associateSecurityGroupVpc";
import disassociateSecurityGroupVpc from "./disassociateSecurityGroupVpc";
import describeSecurityGroupVpcAssociations from "./describeSecurityGroupVpcAssociations";
import getSecurityGroupsForVpc from "./getSecurityGroupsForVpc";
import createNetworkInterface from "./createNetworkInterface";
import deleteNetworkInterface from "./deleteNetworkInterface";
import attachNetworkInterface from "./attachNetworkInterface";
import detachNetworkInterface from "./detachNetworkInterface";
import describeNetworkInterfaces from "./describeNetworkInterfaces";
import describeNetworkInterfaceAttribute from "./describeNetworkInterfaceAttribute";
import modifyNetworkInterfaceAttribute from "./modifyNetworkInterfaceAttribute";
import resetNetworkInterfaceAttribute from "./resetNetworkInterfaceAttribute";
import createNetworkInterfacePermission from "./createNetworkInterfacePermission";
import deleteNetworkInterfacePermission from "./deleteNetworkInterfacePermission";
import describeNetworkInterfacePermissions from "./describeNetworkInterfacePermissions";
import associateTrunkInterface from "./associateTrunkInterface";
import disassociateTrunkInterface from "./disassociateTrunkInterface";
import describeTrunkInterfaceAssociations from "./describeTrunkInterfaceAssociations";
import createNetworkAcl from "./createNetworkAcl";
import deleteNetworkAcl from "./deleteNetworkAcl";
import describeNetworkAcls from "./describeNetworkAcls";
import createNetworkAclEntry from "./createNetworkAclEntry";
import deleteNetworkAclEntry from "./deleteNetworkAclEntry";
import replaceNetworkAclEntry from "./replaceNetworkAclEntry";
import replaceNetworkAclAssociation from "./replaceNetworkAclAssociation";

export const blocks = {
  createSecurityGroup,
  deleteSecurityGroup,
  describeSecurityGroups,
  authorizeSecurityGroupIngress,
  revokeSecurityGroupIngress,
  authorizeSecurityGroupEgress,
  revokeSecurityGroupEgress,
  describeSecurityGroupRules,
  modifySecurityGroupRules,
  updateSecurityGroupRuleDescriptionsIngress,
  updateSecurityGroupRuleDescriptionsEgress,
  describeSecurityGroupReferences,
  describeStaleSecurityGroups,
  associateSecurityGroupVpc,
  disassociateSecurityGroupVpc,
  describeSecurityGroupVpcAssociations,
  getSecurityGroupsForVpc,
  createNetworkInterface,
  deleteNetworkInterface,
  attachNetworkInterface,
  detachNetworkInterface,
  describeNetworkInterfaces,
  describeNetworkInterfaceAttribute,
  modifyNetworkInterfaceAttribute,
  resetNetworkInterfaceAttribute,
  createNetworkInterfacePermission,
  deleteNetworkInterfacePermission,
  describeNetworkInterfacePermissions,
  associateTrunkInterface,
  disassociateTrunkInterface,
  describeTrunkInterfaceAssociations,
  createNetworkAcl,
  deleteNetworkAcl,
  describeNetworkAcls,
  createNetworkAclEntry,
  deleteNetworkAclEntry,
  replaceNetworkAclEntry,
  replaceNetworkAclAssociation,
};
