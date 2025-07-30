import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, ListXssMatchSetsCommand } from "@aws-sdk/client-waf";

const listXssMatchSets: AppBlock = {
  name: "List Xss Match Sets",
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
            "If you specify a value for Limit and you have more XssMatchSet objects than the value of Limit, AWS WAF returns a NextMarker value in the response that allows you to list another group of XssMatchSets.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Specifies the number of XssMatchSet objects that you want AWS WAF to return for this request.",
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
        });

        const command = new ListXssMatchSetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Xss Match Sets Result",
      description: "Result from ListXssMatchSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "If you have more XssMatchSet objects than the number that you specified for Limit in the request, the response includes a NextMarker value.",
          },
          XssMatchSets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                XssMatchSetId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
              },
              required: ["XssMatchSetId", "Name"],
              additionalProperties: false,
            },
            description: "An array of XssMatchSetSummary objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listXssMatchSets;
