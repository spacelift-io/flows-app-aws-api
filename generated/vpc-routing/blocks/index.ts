import createRouteTable from "./createRouteTable";
import deleteRouteTable from "./deleteRouteTable";
import describeRouteTables from "./describeRouteTables";
import createRoute from "./createRoute";
import deleteRoute from "./deleteRoute";
import replaceRoute from "./replaceRoute";
import associateRouteTable from "./associateRouteTable";
import disassociateRouteTable from "./disassociateRouteTable";
import replaceRouteTableAssociation from "./replaceRouteTableAssociation";
import createInternetGateway from "./createInternetGateway";
import deleteInternetGateway from "./deleteInternetGateway";
import attachInternetGateway from "./attachInternetGateway";
import detachInternetGateway from "./detachInternetGateway";
import describeInternetGateways from "./describeInternetGateways";
import createEgressOnlyInternetGateway from "./createEgressOnlyInternetGateway";
import deleteEgressOnlyInternetGateway from "./deleteEgressOnlyInternetGateway";
import describeEgressOnlyInternetGateways from "./describeEgressOnlyInternetGateways";
import createNatGateway from "./createNatGateway";
import deleteNatGateway from "./deleteNatGateway";
import describeNatGateways from "./describeNatGateways";
import assignPrivateNatGatewayAddress from "./assignPrivateNatGatewayAddress";
import unassignPrivateNatGatewayAddress from "./unassignPrivateNatGatewayAddress";
import associateNatGatewayAddress from "./associateNatGatewayAddress";
import disassociateNatGatewayAddress from "./disassociateNatGatewayAddress";
import allocateAddress from "./allocateAddress";
import releaseAddress from "./releaseAddress";
import associateAddress from "./associateAddress";
import disassociateAddress from "./disassociateAddress";
import describeAddresses from "./describeAddresses";
import describeAddressesAttribute from "./describeAddressesAttribute";
import modifyAddressAttribute from "./modifyAddressAttribute";
import resetAddressAttribute from "./resetAddressAttribute";
import acceptAddressTransfer from "./acceptAddressTransfer";
import enableAddressTransfer from "./enableAddressTransfer";
import disableAddressTransfer from "./disableAddressTransfer";
import describeAddressTransfers from "./describeAddressTransfers";
import moveAddressToVpc from "./moveAddressToVpc";
import restoreAddressToClassic from "./restoreAddressToClassic";
import describeMovingAddresses from "./describeMovingAddresses";
import assignIpv6Addresses from "./assignIpv6Addresses";
import unassignIpv6Addresses from "./unassignIpv6Addresses";
import assignPrivateIpAddresses from "./assignPrivateIpAddresses";
import unassignPrivateIpAddresses from "./unassignPrivateIpAddresses";
import modifyPrivateDnsNameOptions from "./modifyPrivateDnsNameOptions";
import modifyPublicIpDnsNameOptions from "./modifyPublicIpDnsNameOptions";

export const blocks = {
  createRouteTable,
  deleteRouteTable,
  describeRouteTables,
  createRoute,
  deleteRoute,
  replaceRoute,
  associateRouteTable,
  disassociateRouteTable,
  replaceRouteTableAssociation,
  createInternetGateway,
  deleteInternetGateway,
  attachInternetGateway,
  detachInternetGateway,
  describeInternetGateways,
  createEgressOnlyInternetGateway,
  deleteEgressOnlyInternetGateway,
  describeEgressOnlyInternetGateways,
  createNatGateway,
  deleteNatGateway,
  describeNatGateways,
  assignPrivateNatGatewayAddress,
  unassignPrivateNatGatewayAddress,
  associateNatGatewayAddress,
  disassociateNatGatewayAddress,
  allocateAddress,
  releaseAddress,
  associateAddress,
  disassociateAddress,
  describeAddresses,
  describeAddressesAttribute,
  modifyAddressAttribute,
  resetAddressAttribute,
  acceptAddressTransfer,
  enableAddressTransfer,
  disableAddressTransfer,
  describeAddressTransfers,
  moveAddressToVpc,
  restoreAddressToClassic,
  describeMovingAddresses,
  assignIpv6Addresses,
  unassignIpv6Addresses,
  assignPrivateIpAddresses,
  unassignPrivateIpAddresses,
  modifyPrivateDnsNameOptions,
  modifyPublicIpDnsNameOptions,
};
