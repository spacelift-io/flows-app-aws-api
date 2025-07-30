import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DownloadDBLogFilePortionCommand,
} from "@aws-sdk/client-rds";

const downloadDBLogFilePortion: AppBlock = {
  name: "Download DB Log File Portion",
  description:
    "Downloads all or a portion of the specified log file, up to 1 MB in size.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBInstanceIdentifier: {
          name: "DB Instance Identifier",
          description:
            "The customer-assigned name of the DB instance that contains the log files you want to list.",
          type: "string",
          required: true,
        },
        LogFileName: {
          name: "Log File Name",
          description: "The name of the log file to be downloaded.",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            'The pagination token provided in the previous request or "0".',
          type: "string",
          required: false,
        },
        NumberOfLines: {
          name: "Number Of Lines",
          description: "The number of lines to download.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DownloadDBLogFilePortionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Download DB Log File Portion Result",
      description: "Result from DownloadDBLogFilePortion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LogFileData: {
            type: "string",
            description: "Entries from the specified log file.",
          },
          Marker: {
            type: "string",
            description:
              "A pagination token that can be used in a later DownloadDBLogFilePortion request.",
          },
          AdditionalDataPending: {
            type: "boolean",
            description:
              "A Boolean value that, if true, indicates there is more data to be downloaded.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default downloadDBLogFilePortion;
