import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DeleteFunctionCommand,
} from "@aws-sdk/client-cloudfront";

const deleteFunction: AppBlock = {
  name: "Delete Function",
  description: "Deletes a CloudFront function.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the function that you are deleting.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current version (ETag value) of the function that you are deleting, which you can get using DescribeFunction.",
          type: "string",
          required: true,
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

        const command = new DeleteFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Function Result",
      description: "Result from DeleteFunction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteFunction;
