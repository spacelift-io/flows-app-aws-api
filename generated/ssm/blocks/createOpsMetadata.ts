import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, CreateOpsMetadataCommand } from "@aws-sdk/client-ssm";

const createOpsMetadata: AppBlock = {
  name: "Create Ops Metadata",
  description:
    "If you create a new application in Application Manager, Amazon Web Services Systems Manager calls this API operation to specify information about the new application, including the application type.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceId: {
          name: "Resource Id",
          description:
            "A resource ID for a new Application Manager application.",
          type: "string",
          required: true,
        },
        Metadata: {
          name: "Metadata",
          description: "Metadata for a new Application Manager application.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "Optional metadata that you assign to a resource.",
          type: {
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
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
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
        });

        const command = new CreateOpsMetadataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Ops Metadata Result",
      description: "Result from CreateOpsMetadata operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OpsMetadataArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the OpsMetadata Object or blob created by the call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createOpsMetadata;
