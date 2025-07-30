import createCustomerGateway from "./createCustomerGateway";
import deleteCustomerGateway from "./deleteCustomerGateway";
import describeCustomerGateways from "./describeCustomerGateways";
import createVpnConnection from "./createVpnConnection";
import deleteVpnConnection from "./deleteVpnConnection";
import describeVpnConnections from "./describeVpnConnections";
import modifyVpnConnection from "./modifyVpnConnection";
import modifyVpnConnectionOptions from "./modifyVpnConnectionOptions";
import createVpnConnectionRoute from "./createVpnConnectionRoute";
import deleteVpnConnectionRoute from "./deleteVpnConnectionRoute";
import createVpnGateway from "./createVpnGateway";
import deleteVpnGateway from "./deleteVpnGateway";
import describeVpnGateways from "./describeVpnGateways";
import attachVpnGateway from "./attachVpnGateway";
import detachVpnGateway from "./detachVpnGateway";
import enableVgwRoutePropagation from "./enableVgwRoutePropagation";
import disableVgwRoutePropagation from "./disableVgwRoutePropagation";
import modifyVpnTunnelCertificate from "./modifyVpnTunnelCertificate";
import modifyVpnTunnelOptions from "./modifyVpnTunnelOptions";
import replaceVpnTunnel from "./replaceVpnTunnel";
import getVpnConnectionDeviceSampleConfiguration from "./getVpnConnectionDeviceSampleConfiguration";
import getVpnConnectionDeviceTypes from "./getVpnConnectionDeviceTypes";
import getVpnTunnelReplacementStatus from "./getVpnTunnelReplacementStatus";
import getActiveVpnTunnelStatus from "./getActiveVpnTunnelStatus";
import createCarrierGateway from "./createCarrierGateway";
import deleteCarrierGateway from "./deleteCarrierGateway";
import describeCarrierGateways from "./describeCarrierGateways";
import createClientVpnEndpoint from "./createClientVpnEndpoint";
import deleteClientVpnEndpoint from "./deleteClientVpnEndpoint";
import describeClientVpnEndpoints from "./describeClientVpnEndpoints";
import modifyClientVpnEndpoint from "./modifyClientVpnEndpoint";
import createClientVpnRoute from "./createClientVpnRoute";
import deleteClientVpnRoute from "./deleteClientVpnRoute";
import describeClientVpnRoutes from "./describeClientVpnRoutes";
import authorizeClientVpnIngress from "./authorizeClientVpnIngress";
import revokeClientVpnIngress from "./revokeClientVpnIngress";
import describeClientVpnAuthorizationRules from "./describeClientVpnAuthorizationRules";
import associateClientVpnTargetNetwork from "./associateClientVpnTargetNetwork";
import disassociateClientVpnTargetNetwork from "./disassociateClientVpnTargetNetwork";
import describeClientVpnTargetNetworks from "./describeClientVpnTargetNetworks";
import describeClientVpnConnections from "./describeClientVpnConnections";
import terminateClientVpnConnections from "./terminateClientVpnConnections";
import applySecurityGroupsToClientVpnTargetNetwork from "./applySecurityGroupsToClientVpnTargetNetwork";
import exportClientVpnClientConfiguration from "./exportClientVpnClientConfiguration";
import exportClientVpnClientCertificateRevocationList from "./exportClientVpnClientCertificateRevocationList";
import importClientVpnClientCertificateRevocationList from "./importClientVpnClientCertificateRevocationList";

export const blocks = {
  createCustomerGateway,
  deleteCustomerGateway,
  describeCustomerGateways,
  createVpnConnection,
  deleteVpnConnection,
  describeVpnConnections,
  modifyVpnConnection,
  modifyVpnConnectionOptions,
  createVpnConnectionRoute,
  deleteVpnConnectionRoute,
  createVpnGateway,
  deleteVpnGateway,
  describeVpnGateways,
  attachVpnGateway,
  detachVpnGateway,
  enableVgwRoutePropagation,
  disableVgwRoutePropagation,
  modifyVpnTunnelCertificate,
  modifyVpnTunnelOptions,
  replaceVpnTunnel,
  getVpnConnectionDeviceSampleConfiguration,
  getVpnConnectionDeviceTypes,
  getVpnTunnelReplacementStatus,
  getActiveVpnTunnelStatus,
  createCarrierGateway,
  deleteCarrierGateway,
  describeCarrierGateways,
  createClientVpnEndpoint,
  deleteClientVpnEndpoint,
  describeClientVpnEndpoints,
  modifyClientVpnEndpoint,
  createClientVpnRoute,
  deleteClientVpnRoute,
  describeClientVpnRoutes,
  authorizeClientVpnIngress,
  revokeClientVpnIngress,
  describeClientVpnAuthorizationRules,
  associateClientVpnTargetNetwork,
  disassociateClientVpnTargetNetwork,
  describeClientVpnTargetNetworks,
  describeClientVpnConnections,
  terminateClientVpnConnections,
  applySecurityGroupsToClientVpnTargetNetwork,
  exportClientVpnClientConfiguration,
  exportClientVpnClientCertificateRevocationList,
  importClientVpnClientCertificateRevocationList,
};
