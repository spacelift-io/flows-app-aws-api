import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetRealtimeLogConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getRealtimeLogConfig: AppBlock = {
  name: "Get Realtime Log Config",
  description: "Gets a real-time log configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the real-time log configuration to get.",
          type: "string",
          required: false,
        },
        ARN: {
          name: "ARN",
          description:
            "The Amazon Resource Name (ARN) of the real-time log configuration to get.",
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
        });

        const command = new GetRealtimeLogConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Realtime Log Config Result",
      description: "Result from GetRealtimeLogConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RealtimeLogConfig: {
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
                  properties: {
                    StreamType: {
                      type: "string",
                    },
                    KinesisStreamConfig: {
                      type: "object",
                      properties: {
                        RoleARN: {
                          type: "object",
                          additionalProperties: true,
                        },
                        StreamARN: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["RoleARN", "StreamARN"],
                      additionalProperties: false,
                    },
                  },
                  required: ["StreamType"],
                  additionalProperties: false,
                },
              },
              Fields: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["ARN", "Name", "SamplingRate", "EndPoints", "Fields"],
            additionalProperties: false,
            description: "A real-time log configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRealtimeLogConfig;
