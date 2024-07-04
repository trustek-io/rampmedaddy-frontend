import { StackContext, StaticSite } from "sst/constructs";
import { HostedZone } from "aws-cdk-lib/aws-route53";

export function API({ stack }: StackContext) {
  const domainsMapping: {[key: string]: string;} = {
    staging: 'rampmedaddy-staging.trustek.io',
    production: 'rampmedaddy.trustek.io',
  }
  const cryptoComKeys: {[key: string]: string;} = {
    staging: 'pk_test_VyzWBzcYZkKxeFg5H5Srjr7t',
    production: 'pk_live_35juVapmZ6a3bbnGWm69XyYh',
  }
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "build",
    environment: {
      REACT_APP_CRYPTO_COM_TOKEN: cryptoComKeys[stack.stage]
    },
    customDomain: {
      domainName: domainsMapping[stack.stage],
      cdk: {
        hostedZone: HostedZone.fromHostedZoneAttributes(stack, "trustek.io", {
          hostedZoneId: "Z040084860QTZ28QH7C8",
          zoneName: "trustek.io",
        }),
      },
  }});

// Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
  });
}
