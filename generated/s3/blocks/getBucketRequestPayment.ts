import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketRequestPaymentCommand } from "@aws-sdk/client-s3";

const getBucketRequestPayment: AppBlock = {
  name: "Get Bucket Request Payment",
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
          description:
            "The name of the bucket for which to get the payment request configuration",
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
        });

        const command = new GetBucketRequestPaymentCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Request Payment Result",
      description: "Result from GetBucketRequestPayment operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Payer: {
            type: "string",
            description:
              "Specifies who pays for the download and request fees.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketRequestPayment;
