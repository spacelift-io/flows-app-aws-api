import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListResourceScanResourcesCommand,
} from "@aws-sdk/client-cloudformation";

const listResourceScanResources: AppBlock = {
  name: "List Resource Scan Resources",
  description: "Lists the resources from a resource scan.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceScanId: {
          name: "Resource Scan Id",
          description: "The Amazon Resource Name (ARN) of the resource scan.",
          type: "string",
          required: true,
        },
        ResourceIdentifier: {
          name: "Resource Identifier",
          description:
            "If specified, the returned resources will have the specified resource identifier (or one of them in the case where the resource has multiple identifiers).",
          type: "string",
          required: false,
        },
        ResourceTypePrefix: {
          name: "Resource Type Prefix",
          description:
            "If specified, the returned resources will be of any of the resource types with the specified prefix.",
          type: "string",
          required: false,
        },
        TagKey: {
          name: "Tag Key",
          description:
            "If specified, the returned resources will have a matching tag key.",
          type: "string",
          required: false,
        },
        TagValue: {
          name: "Tag Value",
          description:
            "If specified, the returned resources will have a matching tag value.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string that identifies the next page of resource scan results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "If the number of available results exceeds this maximum, the response includes a NextToken value that you can use for the NextToken parameter to get the next set of results.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListResourceScanResourcesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Resource Scan Resources Result",
      description: "Result from ListResourceScanResources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Resources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                ResourceIdentifier: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
                ManagedByStack: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description:
              "List of up to MaxResults resources in the specified resource scan that match all of the specified filters.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all the remaining results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listResourceScanResources;
