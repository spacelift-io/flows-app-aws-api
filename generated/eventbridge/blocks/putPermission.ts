import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  PutPermissionCommand,
} from "@aws-sdk/client-eventbridge";

const putPermission: AppBlock = {
  name: "Put Permission",
  description:
    "Running PutPermission permits the specified Amazon Web Services account or Amazon Web Services organization to put events to the specified event bus.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventBusName: {
          name: "Event Bus Name",
          description: "The name of the event bus associated with the rule.",
          type: "string",
          required: false,
        },
        Action: {
          name: "Action",
          description:
            "The action that you are enabling the other account to perform.",
          type: "string",
          required: false,
        },
        Principal: {
          name: "Principal",
          description:
            "The 12-digit Amazon Web Services account ID that you are permitting to put events to your default event bus.",
          type: "string",
          required: false,
        },
        StatementId: {
          name: "Statement Id",
          description:
            "An identifier string for the external account that you are granting permissions to.",
          type: "string",
          required: false,
        },
        Condition: {
          name: "Condition",
          description:
            "This parameter enables you to limit the permission to accounts that fulfill a certain condition, such as being a member of a certain Amazon Web Services organization.",
          type: {
            type: "object",
            properties: {
              Type: {
                type: "string",
              },
              Key: {
                type: "string",
              },
              Value: {
                type: "string",
              },
            },
            required: ["Type", "Key", "Value"],
            additionalProperties: false,
          },
          required: false,
        },
        Policy: {
          name: "Policy",
          description:
            "A JSON string that describes the permission policy statement.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new PutPermissionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Permission Result",
      description: "Result from PutPermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putPermission;
