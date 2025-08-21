import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetFlowLogsIntegrationTemplateCommand,
} from "@aws-sdk/client-ec2";

const getFlowLogsIntegrationTemplate: AppBlock = {
  name: "Get Flow Logs Integration Template",
  description:
    "Generates a CloudFormation template that streamlines and automates the integration of VPC flow logs with Amazon Athena.",
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
        FlowLogId: {
          name: "Flow Log Id",
          description: "The ID of the flow log.",
          type: "string",
          required: true,
        },
        ConfigDeliveryS3DestinationArn: {
          name: "Config Delivery S3Destination Arn",
          description:
            "To store the CloudFormation template in Amazon S3, specify the location in Amazon S3.",
          type: "string",
          required: true,
        },
        IntegrateServices: {
          name: "Integrate Services",
          description: "Information about the service integration.",
          type: {
            type: "object",
            properties: {
              AthenaIntegrations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    IntegrationResultS3DestinationArn: {
                      type: "string",
                    },
                    PartitionLoadFrequency: {
                      type: "string",
                    },
                    PartitionStartDate: {
                      type: "string",
                    },
                    PartitionEndDate: {
                      type: "string",
                    },
                  },
                  required: [
                    "IntegrationResultS3DestinationArn",
                    "PartitionLoadFrequency",
                  ],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
          required: true,
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

        const command = new GetFlowLogsIntegrationTemplateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Flow Logs Integration Template Result",
      description: "Result from GetFlowLogsIntegrationTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Result: {
            type: "string",
            description: "The generated CloudFormation template.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getFlowLogsIntegrationTemplate;
