import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeIamInstanceProfileAssociationsCommand,
} from "@aws-sdk/client-ec2";

const describeIamInstanceProfileAssociations: AppBlock = {
  name: "Describe Iam Instance Profile Associations",
  description: "Describes your IAM instance profile associations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationIds: {
          name: "Association Ids",
          description: "The IAM instance profile associations.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
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

        const command = new DescribeIamInstanceProfileAssociationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Iam Instance Profile Associations Result",
      description:
        "Result from DescribeIamInstanceProfileAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IamInstanceProfileAssociations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AssociationId: {
                  type: "string",
                },
                InstanceId: {
                  type: "string",
                },
                IamInstanceProfile: {
                  type: "object",
                  properties: {
                    Arn: {
                      type: "string",
                    },
                    Id: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                State: {
                  type: "string",
                },
                Timestamp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the IAM instance profile associations.",
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

export default describeIamInstanceProfileAssociations;
