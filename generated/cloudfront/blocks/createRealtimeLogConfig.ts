import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateRealtimeLogConfigCommand,
} from "@aws-sdk/client-cloudfront";

const createRealtimeLogConfig: AppBlock = {
  name: "Create Realtime Log Config",
  description: "Creates a real-time log configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EndPoints: {
          name: "End Points",
          description:
            "Contains information about the Amazon Kinesis data stream where you are sending real-time log data.",
          type: {
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
                      type: "string",
                    },
                    StreamARN: {
                      type: "string",
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
          required: true,
        },
        Fields: {
          name: "Fields",
          description:
            "A list of fields to include in each real-time log record.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Name: {
          name: "Name",
          description:
            "A unique name to identify this real-time log configuration.",
          type: "string",
          required: true,
        },
        SamplingRate: {
          name: "Sampling Rate",
          description:
            "The sampling rate for this real-time log configuration.",
          type: "number",
          required: true,
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

        const command = new CreateRealtimeLogConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Realtime Log Config Result",
      description: "Result from CreateRealtimeLogConfig operation",
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

export default createRealtimeLogConfig;
