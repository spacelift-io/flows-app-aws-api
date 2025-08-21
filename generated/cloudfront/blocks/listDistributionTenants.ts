import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListDistributionTenantsCommand,
} from "@aws-sdk/client-cloudfront";

const listDistributionTenants: AppBlock = {
  name: "List Distribution Tenants",
  description:
    "Lists the distribution tenants in your Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationFilter: {
          name: "Association Filter",
          description:
            "Filter by the associated distribution ID or connection group ID.",
          type: {
            type: "object",
            properties: {
              DistributionId: {
                type: "string",
              },
              ConnectionGroupId: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        Marker: {
          name: "Marker",
          description: "The marker for the next set of results.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of distribution tenants to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new ListDistributionTenantsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Distribution Tenants Result",
      description: "Result from ListDistributionTenants operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "A token used for pagination of results returned in the response.",
          },
          DistributionTenantList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                DistributionId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                Domains: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Domain: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Domain"],
                    additionalProperties: false,
                  },
                },
                ConnectionGroupId: {
                  type: "string",
                },
                Customizations: {
                  type: "object",
                  properties: {
                    WebAcl: {
                      type: "object",
                      properties: {
                        Action: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Arn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Action"],
                      additionalProperties: false,
                    },
                    Certificate: {
                      type: "object",
                      properties: {
                        Arn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Arn"],
                      additionalProperties: false,
                    },
                    GeoRestrictions: {
                      type: "object",
                      properties: {
                        RestrictionType: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Locations: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["RestrictionType"],
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                CreatedTime: {
                  type: "string",
                },
                LastModifiedTime: {
                  type: "string",
                },
                ETag: {
                  type: "string",
                },
                Enabled: {
                  type: "boolean",
                },
                Status: {
                  type: "string",
                },
              },
              required: [
                "Id",
                "DistributionId",
                "Name",
                "Arn",
                "Domains",
                "CreatedTime",
                "LastModifiedTime",
                "ETag",
              ],
              additionalProperties: false,
            },
            description: "The list of distribution tenants that you retrieved.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listDistributionTenants;
