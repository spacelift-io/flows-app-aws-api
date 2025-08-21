import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  ListProvisionedConcurrencyConfigsCommand,
} from "@aws-sdk/client-lambda";

const listProvisionedConcurrencyConfigs: AppBlock = {
  name: "List Provisioned Concurrency Configs",
  description:
    "Retrieves a list of provisioned concurrency configurations for a function.",
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
        Marker: {
          name: "Marker",
          description:
            "Specify the pagination token that's returned by a previous request to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "Specify a number to limit the number of configurations returned.",
          type: "number",
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

        const command = new ListProvisionedConcurrencyConfigsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Provisioned Concurrency Configs Result",
      description: "Result from ListProvisionedConcurrencyConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ProvisionedConcurrencyConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                FunctionArn: {
                  type: "string",
                },
                RequestedProvisionedConcurrentExecutions: {
                  type: "number",
                },
                AvailableProvisionedConcurrentExecutions: {
                  type: "number",
                },
                AllocatedProvisionedConcurrentExecutions: {
                  type: "number",
                },
                Status: {
                  type: "string",
                },
                StatusReason: {
                  type: "string",
                },
                LastModified: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of provisioned concurrency configurations.",
          },
          NextMarker: {
            type: "string",
            description:
              "The pagination token that's included if more results are available.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listProvisionedConcurrencyConfigs;
