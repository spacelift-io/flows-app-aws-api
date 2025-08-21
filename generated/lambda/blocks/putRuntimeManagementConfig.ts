import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  PutRuntimeManagementConfigCommand,
} from "@aws-sdk/client-lambda";

const putRuntimeManagementConfig: AppBlock = {
  name: "Put Runtime Management Config",
  description:
    "Sets the runtime management configuration for a function's version.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FunctionName: {
          name: "Function Name",
          description: "The name or ARN of the Lambda function.",
          type: "string",
          required: true,
        },
        Qualifier: {
          name: "Qualifier",
          description: "Specify a version of the function.",
          type: "string",
          required: false,
        },
        UpdateRuntimeOn: {
          name: "Update Runtime On",
          description: "Specify the runtime update mode.",
          type: "string",
          required: true,
        },
        RuntimeVersionArn: {
          name: "Runtime Version Arn",
          description:
            "The ARN of the runtime version you want the function to use.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
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

        const command = new PutRuntimeManagementConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Runtime Management Config Result",
      description: "Result from PutRuntimeManagementConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UpdateRuntimeOn: {
            type: "string",
            description: "The runtime update mode.",
          },
          FunctionArn: {
            type: "string",
            description: "The ARN of the function",
          },
          RuntimeVersionArn: {
            type: "string",
            description:
              "The ARN of the runtime the function is configured to use.",
          },
        },
        required: ["UpdateRuntimeOn", "FunctionArn"],
      },
    },
  },
};

export default putRuntimeManagementConfig;
