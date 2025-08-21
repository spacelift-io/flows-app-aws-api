import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetOpsMetadataCommand } from "@aws-sdk/client-ssm";

const getOpsMetadata: AppBlock = {
  name: "Get Ops Metadata",
  description:
    "View operational metadata related to an application in Application Manager.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpsMetadataArn: {
          name: "Ops Metadata Arn",
          description:
            "The Amazon Resource Name (ARN) of an OpsMetadata Object to view.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
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

        const command = new GetOpsMetadataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Ops Metadata Result",
      description: "Result from GetOpsMetadata operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceId: {
            type: "string",
            description:
              "The resource ID of the Application Manager application.",
          },
          Metadata: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
            description: "OpsMetadata for an Application Manager application.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getOpsMetadata;
