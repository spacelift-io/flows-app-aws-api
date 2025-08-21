import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListResourceScanRelatedResourcesCommand,
} from "@aws-sdk/client-cloudformation";

const listResourceScanRelatedResources: AppBlock = {
  name: "List Resource Scan Related Resources",
  description:
    "Lists the related resources for a list of resources from a resource scan.",
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
        Resources: {
          name: "Resources",
          description:
            "The list of resources for which you want to get the related resources.",
          type: {
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
              },
              required: ["ResourceType", "ResourceIdentifier"],
              additionalProperties: false,
            },
          },
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListResourceScanRelatedResourcesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Resource Scan Related Resources Result",
      description: "Result from ListResourceScanRelatedResources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RelatedResources: {
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
              "List of up to MaxResults resources in the specified resource scan related to the specified resources.",
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

export default listResourceScanRelatedResources;
