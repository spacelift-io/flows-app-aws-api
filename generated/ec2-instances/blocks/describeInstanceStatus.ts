import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeInstanceStatusCommand } from "@aws-sdk/client-ec2";

const describeInstanceStatus: AppBlock = {
  name: "Describe Instance Status",
  description:
    "Describes the status of the specified instances or all of your instances.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceIds: {
          name: "Instance Ids",
          description: "The instance IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        IncludeAllInstances: {
          name: "Include All Instances",
          description:
            "When true, includes the health status for all instances.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeInstanceStatusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instance Status Result",
      description: "Result from DescribeInstanceStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceStatuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AvailabilityZone: {
                  type: "string",
                },
                OutpostArn: {
                  type: "string",
                },
                Operator: {
                  type: "object",
                  properties: {
                    Managed: {
                      type: "boolean",
                    },
                    Principal: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Events: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      InstanceEventId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Code: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotAfter: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotBefore: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotBeforeDeadline: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                InstanceId: {
                  type: "string",
                },
                InstanceState: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "number",
                    },
                    Name: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                InstanceStatus: {
                  type: "object",
                  properties: {
                    Details: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                SystemStatus: {
                  type: "object",
                  properties: {
                    Details: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                AttachedEbsStatus: {
                  type: "object",
                  properties: {
                    Details: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Information about the status of the instances.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInstanceStatus;
