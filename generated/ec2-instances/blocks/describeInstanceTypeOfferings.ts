import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeInstanceTypeOfferingsCommand,
} from "@aws-sdk/client-ec2";

const describeInstanceTypeOfferings: AppBlock = {
  name: "Describe Instance Type Offerings",
  description:
    "Lists the instance types that are offered for the specified location.",
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
        LocationType: {
          name: "Location Type",
          description: "The location type.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
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
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
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

        const command = new DescribeInstanceTypeOfferingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instance Type Offerings Result",
      description: "Result from DescribeInstanceTypeOfferings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceTypeOfferings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceType: {
                  type: "string",
                },
                LocationType: {
                  type: "string",
                },
                Location: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The instance types offered in the location.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInstanceTypeOfferings;
