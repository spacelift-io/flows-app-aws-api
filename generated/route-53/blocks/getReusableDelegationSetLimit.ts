import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetReusableDelegationSetLimitCommand,
} from "@aws-sdk/client-route-53";

const getReusableDelegationSetLimit: AppBlock = {
  name: "Get Reusable Delegation Set Limit",
  description:
    "Gets the maximum number of hosted zones that you can associate with the specified reusable delegation set.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Type: {
          name: "Type",
          description:
            "Specify MAX_ZONES_BY_REUSABLE_DELEGATION_SET to get the maximum number of hosted zones that you can associate with the specified reusable delegation set.",
          type: "string",
          required: true,
        },
        DelegationSetId: {
          name: "Delegation Set Id",
          description:
            "The ID of the delegation set that you want to get the limit for.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetReusableDelegationSetLimitCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Reusable Delegation Set Limit Result",
      description: "Result from GetReusableDelegationSetLimit operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Limit: {
            type: "object",
            properties: {
              Type: {
                type: "string",
              },
              Value: {
                type: "number",
              },
            },
            required: ["Type", "Value"],
            additionalProperties: false,
            description:
              "The current setting for the limit on hosted zones that you can associate with the specified reusable delegation set.",
          },
          Count: {
            type: "number",
            description:
              "The current number of hosted zones that you can associate with the specified reusable delegation set.",
          },
        },
        required: ["Limit", "Count"],
      },
    },
  },
};

export default getReusableDelegationSetLimit;
