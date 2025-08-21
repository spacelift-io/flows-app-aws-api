import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  GetRuntimeManagementConfigCommand,
} from "@aws-sdk/client-lambda";

const getRuntimeManagementConfig: AppBlock = {
  name: "Get Runtime Management Config",
  description:
    "Retrieves the runtime management configuration for a function's version.",
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

        const command = new GetRuntimeManagementConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Runtime Management Config Result",
      description: "Result from GetRuntimeManagementConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UpdateRuntimeOn: {
            type: "string",
            description: "The current runtime update mode of the function.",
          },
          RuntimeVersionArn: {
            type: "string",
            description:
              "The ARN of the runtime the function is configured to use.",
          },
          FunctionArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of your function.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRuntimeManagementConfig;
