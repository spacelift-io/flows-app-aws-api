import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListConnectionGroupsCommand,
} from "@aws-sdk/client-cloudfront";

const listConnectionGroups: AppBlock = {
  name: "List Connection Groups",
  description:
    "Lists the connection groups in your Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationFilter: {
          name: "Association Filter",
          description: "Filter by associated Anycast IP list ID.",
          type: {
            type: "object",
            properties: {
              AnycastIpListId: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "The marker for the next set of connection groups to retrieve.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of connection groups to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListConnectionGroupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Connection Groups Result",
      description: "Result from ListConnectionGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "A token used for pagination of results returned in the response.",
          },
          ConnectionGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                RoutingEndpoint: {
                  type: "string",
                },
                CreatedTime: {
                  type: "string",
                },
                LastModifiedTime: {
                  type: "string",
                },
                ETag: {
                  type: "string",
                },
                AnycastIpListId: {
                  type: "string",
                },
                Enabled: {
                  type: "boolean",
                },
                Status: {
                  type: "string",
                },
                IsDefault: {
                  type: "boolean",
                },
              },
              required: [
                "Id",
                "Name",
                "Arn",
                "RoutingEndpoint",
                "CreatedTime",
                "LastModifiedTime",
                "ETag",
              ],
              additionalProperties: false,
            },
            description: "The list of connection groups that you retrieved.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listConnectionGroups;
