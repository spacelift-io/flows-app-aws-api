import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateRealtimeLogConfigCommand,
} from "@aws-sdk/client-cloudfront";

const updateRealtimeLogConfig: AppBlock = {
  name: "Update Realtime Log Config",
  description: "Updates a real-time log configuration.",
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
          required: false,
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
          required: false,
        },
        Name: {
          name: "Name",
          description: "The name for this real-time log configuration.",
          type: "string",
          required: false,
        },
        ARN: {
          name: "ARN",
          description:
            "The Amazon Resource Name (ARN) for this real-time log configuration.",
          type: "string",
          required: false,
        },
        SamplingRate: {
          name: "Sampling Rate",
          description:
            "The sampling rate for this real-time log configuration.",
          type: "number",
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

        const command = new UpdateRealtimeLogConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Realtime Log Config Result",
      description: "Result from UpdateRealtimeLogConfig operation",
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

export default updateRealtimeLogConfig;
