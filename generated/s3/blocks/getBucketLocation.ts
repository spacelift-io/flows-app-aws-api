import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketLocationCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getBucketLocation: AppBlock = {
  name: "Get Bucket Location",
  description: "This operation is not supported for directory buckets.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Bucket: {
          name: "Bucket",
          description: "The name of the bucket for which to get the location.",
          type: "string",
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new S3Client({
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

        const command = new GetBucketLocationCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Location Result",
      description: "Result from GetBucketLocation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LocationConstraint: {
            type: "string",
            description: "Specifies the Region where the bucket resides.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketLocation;
