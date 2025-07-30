import createCapacityReservation from "./createCapacityReservation";
import cancelCapacityReservation from "./cancelCapacityReservation";
import createCapacityReservationBySplitting from "./createCapacityReservationBySplitting";
import describeCapacityReservations from "./describeCapacityReservations";
import modifyCapacityReservation from "./modifyCapacityReservation";
import moveCapacityReservationInstances from "./moveCapacityReservationInstances";
import getCapacityReservationUsage from "./getCapacityReservationUsage";
import acceptCapacityReservationBillingOwnership from "./acceptCapacityReservationBillingOwnership";
import rejectCapacityReservationBillingOwnership from "./rejectCapacityReservationBillingOwnership";
import associateCapacityReservationBillingOwner from "./associateCapacityReservationBillingOwner";
import disassociateCapacityReservationBillingOwner from "./disassociateCapacityReservationBillingOwner";
import describeCapacityReservationBillingRequests from "./describeCapacityReservationBillingRequests";
import createCapacityReservationFleet from "./createCapacityReservationFleet";
import cancelCapacityReservationFleets from "./cancelCapacityReservationFleets";
import describeCapacityReservationFleets from "./describeCapacityReservationFleets";
import modifyCapacityReservationFleet from "./modifyCapacityReservationFleet";
import getGroupsForCapacityReservation from "./getGroupsForCapacityReservation";
import describeCapacityBlockOfferings from "./describeCapacityBlockOfferings";
import purchaseCapacityBlock from "./purchaseCapacityBlock";
import describeCapacityBlockExtensionOfferings from "./describeCapacityBlockExtensionOfferings";
import purchaseCapacityBlockExtension from "./purchaseCapacityBlockExtension";
import describeCapacityBlockExtensionHistory from "./describeCapacityBlockExtensionHistory";
import allocateHosts from "./allocateHosts";
import releaseHosts from "./releaseHosts";
import describeHosts from "./describeHosts";
import modifyHosts from "./modifyHosts";
import describeMacHosts from "./describeMacHosts";
import describeHostReservations from "./describeHostReservations";
import describeHostReservationOfferings from "./describeHostReservationOfferings";
import purchaseHostReservation from "./purchaseHostReservation";
import getHostReservationPurchasePreview from "./getHostReservationPurchasePreview";
import createPlacementGroup from "./createPlacementGroup";
import deletePlacementGroup from "./deletePlacementGroup";
import describePlacementGroups from "./describePlacementGroups";
import describeReservedInstances from "./describeReservedInstances";
import describeReservedInstancesOfferings from "./describeReservedInstancesOfferings";
import purchaseReservedInstancesOffering from "./purchaseReservedInstancesOffering";
import modifyReservedInstances from "./modifyReservedInstances";
import describeReservedInstancesModifications from "./describeReservedInstancesModifications";
import createReservedInstancesListing from "./createReservedInstancesListing";
import cancelReservedInstancesListing from "./cancelReservedInstancesListing";
import describeReservedInstancesListings from "./describeReservedInstancesListings";
import acceptReservedInstancesExchangeQuote from "./acceptReservedInstancesExchangeQuote";
import getReservedInstancesExchangeQuote from "./getReservedInstancesExchangeQuote";
import deleteQueuedReservedInstances from "./deleteQueuedReservedInstances";

export const blocks = {
  createCapacityReservation,
  cancelCapacityReservation,
  createCapacityReservationBySplitting,
  describeCapacityReservations,
  modifyCapacityReservation,
  moveCapacityReservationInstances,
  getCapacityReservationUsage,
  acceptCapacityReservationBillingOwnership,
  rejectCapacityReservationBillingOwnership,
  associateCapacityReservationBillingOwner,
  disassociateCapacityReservationBillingOwner,
  describeCapacityReservationBillingRequests,
  createCapacityReservationFleet,
  cancelCapacityReservationFleets,
  describeCapacityReservationFleets,
  modifyCapacityReservationFleet,
  getGroupsForCapacityReservation,
  describeCapacityBlockOfferings,
  purchaseCapacityBlock,
  describeCapacityBlockExtensionOfferings,
  purchaseCapacityBlockExtension,
  describeCapacityBlockExtensionHistory,
  allocateHosts,
  releaseHosts,
  describeHosts,
  modifyHosts,
  describeMacHosts,
  describeHostReservations,
  describeHostReservationOfferings,
  purchaseHostReservation,
  getHostReservationPurchasePreview,
  createPlacementGroup,
  deletePlacementGroup,
  describePlacementGroups,
  describeReservedInstances,
  describeReservedInstancesOfferings,
  purchaseReservedInstancesOffering,
  modifyReservedInstances,
  describeReservedInstancesModifications,
  createReservedInstancesListing,
  cancelReservedInstancesListing,
  describeReservedInstancesListings,
  acceptReservedInstancesExchangeQuote,
  getReservedInstancesExchangeQuote,
  deleteQueuedReservedInstances,
};
