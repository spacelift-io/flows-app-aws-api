import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeChangeSetHooksCommand,
} from "@aws-sdk/client-cloudformation";

const describeChangeSetHooks: AppBlock = {
  name: "Describe Change Set Hooks",
  description:
    "Returns hook-related information for the change set and a list of changes that CloudFormation makes when you run the change set.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ChangeSetName: {
          name: "Change Set Name",
          description:
            "The name or Amazon Resource Name (ARN) of the change set that you want to describe.",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "If you specified the name of a change set, specify the stack name or stack ID (ARN) of the change set you want to describe.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string, provided by the DescribeChangeSetHooks response output, that identifies the next page of information that you want to retrieve.",
          type: "string",
          required: false,
        },
        LogicalResourceId: {
          name: "Logical Resource Id",
          description:
            "If specified, lists only the Hooks related to the specified LogicalResourceId.",
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

        const command = new DescribeChangeSetHooksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Change Set Hooks Result",
      description: "Result from DescribeChangeSetHooks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeSetId: {
            type: "string",
            description: "The change set identifier (stack ID).",
          },
          ChangeSetName: {
            type: "string",
            description: "The change set name.",
          },
          Hooks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InvocationPoint: {
                  type: "string",
                },
                FailureMode: {
                  type: "string",
                },
                TypeName: {
                  type: "string",
                },
                TypeVersionId: {
                  type: "string",
                },
                TypeConfigurationVersionId: {
                  type: "string",
                },
                TargetDetails: {
                  type: "object",
                  properties: {
                    TargetType: {
                      type: "string",
                    },
                    ResourceTargetDetails: {
                      type: "object",
                      properties: {
                        LogicalResourceId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ResourceType: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ResourceAction: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "List of hook objects.",
          },
          Status: {
            type: "string",
            description: "Provides the status of the change set hook.",
          },
          NextToken: {
            type: "string",
            description: "Pagination token, null or empty if no more results.",
          },
          StackId: {
            type: "string",
            description: "The stack identifier (stack ID).",
          },
          StackName: {
            type: "string",
            description: "The stack name.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeChangeSetHooks;
