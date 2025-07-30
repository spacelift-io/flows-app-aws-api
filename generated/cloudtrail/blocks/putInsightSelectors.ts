import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  PutInsightSelectorsCommand,
} from "@aws-sdk/client-cloudtrail";

const putInsightSelectors: AppBlock = {
  name: "Put Insight Selectors",
  description:
    "Lets you enable Insights event logging by specifying the Insights selectors that you want to enable on an existing trail or event data store.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TrailName: {
          name: "Trail Name",
          description:
            "The name of the CloudTrail trail for which you want to change or add Insights selectors.",
          type: "string",
          required: false,
        },
        InsightSelectors: {
          name: "Insight Selectors",
          description:
            "A JSON string that contains the Insights types you want to log on a trail or event data store.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InsightType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
        },
        EventDataStore: {
          name: "Event Data Store",
          description:
            "The ARN (or ID suffix of the ARN) of the source event data store for which you want to change or add Insights selectors.",
          type: "string",
          required: false,
        },
        InsightsDestination: {
          name: "Insights Destination",
          description:
            "The ARN (or ID suffix of the ARN) of the destination event data store that logs Insights events.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new PutInsightSelectorsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Insight Selectors Result",
      description: "Result from PutInsightSelectors operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrailARN: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of a trail for which you want to change or add Insights selectors.",
          },
          InsightSelectors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InsightType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A JSON string that contains the Insights event types that you want to log on a trail or event data store.",
          },
          EventDataStoreArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the source event data store for which you want to change or add Insights selectors.",
          },
          InsightsDestination: {
            type: "string",
            description:
              "The ARN of the destination event data store that logs Insights events.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putInsightSelectors;
