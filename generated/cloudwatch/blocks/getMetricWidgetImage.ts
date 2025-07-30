import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  GetMetricWidgetImageCommand,
} from "@aws-sdk/client-cloudwatch";

const getMetricWidgetImage: AppBlock = {
  name: "Get Metric Widget Image",
  description:
    "You can use the GetMetricWidgetImage API to retrieve a snapshot graph of one or more Amazon CloudWatch metrics as a bitmap image.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MetricWidget: {
          name: "Metric Widget",
          description:
            "A JSON string that defines the bitmap graph to be retrieved.",
          type: "string",
          required: true,
        },
        OutputFormat: {
          name: "Output Format",
          description: "The format of the resulting image.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudWatchClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetMetricWidgetImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Metric Widget Image Result",
      description: "Result from GetMetricWidgetImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MetricWidgetImage: {
            type: "string",
            description:
              "The image of the graph, in the output format specified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMetricWidgetImage;
