import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  ApplyPendingMaintenanceActionCommand,
} from "@aws-sdk/client-rds";

const applyPendingMaintenanceAction: AppBlock = {
  name: "Apply Pending Maintenance Action",
  description:
    "Applies a pending maintenance action to a resource (for example, to a DB instance).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceIdentifier: {
          name: "Resource Identifier",
          description:
            "The RDS Amazon Resource Name (ARN) of the resource that the pending maintenance action applies to.",
          type: "string",
          required: true,
        },
        ApplyAction: {
          name: "Apply Action",
          description:
            "The pending maintenance action to apply to this resource.",
          type: "string",
          required: true,
        },
        OptInType: {
          name: "Opt In Type",
          description:
            "A value that specifies the type of opt-in request, or undoes an opt-in request.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ApplyPendingMaintenanceActionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Apply Pending Maintenance Action Result",
      description: "Result from ApplyPendingMaintenanceAction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourcePendingMaintenanceActions: {
            type: "object",
            properties: {
              ResourceIdentifier: {
                type: "string",
              },
              PendingMaintenanceActionDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Action: {
                      type: "string",
                    },
                    AutoAppliedAfterDate: {
                      type: "string",
                    },
                    ForcedApplyDate: {
                      type: "string",
                    },
                    OptInStatus: {
                      type: "string",
                    },
                    CurrentApplyDate: {
                      type: "string",
                    },
                    Description: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Describes the pending maintenance actions for a resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default applyPendingMaintenanceAction;
