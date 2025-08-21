import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeInstancePatchStatesForPatchGroupCommand,
} from "@aws-sdk/client-ssm";

const describeInstancePatchStatesForPatchGroup: AppBlock = {
  name: "Describe Instance Patch States For Patch Group",
  description:
    "Retrieves the high-level patch state for the managed nodes in the specified patch group.",
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
            "The name of the patch group for which the patch state information should be retrieved.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "Each entry in the array is a structure containing: Key (string between 1 and 200 characters) Values ...",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Type: {
                  type: "string",
                },
              },
              required: ["Key", "Values", "Type"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of patches to return (per page).",
          type: "number",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeInstancePatchStatesForPatchGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instance Patch States For Patch Group Result",
      description:
        "Result from DescribeInstancePatchStatesForPatchGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstancePatchStates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                PatchGroup: {
                  type: "string",
                },
                BaselineId: {
                  type: "string",
                },
                SnapshotId: {
                  type: "string",
                },
                InstallOverrideList: {
                  type: "string",
                },
                OwnerInformation: {
                  type: "string",
                },
                InstalledCount: {
                  type: "number",
                },
                InstalledOtherCount: {
                  type: "number",
                },
                InstalledPendingRebootCount: {
                  type: "number",
                },
                InstalledRejectedCount: {
                  type: "number",
                },
                MissingCount: {
                  type: "number",
                },
                FailedCount: {
                  type: "number",
                },
                UnreportedNotApplicableCount: {
                  type: "number",
                },
                NotApplicableCount: {
                  type: "number",
                },
                AvailableSecurityUpdateCount: {
                  type: "number",
                },
                OperationStartTime: {
                  type: "string",
                },
                OperationEndTime: {
                  type: "string",
                },
                Operation: {
                  type: "string",
                },
                LastNoRebootInstallOperationTime: {
                  type: "string",
                },
                RebootOption: {
                  type: "string",
                },
                CriticalNonCompliantCount: {
                  type: "number",
                },
                SecurityNonCompliantCount: {
                  type: "number",
                },
                OtherNonCompliantCount: {
                  type: "number",
                },
              },
              required: [
                "InstanceId",
                "PatchGroup",
                "BaselineId",
                "OperationStartTime",
                "OperationEndTime",
                "Operation",
              ],
              additionalProperties: false,
            },
            description:
              "The high-level patch state for the requested managed nodes.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInstancePatchStatesForPatchGroup;
