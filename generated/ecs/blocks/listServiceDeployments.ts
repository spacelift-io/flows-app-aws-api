import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, ListServiceDeploymentsCommand } from "@aws-sdk/client-ecs";

const listServiceDeployments: AppBlock = {
  name: "List Service Deployments",
  description:
    "This operation lists all the service deployments that meet the specified filter criteria.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        service: {
          name: "service",
          description: "The ARN or name of the service",
          type: "string",
          required: true,
        },
        cluster: {
          name: "cluster",
          description: "The cluster that hosts the service.",
          type: "string",
          required: false,
        },
        status: {
          name: "status",
          description: "An optional filter you can use to narrow the results.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        createdAt: {
          name: "created At",
          description:
            "An optional filter you can use to narrow the results by the service creation date.",
          type: {
            type: "object",
            properties: {
              before: {
                type: "string",
              },
              after: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a ListServiceDeployments request indicating that more results are available to fulfill the request and further calls are needed.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of service deployment results that ListServiceDeployments returned in paginated output.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListServiceDeploymentsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Service Deployments Result",
      description: "Result from ListServiceDeployments operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          serviceDeployments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                serviceDeploymentArn: {
                  type: "string",
                },
                serviceArn: {
                  type: "string",
                },
                clusterArn: {
                  type: "string",
                },
                startedAt: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                },
                finishedAt: {
                  type: "string",
                },
                targetServiceRevisionArn: {
                  type: "string",
                },
                status: {
                  type: "string",
                },
                statusReason: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An overview of the service deployment, including the following properties: The ARN of the service deployment.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListServiceDeployments request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listServiceDeployments;
