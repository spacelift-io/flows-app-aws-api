import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackResourcesCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackResources: AppBlock = {
  name: "Describe Stack Resources",
  description:
    "Returns Amazon Web Services resource descriptions for running and deleted stacks.",
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
          required: false,
        },
        LogicalResourceId: {
          name: "Logical Resource Id",
          description:
            "The logical name of the resource as specified in the template.",
          type: "string",
          required: false,
        },
        PhysicalResourceId: {
          name: "Physical Resource Id",
          description:
            "The name or unique identifier that corresponds to a physical instance ID of a resource supported by CloudFormation.",
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

        const command = new DescribeStackResourcesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Resources Result",
      description: "Result from DescribeStackResources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackResources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StackName: {
                  type: "string",
                },
                StackId: {
                  type: "string",
                },
                LogicalResourceId: {
                  type: "string",
                },
                PhysicalResourceId: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                Timestamp: {
                  type: "string",
                },
                ResourceStatus: {
                  type: "string",
                },
                ResourceStatusReason: {
                  type: "string",
                },
                Description: {
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
                "Timestamp",
                "ResourceStatus",
              ],
              additionalProperties: false,
            },
            description: "A list of StackResource structures.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStackResources;
