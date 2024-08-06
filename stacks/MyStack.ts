import { StackContext, StaticSite } from "sst/constructs";
import { HostedZone } from "aws-cdk-lib/aws-route53";

export function API({ stack }: StackContext) {
  const domainsMapping: { [key: string]: string; } = {
    staging: 'rampmedaddy-staging.trustek.io',
    production: 'rampmedaddy.trustek.io',
  }
  const cryptoComKeys: { [key: string]: string; } = {
    staging: 'pk_test_VyzWBzcYZkKxeFg5H5Srjr7t',
    production: 'pk_live_35juVapmZ6a3bbnGWm69XyYh',
  }
  const onrampKeys: { [key: string]: string; } = {
    staging: 'pk_prod_01J3CZHG87RNJV6K88PJ5G2VJK',
    production: 'pk_prod_01J3CZHG87RNJV6K88PJ5G2VJK',
  }
  const launchDarklyClientSideIds: { [key: string]: string; } = {
    staging: '669e28806de6ba1045fada7f',
    production: '669e28560375de0fe7c1b8ba',
  }
  const redirectUrls: { [key: string]: string; } = {
    staging: 'https://rampmedaddy-staging.trustek.io',
    production: 'https://rampmedaddy.trustek.io',
  }
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "build",
    environment: {
      REACT_APP_CRYPTO_COM_TOKEN: cryptoComKeys[stack.stage],
      REACT_APP_REDIRECT_URL: redirectUrls[stack.stage],
      REACT_APP_ONRAMP_TOKEN: onrampKeys[stack.stage],
      REACT_APP_LAUNCHDARKLY_KEY: launchDarklyClientSideIds[stack.stage]
    },
    customDomain: {
      domainName: domainsMapping[stack.stage],
      cdk: {
        hostedZone: HostedZone.fromHostedZoneAttributes(stack, "trustek.io", {
          hostedZoneId: "Z040084860QTZ28QH7C8",
          zoneName: "trustek.io",
        }),
      },
    }
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
  });
}
