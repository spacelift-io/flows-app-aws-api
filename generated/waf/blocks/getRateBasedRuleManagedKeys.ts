import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  GetRateBasedRuleManagedKeysCommand,
} from "@aws-sdk/client-waf";

const getRateBasedRuleManagedKeys: AppBlock = {
  name: "Get Rate Based Rule Managed Keys",
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
        RuleId: {
          name: "Rule Id",
          description:
            "The RuleId of the RateBasedRule for which you want to get a list of ManagedKeys.",
          type: "string",
          required: true,
        },
        NextMarker: {
          name: "Next Marker",
          description: "A null value and not currently used.",
          type: "string",
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

        const command = new GetRateBasedRuleManagedKeysCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Rate Based Rule Managed Keys Result",
      description: "Result from GetRateBasedRuleManagedKeys operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ManagedKeys: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "An array of IP addresses that currently are blocked by the specified RateBasedRule.",
          },
          NextMarker: {
            type: "string",
            description: "A null value and not currently used.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRateBasedRuleManagedKeys;
