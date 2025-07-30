import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, CreateSessionCommand } from "@aws-sdk/client-s3";

const createSession: AppBlock = {
  name: "Create Session",
  description:
    "Creates a session that establishes temporary security credentials to support fast authentication and authorization for the Zonal endpoint API operations on directory buckets.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SessionMode: {
          name: "Session Mode",
          description:
            "Specifies the mode of the session that will be created, either ReadWrite or ReadOnly.",
          type: "string",
          required: false,
        },
        Bucket: {
          name: "Bucket",
          description: "The name of the bucket that you create a session for.",
          type: "string",
          required: true,
        },
        ServerSideEncryption: {
          name: "Server Side Encryption",
          description:
            "The server-side encryption algorithm to use when you store objects in the directory bucket.",
          type: "string",
          required: false,
        },
        SSEKMSKeyId: {
          name: "SSEKMS Key Id",
          description:
            "If you specify x-amz-server-side-encryption with aws:kms, you must specify the x-amz-server-side-encryption-aws-kms-key-id header with the ID (Key ID or Key ARN) of the KMS symmetric encryption customer managed key to use.",
          type: "string",
          required: false,
        },
        SSEKMSEncryptionContext: {
          name: "SSEKMS Encryption Context",
          description:
            "Specifies the Amazon Web Services KMS Encryption Context as an additional encryption context to use for object encryption.",
          type: "string",
          required: false,
        },
        BucketKeyEnabled: {
          name: "Bucket Key Enabled",
          description:
            "Specifies whether Amazon S3 should use an S3 Bucket Key for object encryption with server-side encryption using KMS keys (SSE-KMS).",
          type: "boolean",
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

        const command = new CreateSessionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Session Result",
      description: "Result from CreateSession operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ServerSideEncryption: {
            type: "string",
            description:
              "The server-side encryption algorithm used when you store objects in the directory bucket.",
          },
          SSEKMSKeyId: {
            type: "string",
            description:
              "If you specify x-amz-server-side-encryption with aws:kms, this header indicates the ID of the KMS symmetric encryption customer managed key that was used for object encryption.",
          },
          SSEKMSEncryptionContext: {
            type: "string",
            description:
              "If present, indicates the Amazon Web Services KMS Encryption Context to use for object encryption.",
          },
          BucketKeyEnabled: {
            type: "boolean",
            description:
              "Indicates whether to use an S3 Bucket Key for server-side encryption with KMS keys (SSE-KMS).",
          },
          Credentials: {
            type: "object",
            properties: {
              AccessKeyId: {
                type: "string",
              },
              SecretAccessKey: {
                type: "string",
              },
              SessionToken: {
                type: "string",
              },
              Expiration: {
                type: "string",
              },
            },
            required: [
              "AccessKeyId",
              "SecretAccessKey",
              "SessionToken",
              "Expiration",
            ],
            additionalProperties: false,
            description:
              "The established temporary security credentials for the created session.",
          },
        },
        required: ["Credentials"],
      },
    },
  },
};

export default createSession;
