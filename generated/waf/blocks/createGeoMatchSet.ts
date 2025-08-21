import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateGeoMatchSetCommand } from "@aws-sdk/client-waf";

const createGeoMatchSet: AppBlock = {
  name: "Create Geo Match Set",
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
        Name: {
          name: "Name",
          description: "A friendly name or description of the GeoMatchSet.",
          type: "string",
          required: true,
        },
        ChangeToken: {
          name: "Change Token",
          description:
            "The value returned by the most recent call to GetChangeToken.",
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

        const command = new CreateGeoMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Geo Match Set Result",
      description: "Result from CreateGeoMatchSet operation",
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
              "The GeoMatchSet returned in the CreateGeoMatchSet response.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateGeoMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createGeoMatchSet;
