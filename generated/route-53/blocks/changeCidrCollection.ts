import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ChangeCidrCollectionCommand,
} from "@aws-sdk/client-route-53";

const changeCidrCollection: AppBlock = {
  name: "Change Cidr Collection",
  description: "Creates, changes, or deletes CIDR blocks within a collection.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The UUID of the CIDR collection to update.",
          type: "string",
          required: true,
        },
        CollectionVersion: {
          name: "Collection Version",
          description:
            "A sequential counter that Amazon Route 53 sets to 1 when you create a collection and increments it by 1 each time you update the collection.",
          type: "number",
          required: false,
        },
        Changes: {
          name: "Changes",
          description: "Information about changes to a CIDR collection.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LocationName: {
                  type: "string",
                },
                Action: {
                  type: "string",
                },
                CidrList: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["LocationName", "Action", "CidrList"],
              additionalProperties: false,
            },
          },
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

        const command = new ChangeCidrCollectionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Change Cidr Collection Result",
      description: "Result from ChangeCidrCollection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Id: {
            type: "string",
            description: "The ID that is returned by ChangeCidrCollection.",
          },
        },
        required: ["Id"],
      },
    },
  },
};

export default changeCidrCollection;
