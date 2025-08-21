import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListCidrCollectionsCommand,
} from "@aws-sdk/client-route-53";

const listCidrCollections: AppBlock = {
  name: "List Cidr Collections",
  description:
    "Returns a paginated list of CIDR collections in the Amazon Web Services account (metadata only).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
            "The maximum number of CIDR collections to return in the response.",
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

        const command = new ListCidrCollectionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Cidr Collections Result",
      description: "Result from ListCidrCollections operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "An opaque pagination token to indicate where the service is to begin enumerating results.",
          },
          CidrCollections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                Id: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Version: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description:
              "A complex type with information about the CIDR collection.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCidrCollections;
