import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetReusableDelegationSetCommand,
} from "@aws-sdk/client-route-53";

const getReusableDelegationSet: AppBlock = {
  name: "Get Reusable Delegation Set",
  description:
    "Retrieves information about a specified reusable delegation set, including the four name servers that are assigned to the delegation set.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The ID of the reusable delegation set that you want to get a list of name servers for.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetReusableDelegationSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Reusable Delegation Set Result",
      description: "Result from GetReusableDelegationSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DelegationSet: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              CallerReference: {
                type: "string",
              },
              NameServers: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["NameServers"],
            additionalProperties: false,
            description:
              "A complex type that contains information about the reusable delegation set.",
          },
        },
        required: ["DelegationSet"],
      },
    },
  },
};

export default getReusableDelegationSet;
