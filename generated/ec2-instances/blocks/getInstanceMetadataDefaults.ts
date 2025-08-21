import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetInstanceMetadataDefaultsCommand,
} from "@aws-sdk/client-ec2";

const getInstanceMetadataDefaults: AppBlock = {
  name: "Get Instance Metadata Defaults",
  description:
    "Gets the default instance metadata service (IMDS) settings that are set at the account level in the specified Amazon Web Services Region.",
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
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
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

        const command = new GetInstanceMetadataDefaultsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Instance Metadata Defaults Result",
      description: "Result from GetInstanceMetadataDefaults operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountLevel: {
            type: "object",
            properties: {
              HttpTokens: {
                type: "string",
              },
              HttpPutResponseHopLimit: {
                type: "number",
              },
              HttpEndpoint: {
                type: "string",
              },
              InstanceMetadataTags: {
                type: "string",
              },
              ManagedBy: {
                type: "string",
              },
              ManagedExceptionMessage: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The account-level default IMDS settings.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getInstanceMetadataDefaults;
