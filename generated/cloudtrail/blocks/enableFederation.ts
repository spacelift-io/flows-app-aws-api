import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  EnableFederationCommand,
} from "@aws-sdk/client-cloudtrail";

const enableFederation: AppBlock = {
  name: "Enable Federation",
  description:
    "Enables Lake query federation on the specified event data store.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventDataStore: {
          name: "Event Data Store",
          description:
            "The ARN (or ID suffix of the ARN) of the event data store for which you want to enable Lake query federation.",
          type: "string",
          required: true,
        },
        FederationRoleArn: {
          name: "Federation Role Arn",
          description:
            "The ARN of the federation role to use for the event data store.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new EnableFederationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Federation Result",
      description: "Result from EnableFederation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventDataStoreArn: {
            type: "string",
            description:
              "The ARN of the event data store for which you enabled Lake query federation.",
          },
          FederationStatus: {
            type: "string",
            description: "The federation status.",
          },
          FederationRoleArn: {
            type: "string",
            description: "The ARN of the federation role.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableFederation;
