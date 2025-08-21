import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateDelegateMacVolumeOwnershipTaskCommand,
} from "@aws-sdk/client-ec2";

const createDelegateMacVolumeOwnershipTask: AppBlock = {
  name: "Create Delegate Mac Volume Ownership Task",
  description:
    "Delegates ownership of the Amazon EBS root volume for an Apple silicon Mac instance to an administrative user.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the Amazon EC2 Mac instance.",
          type: "string",
          required: true,
        },
        MacCredentials: {
          name: "Mac Credentials",
          description:
            "Specifies the following credentials: Internal disk administrative user Username - Only the default administrative user (aws-managed-user) is supported and it is used by default.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to assign to the volume ownership delegation task.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateDelegateMacVolumeOwnershipTaskCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Delegate Mac Volume Ownership Task Result",
      description: "Result from CreateDelegateMacVolumeOwnershipTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MacModificationTask: {
            type: "object",
            properties: {
              InstanceId: {
                type: "string",
              },
              MacModificationTaskId: {
                type: "string",
              },
              MacSystemIntegrityProtectionConfig: {
                type: "object",
                properties: {
                  AppleInternal: {
                    type: "string",
                  },
                  BaseSystem: {
                    type: "string",
                  },
                  DebuggingRestrictions: {
                    type: "string",
                  },
                  DTraceRestrictions: {
                    type: "string",
                  },
                  FilesystemProtections: {
                    type: "string",
                  },
                  KextSigning: {
                    type: "string",
                  },
                  NvramProtections: {
                    type: "string",
                  },
                  Status: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              StartTime: {
                type: "string",
              },
              Tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              TaskState: {
                type: "string",
              },
              TaskType: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Information about the volume ownership delegation task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createDelegateMacVolumeOwnershipTask;
