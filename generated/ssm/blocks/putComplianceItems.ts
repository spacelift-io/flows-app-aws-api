import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, PutComplianceItemsCommand } from "@aws-sdk/client-ssm";

const putComplianceItems: AppBlock = {
  name: "Put Compliance Items",
  description:
    "Registers a compliance type and other compliance details on a designated resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceId: {
          name: "Resource Id",
          description: "Specify an ID for this resource.",
          type: "string",
          required: true,
        },
        ResourceType: {
          name: "Resource Type",
          description: "Specify the type of resource.",
          type: "string",
          required: true,
        },
        ComplianceType: {
          name: "Compliance Type",
          description: "Specify the compliance type.",
          type: "string",
          required: true,
        },
        ExecutionSummary: {
          name: "Execution Summary",
          description:
            "A summary of the call execution that includes an execution ID, the type of execution (for example, C...",
          type: {
            type: "object",
            properties: {
              ExecutionTime: {
                type: "string",
              },
              ExecutionId: {
                type: "string",
              },
              ExecutionType: {
                type: "string",
              },
            },
            required: ["ExecutionTime"],
            additionalProperties: false,
          },
          required: true,
        },
        Items: {
          name: "Items",
          description:
            "Information about the compliance as defined by the resource type.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Title: {
                  type: "string",
                },
                Severity: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                Details: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              required: ["Severity", "Status"],
              additionalProperties: false,
            },
          },
          required: true,
        },
        ItemContentHash: {
          name: "Item Content Hash",
          description: "MD5 or SHA-256 content hash.",
          type: "string",
          required: false,
        },
        UploadType: {
          name: "Upload Type",
          description: "The mode for uploading compliance items.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new PutComplianceItemsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Compliance Items Result",
      description: "Result from PutComplianceItems operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default putComplianceItems;
