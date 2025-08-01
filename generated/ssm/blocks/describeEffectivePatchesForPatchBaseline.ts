import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeEffectivePatchesForPatchBaselineCommand,
} from "@aws-sdk/client-ssm";

const describeEffectivePatchesForPatchBaseline: AppBlock = {
  name: "Describe Effective Patches For Patch Baseline",
  description:
    "Retrieves the current effective patches (the patch and the approval state) for the specified patch baseline.",
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
          description:
            "The ID of the patch baseline to retrieve the effective patches for.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of patches to return (per page).",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
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
        });

        const command = new DescribeEffectivePatchesForPatchBaselineCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Effective Patches For Patch Baseline Result",
      description:
        "Result from DescribeEffectivePatchesForPatchBaseline operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EffectivePatches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Patch: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    ReleaseDate: {
                      type: "string",
                    },
                    Title: {
                      type: "string",
                    },
                    Description: {
                      type: "string",
                    },
                    ContentUrl: {
                      type: "string",
                    },
                    Vendor: {
                      type: "string",
                    },
                    ProductFamily: {
                      type: "string",
                    },
                    Product: {
                      type: "string",
                    },
                    Classification: {
                      type: "string",
                    },
                    MsrcSeverity: {
                      type: "string",
                    },
                    KbNumber: {
                      type: "string",
                    },
                    MsrcNumber: {
                      type: "string",
                    },
                    Language: {
                      type: "string",
                    },
                    AdvisoryIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    BugzillaIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    CVEIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Name: {
                      type: "string",
                    },
                    Epoch: {
                      type: "number",
                    },
                    Version: {
                      type: "string",
                    },
                    Release: {
                      type: "string",
                    },
                    Arch: {
                      type: "string",
                    },
                    Severity: {
                      type: "string",
                    },
                    Repository: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                PatchStatus: {
                  type: "object",
                  properties: {
                    DeploymentStatus: {
                      type: "string",
                    },
                    ComplianceLevel: {
                      type: "string",
                    },
                    ApprovalDate: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "An array of patches and patch status.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEffectivePatchesForPatchBaseline;
