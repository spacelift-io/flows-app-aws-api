import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetPatchBaselineCommand } from "@aws-sdk/client-ssm";

const getPatchBaseline: AppBlock = {
  name: "Get Patch Baseline",
  description: "Retrieves information about a patch baseline.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BaselineId: {
          name: "Baseline Id",
          description: "The ID of the patch baseline to retrieve.",
          type: "string",
          required: true,
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

        const command = new GetPatchBaselineCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Patch Baseline Result",
      description: "Result from GetPatchBaseline operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BaselineId: {
            type: "string",
            description: "The ID of the retrieved patch baseline.",
          },
          Name: {
            type: "string",
            description: "The name of the patch baseline.",
          },
          OperatingSystem: {
            type: "string",
            description:
              "Returns the operating system specified for the patch baseline.",
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
                      type: "string",
                    },
                    Values: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["Key", "Values"],
                  additionalProperties: false,
                },
              },
            },
            required: ["PatchFilters"],
            additionalProperties: false,
            description:
              "A set of global filters used to exclude patches from the baseline.",
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
                      properties: {
                        PatchFilters: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["PatchFilters"],
                      additionalProperties: false,
                    },
                    ComplianceLevel: {
                      type: "string",
                    },
                    ApproveAfterDays: {
                      type: "number",
                    },
                    ApproveUntilDate: {
                      type: "string",
                    },
                    EnableNonSecurity: {
                      type: "boolean",
                    },
                  },
                  required: ["PatchFilterGroup"],
                  additionalProperties: false,
                },
              },
            },
            required: ["PatchRules"],
            additionalProperties: false,
            description:
              "A set of rules used to include patches in the baseline.",
          },
          ApprovedPatches: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of explicitly approved patches for the baseline.",
          },
          ApprovedPatchesComplianceLevel: {
            type: "string",
            description:
              "Returns the specified compliance severity level for approved patches in the patch baseline.",
          },
          ApprovedPatchesEnableNonSecurity: {
            type: "boolean",
            description:
              "Indicates whether the list of approved patches includes non-security updates that should be applied to the managed nodes.",
          },
          RejectedPatches: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of explicitly rejected patches for the baseline.",
          },
          RejectedPatchesAction: {
            type: "string",
            description:
              "The action specified to take on patches included in the RejectedPatches list.",
          },
          PatchGroups: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Patch groups included in the patch baseline.",
          },
          CreatedDate: {
            type: "string",
            description: "The date the patch baseline was created.",
          },
          ModifiedDate: {
            type: "string",
            description: "The date the patch baseline was last modified.",
          },
          Description: {
            type: "string",
            description: "A description of the patch baseline.",
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
                    type: "string",
                  },
                },
                Configuration: {
                  type: "string",
                },
              },
              required: ["Name", "Products", "Configuration"],
              additionalProperties: false,
            },
            description:
              "Information about the patches to use to update the managed nodes, including target operating systems and source repositories.",
          },
          AvailableSecurityUpdatesComplianceStatus: {
            type: "string",
            description:
              "Indicates the compliance status of managed nodes for which security-related patches are available but were not approved.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPatchBaseline;
