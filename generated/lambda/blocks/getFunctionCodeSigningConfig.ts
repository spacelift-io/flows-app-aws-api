import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  GetFunctionCodeSigningConfigCommand,
} from "@aws-sdk/client-lambda";

const getFunctionCodeSigningConfig: AppBlock = {
  name: "Get Function Code Signing Config",
  description:
    "Returns the code signing configuration for the specified function.",
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

        const command = new GetFunctionCodeSigningConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Function Code Signing Config Result",
      description: "Result from GetFunctionCodeSigningConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CodeSigningConfigArn: {
            type: "string",
            description:
              "The The Amazon Resource Name (ARN) of the code signing configuration.",
          },
          FunctionName: {
            type: "string",
            description: "The name or ARN of the Lambda function.",
          },
        },
        required: ["CodeSigningConfigArn", "FunctionName"],
      },
    },
  },
};

export default getFunctionCodeSigningConfig;
