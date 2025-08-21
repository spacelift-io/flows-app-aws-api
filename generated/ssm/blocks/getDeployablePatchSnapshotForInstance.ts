import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  GetDeployablePatchSnapshotForInstanceCommand,
} from "@aws-sdk/client-ssm";

const getDeployablePatchSnapshotForInstance: AppBlock = {
  name: "Get Deployable Patch Snapshot For Instance",
  description:
    "Retrieves the current snapshot for the patch baseline the managed node uses.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "The ID of the managed node for which the appropriate patch snapshot should be retrieved.",
          type: "string",
          required: true,
        },
        SnapshotId: {
          name: "Snapshot Id",
          description:
            "The snapshot ID provided by the user when running AWS-RunPatchBaseline.",
          type: "string",
          required: true,
        },
        BaselineOverride: {
          name: "Baseline Override",
          description:
            "Defines the basic information about a patch baseline override.",
          type: {
            type: "object",
            properties: {
              OperatingSystem: {
                type: "string",
              },
              GlobalFilters: {
                type: "object",
                properties: {
                  PatchFilters: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Key: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Values: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Key", "Values"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["PatchFilters"],
                additionalProperties: false,
              },
              ApprovalRules: {
                type: "object",
                properties: {
                  PatchRules: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        PatchFilterGroup: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ComplianceLevel: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ApproveAfterDays: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ApproveUntilDate: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EnableNonSecurity: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["PatchFilterGroup"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["PatchRules"],
                additionalProperties: false,
              },
              ApprovedPatches: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              ApprovedPatchesComplianceLevel: {
                type: "string",
              },
              RejectedPatches: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              RejectedPatchesAction: {
                type: "string",
              },
              ApprovedPatchesEnableNonSecurity: {
                type: "boolean",
              },
              Sources: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Products: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Configuration: {
                      type: "string",
                    },
                  },
                  required: ["Name", "Products", "Configuration"],
                  additionalProperties: false,
                },
              },
              AvailableSecurityUpdatesComplianceStatus: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new GetDeployablePatchSnapshotForInstanceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Deployable Patch Snapshot For Instance Result",
      description:
        "Result from GetDeployablePatchSnapshotForInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The managed node ID.",
          },
          SnapshotId: {
            type: "string",
            description: "The user-defined snapshot ID.",
          },
          SnapshotDownloadUrl: {
            type: "string",
            description:
              "A pre-signed Amazon Simple Storage Service (Amazon S3) URL that can be used to download the patch snapshot.",
          },
          Product: {
            type: "string",
            description:
              "Returns the specific operating system (for example Windows Server 2012 or Amazon Linux 2015.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDeployablePatchSnapshotForInstance;
