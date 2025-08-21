import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, ListIPSetsCommand } from "@aws-sdk/client-waf";

const listIPSets: AppBlock = {
  name: "List IP Sets",
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
            "AWS WAF returns a NextMarker value in the response that allows you to list another group of IPSets.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Specifies the number of IPSet objects that you want AWS WAF to return for this request.",
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

        const command = new ListIPSetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List IP Sets Result",
      description: "Result from ListIPSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "To list more IPSet objects, submit another ListIPSets request, and in the next request use the NextMarker response value as the NextMarker value.",
          },
          IPSets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IPSetId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
              },
              required: ["IPSetId", "Name"],
              additionalProperties: false,
            },
            description: "An array of IPSetSummary objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listIPSets;
