import { AppBlock, events } from "@slflows/sdk/v1";
import { Route53Client, ListCidrBlocksCommand } from "@aws-sdk/client-route-53";

const listCidrBlocks: AppBlock = {
  name: "List Cidr Blocks",
  description:
    "Returns a paginated list of location objects and their CIDR blocks.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CollectionId: {
          name: "Collection Id",
          description: "The UUID of the CIDR collection.",
          type: "string",
          required: true,
        },
        LocationName: {
          name: "Location Name",
          description: "The name of the CIDR collection location.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "An opaque pagination token to indicate where the service is to begin enumerating results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "Maximum number of results you want returned.",
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

        const command = new ListCidrBlocksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Cidr Blocks Result",
      description: "Result from ListCidrBlocks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "An opaque pagination token to indicate where the service is to begin enumerating results.",
          },
          CidrBlocks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CidrBlock: {
                  type: "string",
                },
                LocationName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A complex type that contains information about the CIDR blocks.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCidrBlocks;
