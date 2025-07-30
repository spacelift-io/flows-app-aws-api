import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetTransitGatewayPolicyTableEntriesCommand,
} from "@aws-sdk/client-ec2";

const getTransitGatewayPolicyTableEntries: AppBlock = {
  name: "Get Transit Gateway Policy Table Entries",
  description: "Returns a list of transit gateway policy table entries.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayPolicyTableId: {
          name: "Transit Gateway Policy Table Id",
          description: "The ID of the transit gateway policy table.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "The filters associated with the transit gateway policy table.",
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
            "The maximum number of results to return with a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
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

        const command = new GetTransitGatewayPolicyTableEntriesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Transit Gateway Policy Table Entries Result",
      description: "Result from GetTransitGatewayPolicyTableEntries operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayPolicyTableEntries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PolicyRuleNumber: {
                  type: "string",
                },
                PolicyRule: {
                  type: "object",
                  properties: {
                    SourceCidrBlock: {
                      type: "string",
                    },
                    SourcePortRange: {
                      type: "string",
                    },
                    DestinationCidrBlock: {
                      type: "string",
                    },
                    DestinationPortRange: {
                      type: "string",
                    },
                    Protocol: {
                      type: "string",
                    },
                    MetaData: {
                      type: "object",
                      properties: {
                        MetaDataKey: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MetaDataValue: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                TargetRouteTableId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The entries for the transit gateway policy table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getTransitGatewayPolicyTableEntries;
