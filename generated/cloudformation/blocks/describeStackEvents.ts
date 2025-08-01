import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackEventsCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackEvents: AppBlock = {
  name: "Describe Stack Events",
  description:
    "Returns all stack related events for a specified stack in reverse chronological order.",
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
            "The name or the unique stack ID that's associated with the stack, which aren't always interchangeable: Running stacks: You can specify either the stack's name or its unique stack ID.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string that identifies the next page of events that you want to retrieve.",
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

        const command = new DescribeStackEventsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Events Result",
      description: "Result from DescribeStackEvents operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackEvents: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StackId: {
                  type: "string",
                },
                EventId: {
                  type: "string",
                },
                StackName: {
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
                ResourceProperties: {
                  type: "string",
                },
                ClientRequestToken: {
                  type: "string",
                },
                HookType: {
                  type: "string",
                },
                HookStatus: {
                  type: "string",
                },
                HookStatusReason: {
                  type: "string",
                },
                HookInvocationPoint: {
                  type: "string",
                },
                HookFailureMode: {
                  type: "string",
                },
                DetailedStatus: {
                  type: "string",
                },
              },
              required: ["StackId", "EventId", "StackName", "Timestamp"],
              additionalProperties: false,
            },
            description: "A list of StackEvents structures.",
          },
          NextToken: {
            type: "string",
            description:
              "If the output exceeds 1 MB in size, a string that identifies the next page of events.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStackEvents;
