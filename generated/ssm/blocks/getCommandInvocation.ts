import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetCommandInvocationCommand } from "@aws-sdk/client-ssm";

const getCommandInvocation: AppBlock = {
  name: "Get Command Invocation",
  description:
    "Returns detailed information about command execution for an invocation or plugin.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CommandId: {
          name: "Command Id",
          description:
            "(Required) The parent command ID of the invocation plugin.",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "(Required) The ID of the managed node targeted by the command.",
          type: "string",
          required: true,
        },
        PluginName: {
          name: "Plugin Name",
          description:
            "The name of the step for which you want detailed results.",
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
        });

        const command = new GetCommandInvocationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Command Invocation Result",
      description: "Result from GetCommandInvocation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CommandId: {
            type: "string",
            description: "The parent command ID of the invocation plugin.",
          },
          InstanceId: {
            type: "string",
            description: "The ID of the managed node targeted by the command.",
          },
          Comment: {
            type: "string",
            description: "The comment text for the command.",
          },
          DocumentName: {
            type: "string",
            description: "The name of the document that was run.",
          },
          DocumentVersion: {
            type: "string",
            description:
              "The Systems Manager document (SSM document) version used in the request.",
          },
          PluginName: {
            type: "string",
            description:
              "The name of the plugin, or step name, for which details are reported.",
          },
          ResponseCode: {
            type: "number",
            description: "The error level response code for the plugin script.",
          },
          ExecutionStartDateTime: {
            type: "string",
            description: "The date and time the plugin started running.",
          },
          ExecutionElapsedTime: {
            type: "string",
            description: "Duration since ExecutionStartDateTime.",
          },
          ExecutionEndDateTime: {
            type: "string",
            description: "The date and time the plugin finished running.",
          },
          Status: {
            type: "string",
            description: "The status of this invocation plugin.",
          },
          StatusDetails: {
            type: "string",
            description:
              "A detailed status of the command execution for an invocation.",
          },
          StandardOutputContent: {
            type: "string",
            description:
              "The first 24,000 characters written by the plugin to stdout.",
          },
          StandardOutputUrl: {
            type: "string",
            description:
              "The URL for the complete text written by the plugin to stdout in Amazon Simple Storage Service (Amazon S3).",
          },
          StandardErrorContent: {
            type: "string",
            description:
              "The first 8,000 characters written by the plugin to stderr.",
          },
          StandardErrorUrl: {
            type: "string",
            description:
              "The URL for the complete text written by the plugin to stderr.",
          },
          CloudWatchOutputConfig: {
            type: "object",
            properties: {
              CloudWatchLogGroupName: {
                type: "string",
              },
              CloudWatchOutputEnabled: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "Amazon CloudWatch Logs information where Systems Manager sent the command output.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCommandInvocation;
