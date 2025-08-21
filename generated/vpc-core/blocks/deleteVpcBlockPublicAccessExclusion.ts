import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteVpcBlockPublicAccessExclusionCommand,
} from "@aws-sdk/client-ec2";

const deleteVpcBlockPublicAccessExclusion: AppBlock = {
  name: "Delete Vpc Block Public Access Exclusion",
  description: "Delete a VPC Block Public Access (BPA) exclusion.",
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
          description: "The ID of the exclusion.",
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

        const command = new DeleteVpcBlockPublicAccessExclusionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Vpc Block Public Access Exclusion Result",
      description: "Result from DeleteVpcBlockPublicAccessExclusion operation",
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
            description: "Details about an exclusion.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteVpcBlockPublicAccessExclusion;
