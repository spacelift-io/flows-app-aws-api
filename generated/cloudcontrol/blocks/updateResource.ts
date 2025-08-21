import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudControlClient,
  UpdateResourceCommand,
} from "@aws-sdk/client-cloudcontrol";

const updateResource: AppBlock = {
  name: "Update Resource",
  description: "Updates the specified property values in the resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the resource type.",
          type: "string",
          required: true,
        },
        TypeVersionId: {
          name: "Type Version Id",
          description:
            "For private resource types, the type version to use in this resource operation.",
          type: "string",
          required: false,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role for Cloud Control API to use when performing this resource operation.",
          type: "string",
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "A unique identifier to ensure the idempotency of the resource request.",
          type: "string",
          required: false,
        },
        Identifier: {
          name: "Identifier",
          description: "The identifier for the resource.",
          type: "string",
          required: true,
        },
        PatchDocument: {
          name: "Patch Document",
          description:
            "A JavaScript Object Notation (JSON) document listing the patch operations that represent the updates to apply to the current resource properties.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudControlClient({
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

        const command = new UpdateResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Resource Result",
      description: "Result from UpdateResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ProgressEvent: {
            type: "object",
            properties: {
              TypeName: {
                type: "string",
              },
              Identifier: {
                type: "string",
              },
              RequestToken: {
                type: "string",
              },
              HooksRequestToken: {
                type: "string",
              },
              Operation: {
                type: "string",
                enum: ["CREATE", "DELETE", "UPDATE"],
              },
              OperationStatus: {
                type: "string",
                enum: [
                  "PENDING",
                  "IN_PROGRESS",
                  "SUCCESS",
                  "FAILED",
                  "CANCEL_IN_PROGRESS",
                  "CANCEL_COMPLETE",
                ],
              },
              EventTime: {
                type: "string",
              },
              ResourceModel: {
                type: "string",
              },
              StatusMessage: {
                type: "string",
              },
              ErrorCode: {
                type: "string",
                enum: [
                  "NotUpdatable",
                  "InvalidRequest",
                  "AccessDenied",
                  "UnauthorizedTaggingOperation",
                  "InvalidCredentials",
                  "AlreadyExists",
                  "NotFound",
                  "ResourceConflict",
                  "Throttling",
                  "ServiceLimitExceeded",
                  "NotStabilized",
                  "GeneralServiceException",
                  "ServiceInternalError",
                  "ServiceTimeout",
                  "NetworkFailure",
                  "InternalFailure",
                ],
              },
              RetryAfter: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Represents the current status of the resource update request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateResource;
