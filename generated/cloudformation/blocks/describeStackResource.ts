import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackResourceCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackResource: AppBlock = {
  name: "Describe Stack Resource",
  description:
    "Returns a description of the specified resource in the specified stack.",
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
          required: true,
        },
        LogicalResourceId: {
          name: "Logical Resource Id",
          description:
            "The logical name of the resource as specified in the template.",
          type: "string",
          required: true,
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

        const command = new DescribeStackResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Resource Result",
      description: "Result from DescribeStackResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackResourceDetail: {
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
              LastUpdatedTimestamp: {
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
              Metadata: {
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
            description:
              "A StackResourceDetail structure that contains the description of the specified resource in the specified stack.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStackResource;
