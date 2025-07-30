import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeFleetInstancesCommand } from "@aws-sdk/client-ec2";

const describeFleetInstances: AppBlock = {
  name: "Describe Fleet Instances",
  description: "Describes the running instances for the specified EC2 Fleet.",
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
        FleetId: {
          name: "Fleet Id",
          description: "The ID of the EC2 Fleet.",
          type: "string",
          required: true,
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
        });

        const command = new DescribeFleetInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Fleet Instances Result",
      description: "Result from DescribeFleetInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ActiveInstances: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                InstanceType: {
                  type: "string",
                },
                SpotInstanceRequestId: {
                  type: "string",
                },
                InstanceHealth: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The running instances.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          FleetId: {
            type: "string",
            description: "The ID of the EC2 Fleet.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeFleetInstances;
