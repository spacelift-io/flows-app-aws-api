import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetTransitGatewayRouteTablePropagationsCommand,
} from "@aws-sdk/client-ec2";

const getTransitGatewayRouteTablePropagations: AppBlock = {
  name: "Get Transit Gateway Route Table Propagations",
  description:
    "Gets information about the route table propagations for the specified transit gateway route table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayRouteTableId: {
          name: "Transit Gateway Route Table Id",
          description: "The ID of the transit gateway route table.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetTransitGatewayRouteTablePropagationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Transit Gateway Route Table Propagations Result",
      description:
        "Result from GetTransitGatewayRouteTablePropagations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayRouteTablePropagations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TransitGatewayAttachmentId: {
                  type: "string",
                },
                ResourceId: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                TransitGatewayRouteTableAnnouncementId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the route table propagations.",
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

export default getTransitGatewayRouteTablePropagations;
