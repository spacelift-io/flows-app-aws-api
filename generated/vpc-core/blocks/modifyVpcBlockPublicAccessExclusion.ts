import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyVpcBlockPublicAccessExclusionCommand,
} from "@aws-sdk/client-ec2";

const modifyVpcBlockPublicAccessExclusion: AppBlock = {
  name: "Modify Vpc Block Public Access Exclusion",
  description: "Modify VPC Block Public Access (BPA) exclusions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ExclusionId: {
          name: "Exclusion Id",
          description: "The ID of an exclusion.",
          type: "string",
          required: true,
        },
        InternetGatewayExclusionMode: {
          name: "Internet Gateway Exclusion Mode",
          description: "The exclusion mode for internet gateway traffic.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new ModifyVpcBlockPublicAccessExclusionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Block Public Access Exclusion Result",
      description: "Result from ModifyVpcBlockPublicAccessExclusion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcBlockPublicAccessExclusion: {
            type: "object",
            properties: {
              ExclusionId: {
                type: "string",
              },
              InternetGatewayExclusionMode: {
                type: "string",
              },
              ResourceArn: {
                type: "string",
              },
              State: {
                type: "string",
              },
              Reason: {
                type: "string",
              },
              CreationTimestamp: {
                type: "string",
              },
              LastUpdateTimestamp: {
                type: "string",
              },
              DeletionTimestamp: {
                type: "string",
              },
              Tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Details related to the exclusion.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyVpcBlockPublicAccessExclusion;
