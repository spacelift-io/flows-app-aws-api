import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  ListChannelsCommand,
} from "@aws-sdk/client-cloudtrail";

const listChannels: AppBlock = {
  name: "List Channels",
  description:
    "Lists the channels in the current account, and their source names.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of CloudTrail channels to display on a single page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token to use to get the next page of results after a previous API call.",
          type: "string",
          required: false,
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

        const command = new ListChannelsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Channels Result",
      description: "Result from ListChannels operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Channels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ChannelArn: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of channels in the account.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to get the next page of results after a previous API call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listChannels;
