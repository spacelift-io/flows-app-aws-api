import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  StartResourceScanCommand,
} from "@aws-sdk/client-cloudformation";

const startResourceScan: AppBlock = {
  name: "Start Resource Scan",
  description: "Starts a scan of the resources in this account in this Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "A unique identifier for this StartResourceScan request.",
          type: "string",
          required: false,
        },
        ScanFilters: {
          name: "Scan Filters",
          description: "The scan filters to use.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Types: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new StartResourceScanCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Resource Scan Result",
      description: "Result from StartResourceScan operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceScanId: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the resource scan.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startResourceScan;
