import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, ListByteMatchSetsCommand } from "@aws-sdk/client-waf";

const listByteMatchSets: AppBlock = {
  name: "List Byte Match Sets",
  description: "This is AWS WAF Classic documentation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextMarker: {
          name: "Next Marker",
          description:
            "If you specify a value for Limit and you have more ByteMatchSets than the value of Limit, AWS WAF returns a NextMarker value in the response that allows you to list another group of ByteMatchSets.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Specifies the number of ByteMatchSet objects that you want AWS WAF to return for this request.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
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

        const command = new ListByteMatchSetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Byte Match Sets Result",
      description: "Result from ListByteMatchSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "If you have more ByteMatchSet objects than the number that you specified for Limit in the request, the response includes a NextMarker value.",
          },
          ByteMatchSets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ByteMatchSetId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
              },
              required: ["ByteMatchSetId", "Name"],
              additionalProperties: false,
            },
            description: "An array of ByteMatchSetSummary objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listByteMatchSets;
