import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  PutFunctionCodeSigningConfigCommand,
} from "@aws-sdk/client-lambda";

const putFunctionCodeSigningConfig: AppBlock = {
  name: "Put Function Code Signing Config",
  description: "Update the code signing configuration for the function.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CodeSigningConfigArn: {
          name: "Code Signing Config Arn",
          description:
            "The The Amazon Resource Name (ARN) of the code signing configuration.",
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
        });

        const command = new PutFunctionCodeSigningConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Function Code Signing Config Result",
      description: "Result from PutFunctionCodeSigningConfig operation",
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

export default putFunctionCodeSigningConfig;
