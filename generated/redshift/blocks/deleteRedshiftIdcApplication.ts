import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteRedshiftIdcApplicationCommand,
} from "@aws-sdk/client-redshift";

const deleteRedshiftIdcApplication: AppBlock = {
  name: "Delete Redshift Idc Application",
  description: `Deletes an Amazon Redshift IAM Identity Center application.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RedshiftIdcApplicationArn: {
          name: "Redshift Idc Application Arn",
          description:
            "The ARN for a deleted Amazon Redshift IAM Identity Center application.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DeleteRedshiftIdcApplicationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Redshift Idc Application Result",
      description: "Result from DeleteRedshiftIdcApplication operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteRedshiftIdcApplication;
