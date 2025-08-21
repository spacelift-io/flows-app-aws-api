import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListResourceScansCommand,
} from "@aws-sdk/client-cloudformation";

const listResourceScans: AppBlock = {
  name: "List Resource Scans",
  description: "List the resource scans from newest to oldest.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string that identifies the next page of resource scan results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "If the number of available results exceeds this maximum, the response includes a NextToken value that you can use for the NextToken parameter to get the next set of results.",
          type: "number",
          required: false,
        },
        ScanTypeFilter: {
          name: "Scan Type Filter",
          description:
            "The scan type that you want to get summary information about.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListResourceScansCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Resource Scans Result",
      description: "Result from ListResourceScans operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceScanSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceScanId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusReason: {
                  type: "string",
                },
                StartTime: {
                  type: "string",
                },
                EndTime: {
                  type: "string",
                },
                PercentageCompleted: {
                  type: "number",
                },
                ScanType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of scans returned.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all the remaining results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listResourceScans;
