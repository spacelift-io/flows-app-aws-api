import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteRouteCommand } from "@aws-sdk/client-ec2";

const deleteRoute: AppBlock = {
  name: "Delete Route",
  description: "Deletes the specified route from the specified route table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DestinationPrefixListId: {
          name: "Destination Prefix List Id",
          description: "The ID of the prefix list for the route.",
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
        RouteTableId: {
          name: "Route Table Id",
          description: "The ID of the route table.",
          type: "string",
          required: true,
        },
        DestinationCidrBlock: {
          name: "Destination Cidr Block",
          description: "The IPv4 CIDR range for the route.",
          type: "string",
          required: false,
        },
        DestinationIpv6CidrBlock: {
          name: "Destination Ipv6Cidr Block",
          description: "The IPv6 CIDR range for the route.",
          type: "string",
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

        const command = new DeleteRouteCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Route Result",
      description: "Result from DeleteRoute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteRoute;
