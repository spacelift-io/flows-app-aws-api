import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetObjectTaggingCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getObjectTagging: AppBlock = {
  name: "Get Object Tagging",
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
            "The bucket name containing the object for which to get the tagging information.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description: "Object key for which to get the tagging information.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description:
            "The versionId of the object for which to get the tagging information.",
          type: "string",
          required: false,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
        RequestPayer: {
          name: "Request Payer",
          description:
            "Confirms that the requester knows that they will be charged for the request.",
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

        const command = new GetObjectTaggingCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Object Tagging Result",
      description: "Result from GetObjectTagging operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VersionId: {
            type: "string",
            description:
              "The versionId of the object for which you got the tagging information.",
          },
          TagSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
            description: "Contains the tag set.",
          },
        },
        required: ["TagSet"],
      },
    },
  },
};

export default getObjectTagging;
