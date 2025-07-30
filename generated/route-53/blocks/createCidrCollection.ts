import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateCidrCollectionCommand,
} from "@aws-sdk/client-route-53";

const createCidrCollection: AppBlock = {
  name: "Create Cidr Collection",
  description:
    "Creates a CIDR collection in the current Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description:
            "A unique identifier for the account that can be used to reference the collection from other API calls.",
          type: "string",
          required: true,
        },
        CallerReference: {
          name: "Caller Reference",
          description:
            "A client-specific token that allows requests to be securely retried so that the intended outcome will only occur once, retries receive a similar response, and there are no additional edge cases to handle.",
          type: "string",
          required: true,
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

        const command = new CreateCidrCollectionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Cidr Collection Result",
      description: "Result from CreateCidrCollection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Collection: {
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
            description:
              "A complex type that contains information about the CIDR collection.",
          },
          Location: {
            type: "string",
            description:
              "A unique URL that represents the location for the CIDR collection.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createCidrCollection;
