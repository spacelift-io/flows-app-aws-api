import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListExportsCommand,
} from "@aws-sdk/client-cloudformation";

const listExports: AppBlock = {
  name: "List Exports",
  description:
    "Lists all exported output values in the account and Region in which you call this action.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string (provided by the ListExports response output) that identifies the next page of exported output values that you asked to retrieve.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new ListExportsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Exports Result",
      description: "Result from ListExports operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Exports: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ExportingStackId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The output for the ListExports action.",
          },
          NextToken: {
            type: "string",
            description:
              "If the output exceeds 100 exported output values, a string that identifies the next page of exports.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listExports;
