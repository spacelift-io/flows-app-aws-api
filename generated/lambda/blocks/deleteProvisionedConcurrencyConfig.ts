import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  DeleteProvisionedConcurrencyConfigCommand,
} from "@aws-sdk/client-lambda";

const deleteProvisionedConcurrencyConfig: AppBlock = {
  name: "Delete Provisioned Concurrency Config",
  description:
    "Deletes the provisioned concurrency configuration for a function.",
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
          description: "The version number or alias name.",
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

        const command = new DeleteProvisionedConcurrencyConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Provisioned Concurrency Config Result",
      description: "Result from DeleteProvisionedConcurrencyConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteProvisionedConcurrencyConfig;
