import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DeleteContinuousDeploymentPolicyCommand,
} from "@aws-sdk/client-cloudfront";

const deleteContinuousDeploymentPolicy: AppBlock = {
  name: "Delete Continuous Deployment Policy",
  description: "Deletes a continuous deployment policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The identifier of the continuous deployment policy that you are deleting.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current version (ETag value) of the continuous deployment policy that you are deleting.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new DeleteContinuousDeploymentPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Continuous Deployment Policy Result",
      description: "Result from DeleteContinuousDeploymentPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteContinuousDeploymentPolicy;
