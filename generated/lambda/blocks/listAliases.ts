import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, ListAliasesCommand } from "@aws-sdk/client-lambda";

const listAliases: AppBlock = {
  name: "List Aliases",
  description: "Returns a list of aliases for a Lambda function.",
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
        FunctionVersion: {
          name: "Function Version",
          description:
            "Specify a function version to only list aliases that invoke that version.",
          type: "string",
          required: false,
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
          description: "Limit the number of aliases returned.",
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
        });

        const command = new ListAliasesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Aliases Result",
      description: "Result from ListAliases operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "The pagination token that's included if more results are available.",
          },
          Aliases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AliasArn: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                FunctionVersion: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                RoutingConfig: {
                  type: "object",
                  properties: {
                    AdditionalVersionWeights: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  additionalProperties: false,
                },
                RevisionId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of aliases.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAliases;
