import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetGeoMatchSetCommand } from "@aws-sdk/client-waf";

const getGeoMatchSet: AppBlock = {
  name: "Get Geo Match Set",
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
        GeoMatchSetId: {
          name: "Geo Match Set Id",
          description:
            "The GeoMatchSetId of the GeoMatchSet that you want to get.",
          type: "string",
          required: true,
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

        const command = new GetGeoMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Geo Match Set Result",
      description: "Result from GetGeoMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GeoMatchSet: {
            type: "object",
            properties: {
              GeoMatchSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              GeoMatchConstraints: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Type", "Value"],
                  additionalProperties: false,
                },
              },
            },
            required: ["GeoMatchSetId", "GeoMatchConstraints"],
            additionalProperties: false,
            description:
              "Information about the GeoMatchSet that you specified in the GetGeoMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getGeoMatchSet;
