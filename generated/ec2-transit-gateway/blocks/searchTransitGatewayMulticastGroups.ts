import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  SearchTransitGatewayMulticastGroupsCommand,
} from "@aws-sdk/client-ec2";

const searchTransitGatewayMulticastGroups: AppBlock = {
  name: "Search Transit Gateway Multicast Groups",
  description:
    "Searches one or more transit gateway multicast groups and returns the group membership information.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayMulticastDomainId: {
          name: "Transit Gateway Multicast Domain Id",
          description: "The ID of the transit gateway multicast domain.",
          type: "string",
          required: true,
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

        const command = new SearchTransitGatewayMulticastGroupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Search Transit Gateway Multicast Groups Result",
      description: "Result from SearchTransitGatewayMulticastGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MulticastGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GroupIpAddress: {
                  type: "string",
                },
                TransitGatewayAttachmentId: {
                  type: "string",
                },
                SubnetId: {
                  type: "string",
                },
                ResourceId: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                ResourceOwnerId: {
                  type: "string",
                },
                NetworkInterfaceId: {
                  type: "string",
                },
                GroupMember: {
                  type: "boolean",
                },
                GroupSource: {
                  type: "boolean",
                },
                MemberType: {
                  type: "string",
                },
                SourceType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the transit gateway multicast group.",
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

export default searchTransitGatewayMulticastGroups;
