import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  DescribeImageScanFindingsCommand,
} from "@aws-sdk/client-ecr";

const describeImageScanFindings: AppBlock = {
  name: "Describe Image Scan Findings",
  description: "Returns the scan findings for the specified image.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        registryId: {
          name: "registry Id",
          description:
            "The Amazon Web Services account ID associated with the registry that contains the repository in which to describe the image scan findings for.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The repository for the image for which to describe the scan findings.",
          type: "string",
          required: true,
        },
        imageId: {
          name: "image Id",
          description:
            "An object with identifying information for an image in an Amazon ECR repository.",
          type: {
            type: "object",
            properties: {
              imageDigest: {
                type: "string",
              },
              imageTag: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated DescribeImageScanFindings request where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of image scan results returned by DescribeImageScanFindings in paginated output.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECRClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeImageScanFindingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Image Scan Findings Result",
      description: "Result from DescribeImageScanFindings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          repositoryName: {
            type: "string",
            description: "The repository name associated with the request.",
          },
          imageId: {
            type: "object",
            properties: {
              imageDigest: {
                type: "string",
              },
              imageTag: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "An object with identifying information for an image in an Amazon ECR repository.",
          },
          imageScanStatus: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              description: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The current state of the scan.",
          },
          imageScanFindings: {
            type: "object",
            properties: {
              imageScanCompletedAt: {
                type: "string",
              },
              vulnerabilitySourceUpdatedAt: {
                type: "string",
              },
              findingSeverityCounts: {
                type: "object",
                additionalProperties: {
                  type: "number",
                },
              },
              findings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                    uri: {
                      type: "string",
                    },
                    severity: {
                      type: "string",
                    },
                    attributes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              enhancedFindings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    awsAccountId: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                    findingArn: {
                      type: "string",
                    },
                    firstObservedAt: {
                      type: "string",
                    },
                    lastObservedAt: {
                      type: "string",
                    },
                    packageVulnerabilityDetails: {
                      type: "object",
                      properties: {
                        cvss: {
                          type: "object",
                          additionalProperties: true,
                        },
                        referenceUrls: {
                          type: "object",
                          additionalProperties: true,
                        },
                        relatedVulnerabilities: {
                          type: "object",
                          additionalProperties: true,
                        },
                        source: {
                          type: "object",
                          additionalProperties: true,
                        },
                        sourceUrl: {
                          type: "object",
                          additionalProperties: true,
                        },
                        vendorCreatedAt: {
                          type: "object",
                          additionalProperties: true,
                        },
                        vendorSeverity: {
                          type: "object",
                          additionalProperties: true,
                        },
                        vendorUpdatedAt: {
                          type: "object",
                          additionalProperties: true,
                        },
                        vulnerabilityId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        vulnerablePackages: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    remediation: {
                      type: "object",
                      properties: {
                        recommendation: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    resources: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    score: {
                      type: "number",
                    },
                    scoreDetails: {
                      type: "object",
                      properties: {
                        cvss: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    severity: {
                      type: "string",
                    },
                    status: {
                      type: "string",
                    },
                    title: {
                      type: "string",
                    },
                    type: {
                      type: "string",
                    },
                    updatedAt: {
                      type: "string",
                    },
                    fixAvailable: {
                      type: "string",
                    },
                    exploitAvailable: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "The information contained in the image scan findings.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future DescribeImageScanFindings request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeImageScanFindings;
