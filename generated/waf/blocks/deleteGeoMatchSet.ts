import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, DeleteGeoMatchSetCommand } from "@aws-sdk/client-waf";

const deleteGeoMatchSet: AppBlock = {
  name: "Delete Geo Match Set",
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
            "The GeoMatchSetID of the GeoMatchSet that you want to delete.",
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

        const command = new DeleteGeoMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Geo Match Set Result",
      description: "Result from DeleteGeoMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the DeleteGeoMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteGeoMatchSet;
