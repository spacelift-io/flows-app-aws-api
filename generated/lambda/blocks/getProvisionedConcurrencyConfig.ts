import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  GetProvisionedConcurrencyConfigCommand,
} from "@aws-sdk/client-lambda";

const getProvisionedConcurrencyConfig: AppBlock = {
  name: "Get Provisioned Concurrency Config",
  description:
    "Retrieves the provisioned concurrency configuration for a function's alias or version.",
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
        });

        const command = new GetProvisionedConcurrencyConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Provisioned Concurrency Config Result",
      description: "Result from GetProvisionedConcurrencyConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RequestedProvisionedConcurrentExecutions: {
            type: "number",
            description: "The amount of provisioned concurrency requested.",
          },
          AvailableProvisionedConcurrentExecutions: {
            type: "number",
            description: "The amount of provisioned concurrency available.",
          },
          AllocatedProvisionedConcurrentExecutions: {
            type: "number",
            description: "The amount of provisioned concurrency allocated.",
          },
          Status: {
            type: "string",
            description: "The status of the allocation process.",
          },
          StatusReason: {
            type: "string",
            description:
              "For failed allocations, the reason that provisioned concurrency could not be allocated.",
          },
          LastModified: {
            type: "string",
            description:
              "The date and time that a user last updated the configuration, in ISO 8601 format.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getProvisionedConcurrencyConfig;
