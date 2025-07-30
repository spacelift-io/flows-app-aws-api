import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  DisableFederationCommand,
} from "@aws-sdk/client-cloudtrail";

const disableFederation: AppBlock = {
  name: "Disable Federation",
  description:
    "Disables Lake query federation on the specified event data store.",
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
            "The ARN (or ID suffix of the ARN) of the event data store for which you want to disable Lake query federation.",
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

        const command = new DisableFederationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Federation Result",
      description: "Result from DisableFederation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventDataStoreArn: {
            type: "string",
            description:
              "The ARN of the event data store for which you disabled Lake query federation.",
          },
          FederationStatus: {
            type: "string",
            description: "The federation status.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableFederation;
