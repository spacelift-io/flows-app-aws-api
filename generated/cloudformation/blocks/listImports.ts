import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListImportsCommand,
} from "@aws-sdk/client-cloudformation";

const listImports: AppBlock = {
  name: "List Imports",
  description: "Lists all stacks that are importing an exported output value.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExportName: {
          name: "Export Name",
          description: "The name of the exported output value.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string (provided by the ListImports response output) that identifies the next page of stacks that are importing the specified exported output value.",
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
        });

        const command = new ListImportsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Imports Result",
      description: "Result from ListImports operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Imports: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of stack names that are importing the specified exported output value.",
          },
          NextToken: {
            type: "string",
            description: "A string that identifies the next page of exports.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listImports;
