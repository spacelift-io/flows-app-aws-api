import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetFunctionCommand,
} from "@aws-sdk/client-cloudfront";

const getFunction: AppBlock = {
  name: "Get Function",
  description: "Gets the code of a CloudFront function.",
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
          description: "The name of the function whose code you are getting.",
          type: "string",
          required: true,
        },
        Stage: {
          name: "Stage",
          description: "The function's stage, either DEVELOPMENT or LIVE.",
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
        });

        const command = new GetFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Function Result",
      description: "Result from GetFunction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FunctionCode: {
            type: "string",
            description: "The function code of a CloudFront function.",
          },
          ETag: {
            type: "string",
            description:
              "The version identifier for the current version of the CloudFront function.",
          },
          ContentType: {
            type: "string",
            description: "The content type (media type) of the response.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getFunction;
