import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ExportTransitGatewayRoutesCommand,
} from "@aws-sdk/client-ec2";

const exportTransitGatewayRoutes: AppBlock = {
  name: "Export Transit Gateway Routes",
  description:
    "Exports routes from the specified transit gateway route table to the specified S3 bucket.",
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
          description: "The ID of the route table.",
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
        S3Bucket: {
          name: "S3Bucket",
          description: "The name of the S3 bucket.",
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

        const command = new ExportTransitGatewayRoutesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Export Transit Gateway Routes Result",
      description: "Result from ExportTransitGatewayRoutes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          S3Location: {
            type: "string",
            description: "The URL of the exported file in Amazon S3.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default exportTransitGatewayRoutes;
