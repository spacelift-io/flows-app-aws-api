import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribePatchGroupStateCommand } from "@aws-sdk/client-ssm";

const describePatchGroupState: AppBlock = {
  name: "Describe Patch Group State",
  description:
    "Returns high-level aggregated patch compliance state information for a patch group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PatchGroup: {
          name: "Patch Group",
          description:
            "The name of the patch group whose patch snapshot should be retrieved.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribePatchGroupStateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Patch Group State Result",
      description: "Result from DescribePatchGroupState operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Instances: {
            type: "number",
            description: "The number of managed nodes in the patch group.",
          },
          InstancesWithInstalledPatches: {
            type: "number",
            description: "The number of managed nodes with installed patches.",
          },
          InstancesWithInstalledOtherPatches: {
            type: "number",
            description:
              "The number of managed nodes with patches installed that aren't defined in the patch baseline.",
          },
          InstancesWithInstalledPendingRebootPatches: {
            type: "number",
            description:
              "The number of managed nodes with patches installed by Patch Manager that haven't been rebooted after the patch installation.",
          },
          InstancesWithInstalledRejectedPatches: {
            type: "number",
            description:
              "The number of managed nodes with patches installed that are specified in a RejectedPatches list.",
          },
          InstancesWithMissingPatches: {
            type: "number",
            description:
              "The number of managed nodes with missing patches from the patch baseline.",
          },
          InstancesWithFailedPatches: {
            type: "number",
            description:
              "The number of managed nodes with patches from the patch baseline that failed to install.",
          },
          InstancesWithNotApplicablePatches: {
            type: "number",
            description:
              "The number of managed nodes with patches that aren't applicable.",
          },
          InstancesWithUnreportedNotApplicablePatches: {
            type: "number",
            description:
              "The number of managed nodes with NotApplicable patches beyond the supported limit, which aren't reported by name to Inventory.",
          },
          InstancesWithCriticalNonCompliantPatches: {
            type: "number",
            description:
              "The number of managed nodes where patches that are specified as Critical for compliance reporting in the patch baseline aren't installed.",
          },
          InstancesWithSecurityNonCompliantPatches: {
            type: "number",
            description:
              "The number of managed nodes where patches that are specified as Security in a patch advisory aren't installed.",
          },
          InstancesWithOtherNonCompliantPatches: {
            type: "number",
            description:
              "The number of managed nodes with patches installed that are specified as other than Critical or Security but aren't compliant with the patch baseline.",
          },
          InstancesWithAvailableSecurityUpdates: {
            type: "number",
            description:
              "The number of managed nodes for which security-related patches are available but not approved because because they didn't meet the patch baseline requirements.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePatchGroupState;
