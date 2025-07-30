import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBMajorEngineVersionsCommand,
} from "@aws-sdk/client-rds";

const describeDBMajorEngineVersions: AppBlock = {
  name: "Describe DB Major Engine Versions",
  description:
    "Describes the properties of specific major versions of DB engines.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Engine: {
          name: "Engine",
          description:
            "The database engine to return major version details for.",
          type: "string",
          required: false,
        },
        MajorEngineVersion: {
          name: "Major Engine Version",
          description:
            "A specific database major engine version to return details for.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous request.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeDBMajorEngineVersionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Major Engine Versions Result",
      description: "Result from DescribeDBMajorEngineVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBMajorEngineVersions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Engine: {
                  type: "string",
                },
                MajorEngineVersion: {
                  type: "string",
                },
                SupportedEngineLifecycles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      LifecycleSupportName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      LifecycleSupportStartDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      LifecycleSupportEndDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: [
                      "LifecycleSupportName",
                      "LifecycleSupportStartDate",
                      "LifecycleSupportEndDate",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of DBMajorEngineVersion elements.",
          },
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBMajorEngineVersions;
