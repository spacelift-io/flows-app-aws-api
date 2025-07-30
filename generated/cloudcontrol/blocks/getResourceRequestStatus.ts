import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudControlClient,
  GetResourceRequestStatusCommand,
} from "@aws-sdk/client-cloudcontrol";

const getResourceRequestStatus: AppBlock = {
  name: "Get Resource Request Status",
  description: "Returns the current status of a resource operation request.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RequestToken: {
          name: "Request Token",
          description:
            "A unique token used to track the progress of the resource operation request.",
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
        });

        const command = new GetResourceRequestStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Resource Request Status Result",
      description: "Result from GetResourceRequestStatus operation",
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
              "Represents the current status of the resource operation request.",
          },
          HooksProgressEvent: {
            type: "array",
            items: {
              type: "object",
              properties: {
                HookTypeName: {
                  type: "string",
                },
                HookTypeVersionId: {
                  type: "string",
                },
                HookTypeArn: {
                  type: "string",
                },
                InvocationPoint: {
                  type: "string",
                },
                HookStatus: {
                  type: "string",
                },
                HookEventTime: {
                  type: "string",
                },
                HookStatusMessage: {
                  type: "string",
                },
                FailureMode: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Lists Hook invocations for the specified target in the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getResourceRequestStatus;
