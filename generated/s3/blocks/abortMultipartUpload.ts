import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";

const abortMultipartUpload: AppBlock = {
  name: "Abort Multipart Upload",
  description: "This operation aborts a multipart upload.",
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
          description: "The bucket name to which the upload was taking place.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "Key of the object for which the multipart upload was initiated.",
          type: "string",
          required: true,
        },
        UploadId: {
          name: "Upload Id",
          description: "Upload ID that identifies the multipart upload.",
          type: "string",
          required: true,
        },
        RequestPayer: {
          name: "Request Payer",
          description:
            "Confirms that the requester knows that they will be charged for the request.",
          type: "string",
          required: false,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
        IfMatchInitiatedTime: {
          name: "If Match Initiated Time",
          description:
            "If present, this header aborts an in progress multipart upload only if it was initiated on the provided timestamp.",
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

        const command = new AbortMultipartUploadCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Abort Multipart Upload Result",
      description: "Result from AbortMultipartUpload operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RequestCharged: {
            type: "string",
            description:
              "If present, indicates that the requester was successfully charged for the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default abortMultipartUpload;
