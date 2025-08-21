import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListCidrLocationsCommand,
} from "@aws-sdk/client-route-53";

const listCidrLocations: AppBlock = {
  name: "List Cidr Locations",
  description:
    "Returns a paginated list of CIDR locations for the given collection (metadata only, does not include CIDR blocks).",
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
          description: "The CIDR collection ID.",
          type: "string",
          required: true,
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
          description:
            "The maximum number of CIDR collection locations to return in the response.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListCidrLocationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Cidr Locations Result",
      description: "Result from ListCidrLocations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "An opaque pagination token to indicate where the service is to begin enumerating results.",
          },
          CidrLocations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LocationName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A complex type that contains information about the list of CIDR locations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCidrLocations;
