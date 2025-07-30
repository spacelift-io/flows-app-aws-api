import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeClientVpnAuthorizationRulesCommand,
} from "@aws-sdk/client-ec2";

const describeClientVpnAuthorizationRules: AppBlock = {
  name: "Describe Client Vpn Authorization Rules",
  description:
    "Describes the authorization rules for a specified Client VPN endpoint.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientVpnEndpointId: {
          name: "Client Vpn Endpoint Id",
          description: "The ID of the Client VPN endpoint.",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return for the request in a single page.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeClientVpnAuthorizationRulesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Client Vpn Authorization Rules Result",
      description: "Result from DescribeClientVpnAuthorizationRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AuthorizationRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClientVpnEndpointId: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                GroupId: {
                  type: "string",
                },
                AccessAll: {
                  type: "boolean",
                },
                DestinationCidr: {
                  type: "string",
                },
                Status: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Information about the authorization rules.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeClientVpnAuthorizationRules;
