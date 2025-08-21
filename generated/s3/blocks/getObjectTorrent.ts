import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetObjectTorrentCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getObjectTorrent: AppBlock = {
  name: "Get Object Torrent",
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
            "The name of the bucket containing the object for which to get the torrent files.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description: "The object key for which to get the information.",
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

        const command = new GetObjectTorrentCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Object Torrent Result",
      description: "Result from GetObjectTorrent operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Body: {
            type: "string",
            description:
              "A Bencoded dictionary as defined by the BitTorrent specification",
          },
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

export default getObjectTorrent;
