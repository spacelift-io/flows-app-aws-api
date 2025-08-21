import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribePrincipalIdFormatCommand,
} from "@aws-sdk/client-ec2";

const describePrincipalIdFormat: AppBlock = {
  name: "Describe Principal Id Format",
  description:
    "Describes the ID format settings for the root user and all IAM roles and IAM users that have explicitly specified a longer ID (17-character ID) preference.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Resources: {
          name: "Resources",
          description:
            "The type of resource: bundle | conversion-task | customer-gateway | dhcp-options | elastic-ip-alloca...",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to request the next page of results.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new DescribePrincipalIdFormatCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Principal Id Format Result",
      description: "Result from DescribePrincipalIdFormat operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Principals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                Statuses: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Deadline: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Resource: {
                        type: "object",
                        additionalProperties: true,
                      },
                      UseLongIds: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the ID format settings for the ARN.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePrincipalIdFormat;
