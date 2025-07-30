import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListStackResourcesCommand,
} from "@aws-sdk/client-cloudformation";

const listStackResources: AppBlock = {
  name: "List Stack Resources",
  description: "Returns descriptions of all resources of the specified stack.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "The name or the unique stack ID that is associated with the stack, which aren't always interchangeable: Running stacks: You can specify either the stack's name or its unique stack ID.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string that identifies the next page of stack resources that you want to retrieve.",
          type: "string",
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

        const command = new ListStackResourcesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Stack Resources Result",
      description: "Result from ListStackResources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackResourceSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LogicalResourceId: {
                  type: "string",
                },
                PhysicalResourceId: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                LastUpdatedTimestamp: {
                  type: "string",
                },
                ResourceStatus: {
                  type: "string",
                },
                ResourceStatusReason: {
                  type: "string",
                },
                DriftInformation: {
                  type: "object",
                  properties: {
                    StackResourceDriftStatus: {
                      type: "string",
                    },
                    LastCheckTimestamp: {
                      type: "string",
                    },
                  },
                  required: ["StackResourceDriftStatus"],
                  additionalProperties: false,
                },
                ModuleInfo: {
                  type: "object",
                  properties: {
                    TypeHierarchy: {
                      type: "string",
                    },
                    LogicalIdHierarchy: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: [
                "LogicalResourceId",
                "ResourceType",
                "LastUpdatedTimestamp",
                "ResourceStatus",
              ],
              additionalProperties: false,
            },
            description: "A list of StackResourceSummary structures.",
          },
          NextToken: {
            type: "string",
            description:
              "If the output exceeds 1 MB, a string that identifies the next page of stack resources.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listStackResources;
