import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListGeneratedTemplatesCommand,
} from "@aws-sdk/client-cloudformation";

const listGeneratedTemplates: AppBlock = {
  name: "List Generated Templates",
  description: "Lists your generated templates in this Region.",
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
            "A string that identifies the next page of resource scan results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "If the number of available results exceeds this maximum, the response includes a NextToken value that you can use for the NextToken parameter to get the next set of results.",
          type: "number",
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

        const command = new ListGeneratedTemplatesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Generated Templates Result",
      description: "Result from ListGeneratedTemplates operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Summaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GeneratedTemplateId: {
                  type: "string",
                },
                GeneratedTemplateName: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusReason: {
                  type: "string",
                },
                CreationTime: {
                  type: "string",
                },
                LastUpdatedTime: {
                  type: "string",
                },
                NumberOfResources: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "A list of summaries of the generated templates.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all the remaining results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listGeneratedTemplates;
