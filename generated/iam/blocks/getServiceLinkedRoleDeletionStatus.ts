import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GetServiceLinkedRoleDeletionStatusCommand,
} from "@aws-sdk/client-iam";

const getServiceLinkedRoleDeletionStatus: AppBlock = {
  name: "Get Service Linked Role Deletion Status",
  description: "Retrieves the status of your service-linked role deletion.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DeletionTaskId: {
          name: "Deletion Task Id",
          description: "The deletion task identifier.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
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

        const command = new GetServiceLinkedRoleDeletionStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Service Linked Role Deletion Status Result",
      description: "Result from GetServiceLinkedRoleDeletionStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "string",
            description: "The status of the deletion.",
          },
          Reason: {
            type: "object",
            properties: {
              Reason: {
                type: "string",
              },
              RoleUsageList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Region: {
                      type: "string",
                    },
                    Resources: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "An object that contains details about the reason the deletion failed.",
          },
        },
        required: ["Status"],
      },
    },
  },
};

export default getServiceLinkedRoleDeletionStatus;
