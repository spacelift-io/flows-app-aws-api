import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateReusableDelegationSetCommand,
} from "@aws-sdk/client-route-53";

const createReusableDelegationSet: AppBlock = {
  name: "Create Reusable Delegation Set",
  description:
    "Creates a delegation set (a group of four name servers) that can be reused by multiple hosted zones that were created by the same Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CallerReference: {
          name: "Caller Reference",
          description:
            "A unique string that identifies the request, and that allows you to retry failed CreateReusableDelegationSet requests without the risk of executing the operation twice.",
          type: "string",
          required: true,
        },
        HostedZoneId: {
          name: "Hosted Zone Id",
          description:
            "If you want to mark the delegation set for an existing hosted zone as reusable, the ID for that hosted zone.",
          type: "string",
          required: false,
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

        const command = new CreateReusableDelegationSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Reusable Delegation Set Result",
      description: "Result from CreateReusableDelegationSet operation",
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
              "A complex type that contains name server information.",
          },
          Location: {
            type: "string",
            description:
              "The unique URL representing the new reusable delegation set.",
          },
        },
        required: ["DelegationSet", "Location"],
      },
    },
  },
};

export default createReusableDelegationSet;
