import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListConnectionsCommand,
} from "@aws-sdk/client-eventbridge";

const listConnections: AppBlock = {
  name: "List Connections",
  description: "Retrieves a list of connections from the account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NamePrefix: {
          name: "Name Prefix",
          description: "A name prefix to filter results returned.",
          type: "string",
          required: false,
        },
        ConnectionState: {
          name: "Connection State",
          description: "The state of the connection.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token returned by a previous call, which you can use to retrieve the next set of results.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description: "The maximum number of connections to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListConnectionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Connections Result",
      description: "Result from ListConnections operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Connections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ConnectionArn: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                ConnectionState: {
                  type: "string",
                },
                StateReason: {
                  type: "string",
                },
                AuthorizationType: {
                  type: "string",
                },
                CreationTime: {
                  type: "string",
                },
                LastModifiedTime: {
                  type: "string",
                },
                LastAuthorizedTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An array of connections objects that include details about the connections.",
          },
          NextToken: {
            type: "string",
            description: "A token indicating there are more results available.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listConnections;
