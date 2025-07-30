import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GetInsightSelectorsCommand,
} from "@aws-sdk/client-cloudtrail";

const getInsightSelectors: AppBlock = {
  name: "Get Insight Selectors",
  description:
    "Describes the settings for the Insights event selectors that you configured for your trail or event data store.",
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
          description: "Specifies the name of the trail or trail ARN.",
          type: "string",
          required: false,
        },
        EventDataStore: {
          name: "Event Data Store",
          description:
            "Specifies the ARN (or ID suffix of the ARN) of the event data store for which you want to get Insights selectors.",
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

        const command = new GetInsightSelectorsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Insight Selectors Result",
      description: "Result from GetInsightSelectors operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrailARN: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of a trail for which you want to get Insights selectors.",
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
              "A JSON string that contains the Insight types you want to log on a trail or event data store.",
          },
          EventDataStoreArn: {
            type: "string",
            description:
              "The ARN of the source event data store that enabled Insights events.",
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

export default getInsightSelectors;
