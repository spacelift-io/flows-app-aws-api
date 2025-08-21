import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListRealtimeLogConfigsCommand,
} from "@aws-sdk/client-cloudfront";

const listRealtimeLogConfigs: AppBlock = {
  name: "List Realtime Log Configs",
  description: "Gets a list of real-time log configurations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of real-time log configurations that you want in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this field when paginating results to indicate where to begin in your list of real-time log configurations.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new ListRealtimeLogConfigsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Realtime Log Configs Result",
      description: "Result from ListRealtimeLogConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RealtimeLogConfigs: {
            type: "object",
            properties: {
              MaxItems: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ARN: {
                      type: "string",
                    },
                    Name: {
                      type: "string",
                    },
                    SamplingRate: {
                      type: "number",
                    },
                    EndPoints: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Fields: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: [
                    "ARN",
                    "Name",
                    "SamplingRate",
                    "EndPoints",
                    "Fields",
                  ],
                  additionalProperties: false,
                },
              },
              IsTruncated: {
                type: "boolean",
              },
              Marker: {
                type: "string",
              },
              NextMarker: {
                type: "string",
              },
            },
            required: ["MaxItems", "IsTruncated", "Marker"],
            additionalProperties: false,
            description: "A list of real-time log configurations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listRealtimeLogConfigs;
