import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  ListTrailsCommand,
} from "@aws-sdk/client-cloudtrail";

const listTrails: AppBlock = {
  name: "List Trails",
  description: "Lists trails that are in the current account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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

        const command = new ListTrailsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Trails Result",
      description: "Result from ListTrails operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Trails: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TrailARN: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                HomeRegion: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Returns the name, ARN, and home Region of trails in the current account.",
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

export default listTrails;
