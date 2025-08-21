import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackInstanceCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackInstance: AppBlock = {
  name: "Describe Stack Instance",
  description:
    "Returns the stack instance that's associated with the specified StackSet, Amazon Web Services account, and Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackSetName: {
          name: "Stack Set Name",
          description:
            "The name or the unique stack ID of the stack set that you want to get stack instance information for.",
          type: "string",
          required: true,
        },
        StackInstanceAccount: {
          name: "Stack Instance Account",
          description:
            "The ID of an Amazon Web Services account that's associated with this stack instance.",
          type: "string",
          required: true,
        },
        StackInstanceRegion: {
          name: "Stack Instance Region",
          description:
            "The name of a Region that's associated with this stack instance.",
          type: "string",
          required: true,
        },
        CallAs: {
          name: "Call As",
          description:
            "[Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeStackInstanceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Instance Result",
      description: "Result from DescribeStackInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackInstance: {
            type: "object",
            properties: {
              StackSetId: {
                type: "string",
              },
              Region: {
                type: "string",
              },
              Account: {
                type: "string",
              },
              StackId: {
                type: "string",
              },
              ParameterOverrides: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ParameterKey: {
                      type: "string",
                    },
                    ParameterValue: {
                      type: "string",
                    },
                    UsePreviousValue: {
                      type: "boolean",
                    },
                    ResolvedValue: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Status: {
                type: "string",
              },
              StackInstanceStatus: {
                type: "object",
                properties: {
                  DetailedStatus: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              StatusReason: {
                type: "string",
              },
              OrganizationalUnitId: {
                type: "string",
              },
              DriftStatus: {
                type: "string",
              },
              LastDriftCheckTimestamp: {
                type: "string",
              },
              LastOperationId: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The stack instance that matches the specified request parameters.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStackInstance;
