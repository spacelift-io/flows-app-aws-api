import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  RecordHandlerProgressCommand,
} from "@aws-sdk/client-cloudformation";

const recordHandlerProgress: AppBlock = {
  name: "Record Handler Progress",
  description: "Reports progress of a resource handler to CloudFormation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BearerToken: {
          name: "Bearer Token",
          description: "Reserved for use by the CloudFormation CLI.",
          type: "string",
          required: true,
        },
        OperationStatus: {
          name: "Operation Status",
          description: "Reserved for use by the CloudFormation CLI.",
          type: "string",
          required: true,
        },
        CurrentOperationStatus: {
          name: "Current Operation Status",
          description: "Reserved for use by the CloudFormation CLI.",
          type: "string",
          required: false,
        },
        StatusMessage: {
          name: "Status Message",
          description: "Reserved for use by the CloudFormation CLI.",
          type: "string",
          required: false,
        },
        ErrorCode: {
          name: "Error Code",
          description: "Reserved for use by the CloudFormation CLI.",
          type: "string",
          required: false,
        },
        ResourceModel: {
          name: "Resource Model",
          description: "Reserved for use by the CloudFormation CLI.",
          type: "string",
          required: false,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description: "Reserved for use by the CloudFormation CLI.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new RecordHandlerProgressCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Record Handler Progress Result",
      description: "Result from RecordHandlerProgress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default recordHandlerProgress;
