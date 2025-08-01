import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetSampledRequestsCommand } from "@aws-sdk/client-waf";

const getSampledRequests: AppBlock = {
  name: "Get Sampled Requests",
  description: "This is AWS WAF Classic documentation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        WebAclId: {
          name: "Web Acl Id",
          description:
            "The WebACLId of the WebACL for which you want GetSampledRequests to return a sample of requests.",
          type: "string",
          required: true,
        },
        RuleId: {
          name: "Rule Id",
          description:
            "RuleId is one of three values: The RuleId of the Rule or the RuleGroupId of the RuleGroup for which you want GetSampledRequests to return a sample of requests.",
          type: "string",
          required: true,
        },
        TimeWindow: {
          name: "Time Window",
          description:
            "The start date and time and the end date and time of the range for which you want GetSampledRequests to return a sample of requests.",
          type: {
            type: "object",
            properties: {
              StartTime: {
                type: "string",
              },
              EndTime: {
                type: "string",
              },
            },
            required: ["StartTime", "EndTime"],
            additionalProperties: false,
          },
          required: true,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The number of requests that you want AWS WAF to return from among the first 5,000 requests that your AWS resource received during the time range.",
          type: "number",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetSampledRequestsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Sampled Requests Result",
      description: "Result from GetSampledRequests operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SampledRequests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Request: {
                  type: "object",
                  properties: {
                    ClientIP: {
                      type: "string",
                    },
                    Country: {
                      type: "string",
                    },
                    URI: {
                      type: "string",
                    },
                    Method: {
                      type: "string",
                    },
                    HTTPVersion: {
                      type: "string",
                    },
                    Headers: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                Weight: {
                  type: "number",
                },
                Timestamp: {
                  type: "string",
                },
                Action: {
                  type: "string",
                },
                RuleWithinRuleGroup: {
                  type: "string",
                },
              },
              required: ["Request", "Weight"],
              additionalProperties: false,
            },
            description:
              "A complex type that contains detailed information about each of the requests in the sample.",
          },
          PopulationSize: {
            type: "number",
            description:
              "The total number of requests from which GetSampledRequests got a sample of MaxItems requests.",
          },
          TimeWindow: {
            type: "object",
            properties: {
              StartTime: {
                type: "string",
              },
              EndTime: {
                type: "string",
              },
            },
            required: ["StartTime", "EndTime"],
            additionalProperties: false,
            description:
              "Usually, TimeWindow is the time range that you specified in the GetSampledRequests request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSampledRequests;
