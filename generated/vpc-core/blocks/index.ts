import createVpc from "./createVpc";
import deleteVpc from "./deleteVpc";
import describeVpcs from "./describeVpcs";
import describeVpcAttribute from "./describeVpcAttribute";
import modifyVpcAttribute from "./modifyVpcAttribute";
import modifyVpcTenancy from "./modifyVpcTenancy";
import createDefaultVpc from "./createDefaultVpc";
import associateVpcCidrBlock from "./associateVpcCidrBlock";
import disassociateVpcCidrBlock from "./disassociateVpcCidrBlock";
import enableVpcClassicLink from "./enableVpcClassicLink";
import disableVpcClassicLink from "./disableVpcClassicLink";
import describeVpcClassicLink from "./describeVpcClassicLink";
import enableVpcClassicLinkDnsSupport from "./enableVpcClassicLinkDnsSupport";
import disableVpcClassicLinkDnsSupport from "./disableVpcClassicLinkDnsSupport";
import describeVpcClassicLinkDnsSupport from "./describeVpcClassicLinkDnsSupport";
import attachClassicLinkVpc from "./attachClassicLinkVpc";
import detachClassicLinkVpc from "./detachClassicLinkVpc";
import describeClassicLinkInstances from "./describeClassicLinkInstances";
import createSubnet from "./createSubnet";
import deleteSubnet from "./deleteSubnet";
import describeSubnets from "./describeSubnets";
import modifySubnetAttribute from "./modifySubnetAttribute";
import createDefaultSubnet from "./createDefaultSubnet";
import associateSubnetCidrBlock from "./associateSubnetCidrBlock";
import disassociateSubnetCidrBlock from "./disassociateSubnetCidrBlock";
import createSubnetCidrReservation from "./createSubnetCidrReservation";
import deleteSubnetCidrReservation from "./deleteSubnetCidrReservation";
import getSubnetCidrReservations from "./getSubnetCidrReservations";
import createDhcpOptions from "./createDhcpOptions";
import deleteDhcpOptions from "./deleteDhcpOptions";
import describeDhcpOptions from "./describeDhcpOptions";
import associateDhcpOptions from "./associateDhcpOptions";
import createFlowLogs from "./createFlowLogs";
import deleteFlowLogs from "./deleteFlowLogs";
import describeFlowLogs from "./describeFlowLogs";
import getFlowLogsIntegrationTemplate from "./getFlowLogsIntegrationTemplate";
import createVpcBlockPublicAccessExclusion from "./createVpcBlockPublicAccessExclusion";
import deleteVpcBlockPublicAccessExclusion from "./deleteVpcBlockPublicAccessExclusion";
import modifyVpcBlockPublicAccessExclusion from "./modifyVpcBlockPublicAccessExclusion";
import describeVpcBlockPublicAccessExclusions from "./describeVpcBlockPublicAccessExclusions";
import modifyVpcBlockPublicAccessOptions from "./modifyVpcBlockPublicAccessOptions";
import describeVpcBlockPublicAccessOptions from "./describeVpcBlockPublicAccessOptions";
import createVpcPeeringConnection from "./createVpcPeeringConnection";
import deleteVpcPeeringConnection from "./deleteVpcPeeringConnection";
import describeVpcPeeringConnections from "./describeVpcPeeringConnections";
import acceptVpcPeeringConnection from "./acceptVpcPeeringConnection";
import rejectVpcPeeringConnection from "./rejectVpcPeeringConnection";
import modifyVpcPeeringConnectionOptions from "./modifyVpcPeeringConnectionOptions";

export const blocks = {
  createVpc,
  deleteVpc,
  describeVpcs,
  describeVpcAttribute,
  modifyVpcAttribute,
  modifyVpcTenancy,
  createDefaultVpc,
  associateVpcCidrBlock,
  disassociateVpcCidrBlock,
  enableVpcClassicLink,
  disableVpcClassicLink,
  describeVpcClassicLink,
  enableVpcClassicLinkDnsSupport,
  disableVpcClassicLinkDnsSupport,
  describeVpcClassicLinkDnsSupport,
  attachClassicLinkVpc,
  detachClassicLinkVpc,
  describeClassicLinkInstances,
  createSubnet,
  deleteSubnet,
  describeSubnets,
  modifySubnetAttribute,
  createDefaultSubnet,
  associateSubnetCidrBlock,
  disassociateSubnetCidrBlock,
  createSubnetCidrReservation,
  deleteSubnetCidrReservation,
  getSubnetCidrReservations,
  createDhcpOptions,
  deleteDhcpOptions,
  describeDhcpOptions,
  associateDhcpOptions,
  createFlowLogs,
  deleteFlowLogs,
  describeFlowLogs,
  getFlowLogsIntegrationTemplate,
  createVpcBlockPublicAccessExclusion,
  deleteVpcBlockPublicAccessExclusion,
  modifyVpcBlockPublicAccessExclusion,
  describeVpcBlockPublicAccessExclusions,
  modifyVpcBlockPublicAccessOptions,
  describeVpcBlockPublicAccessOptions,
  createVpcPeeringConnection,
  deleteVpcPeeringConnection,
  describeVpcPeeringConnections,
  acceptVpcPeeringConnection,
  rejectVpcPeeringConnection,
  modifyVpcPeeringConnectionOptions,
};
