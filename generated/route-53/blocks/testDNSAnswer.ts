import { AppBlock, events } from "@slflows/sdk/v1";
import { Route53Client, TestDNSAnswerCommand } from "@aws-sdk/client-route-53";

const testDNSAnswer: AppBlock = {
  name: "Test DNS Answer",
  description:
    "Gets the value that Amazon Route 53 returns in response to a DNS request for a specified record name and type.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostedZoneId: {
          name: "Hosted Zone Id",
          description:
            "The ID of the hosted zone that you want Amazon Route 53 to simulate a query for.",
          type: "string",
          required: true,
        },
        RecordName: {
          name: "Record Name",
          description:
            "The name of the resource record set that you want Amazon Route 53 to simulate a query for.",
          type: "string",
          required: true,
        },
        RecordType: {
          name: "Record Type",
          description: "The type of the resource record set.",
          type: "string",
          required: true,
        },
        ResolverIP: {
          name: "Resolver IP",
          description:
            "If you want to simulate a request from a specific DNS resolver, specify the IP address for that resolver.",
          type: "string",
          required: false,
        },
        EDNS0ClientSubnetIP: {
          name: "EDNS0Client Subnet IP",
          description:
            "If the resolver that you specified for resolverip supports EDNS0, specify the IPv4 or IPv6 address of a client in the applicable location, for example, 192.",
          type: "string",
          required: false,
        },
        EDNS0ClientSubnetMask: {
          name: "EDNS0Client Subnet Mask",
          description:
            "If you specify an IP address for edns0clientsubnetip, you can optionally specify the number of bits of the IP address that you want the checking tool to include in the DNS query.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new TestDNSAnswerCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Test DNS Answer Result",
      description: "Result from TestDNSAnswer operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Nameserver: {
            type: "string",
            description:
              "The Amazon Route 53 name server used to respond to the request.",
          },
          RecordName: {
            type: "string",
            description:
              "The name of the resource record set that you submitted a request for.",
          },
          RecordType: {
            type: "string",
            description:
              "The type of the resource record set that you submitted a request for.",
          },
          RecordData: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list that contains values that Amazon Route 53 returned for this resource record set.",
          },
          ResponseCode: {
            type: "string",
            description:
              "A code that indicates whether the request is valid or not.",
          },
          Protocol: {
            type: "string",
            description:
              "The protocol that Amazon Route 53 used to respond to the request, either UDP or TCP.",
          },
        },
        required: [
          "Nameserver",
          "RecordName",
          "RecordType",
          "RecordData",
          "ResponseCode",
          "Protocol",
        ],
      },
    },
  },
};

export default testDNSAnswer;
