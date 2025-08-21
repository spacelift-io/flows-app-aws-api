import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DetectStackSetDriftCommand,
} from "@aws-sdk/client-cloudformation";

const detectStackSetDrift: AppBlock = {
  name: "Detect Stack Set Drift",
  description: "Detect drift on a stack set.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackSetName: {
          name: "Stack Set Name",
          description:
            "The name of the stack set on which to perform the drift detection operation.",
          type: "string",
          required: true,
        },
        OperationPreferences: {
          name: "Operation Preferences",
          description:
            "The user-specified preferences for how CloudFormation performs a stack set operation.",
          type: {
            type: "object",
            properties: {
              RegionConcurrencyType: {
                type: "string",
              },
              RegionOrder: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              FailureToleranceCount: {
                type: "number",
              },
              FailureTolerancePercentage: {
                type: "number",
              },
              MaxConcurrentCount: {
                type: "number",
              },
              MaxConcurrentPercentage: {
                type: "number",
              },
              ConcurrencyMode: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        OperationId: {
          name: "Operation Id",
          description: "The ID of the stack set operation.",
          type: "string",
          required: false,
        },
        CallAs: {
          name: "Call As",
          description:
            "[Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new DetectStackSetDriftCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Detect Stack Set Drift Result",
      description: "Result from DetectStackSetDrift operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OperationId: {
            type: "string",
            description: "The ID of the drift detection stack set operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default detectStackSetDrift;
