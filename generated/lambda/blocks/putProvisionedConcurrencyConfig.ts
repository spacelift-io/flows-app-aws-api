import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  PutProvisionedConcurrencyConfigCommand,
} from "@aws-sdk/client-lambda";

const putProvisionedConcurrencyConfig: AppBlock = {
  name: "Put Provisioned Concurrency Config",
  description:
    "Adds a provisioned concurrency configuration to a function's alias or version.",
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
        ProvisionedConcurrentExecutions: {
          name: "Provisioned Concurrent Executions",
          description:
            "The amount of provisioned concurrency to allocate for the version or alias.",
          type: "number",
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

        const command = new PutProvisionedConcurrencyConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Provisioned Concurrency Config Result",
      description: "Result from PutProvisionedConcurrencyConfig operation",
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

export default putProvisionedConcurrencyConfig;
