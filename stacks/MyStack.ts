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
  const botUrl: { [key: string]: string; } = {
    production: 'https://t.me/RampMeDaddyBot',
    staging: 'https://t.me/DevRampMeDaddyBot',
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
      NEXT_PUBLIC_CRYPTO_COM_TOKEN: cryptoComKeys[stack.stage],
      NEXT_PUBLIC_REDIRECT_URL: redirectUrls[stack.stage],
      NEXT_PUBLIC_ONRAMP_TOKEN: onrampKeys[stack.stage],
      NEXT_PUBLIC_LAUNCHDARKLY_KEY: launchDarklyClientSideIds[stack.stage],
      DATABASE_URL: "postgresql://postgres:12nsFNqi2VYFOdLz@localhost:5432/strooper-wallet",
      DB_PASSWORD: "password",
      TELEGRAM_BOT_URL: botUrl[stack.stage],
      LAUNCHTUBE_URL: "https://testnet.launchtube.xyz",
      LAUNCHETUBE_JWT: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOTU0NTQxMDgwM2U3MjgzMmUwODllOTVlMjU1MDQ0M2I0NmY2MjNmMjRmMjY1YjA0NTk4MzdjNmMzYTA4NjcxIiwiZXhwIjoxNzM3NTI4ODQwLCJjcmVkaXRzIjoxMDAwMDAwMDAwLCJpYXQiOjE3MzAyNzEyNDB9.UOSqHLEHMeYsVWIRcp17u7ZKBXReG0zo0K5l9Wgz9Qc",
      MERCURYT_URL: "https://api.mercurydata.app/graphql",
      MERCURY_JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZ29vZ2xlb2F1dGgyMTE0NTQ2MTQ3MDA1MDg4NTc4NDQ0IiwiZXhwIjoxNzMyODYzMzI3LCJ1c2VyX2lkIjoxMjUsInVzZXJuYW1lIjoic2xhdmFAdHJ1c3Rlay5pbyIsImlhdCI6MTczMDI3MTMyNywiYXVkIjoicG9zdGdyYXBoaWxlIiwiaXNzIjoicG9zdGdyYXBoaWxlIn0.mQKWriKgTA8M5rivZuZFPmI9--MMqeTg-fPeJ2jbF1k",
      FUNDER_SECRET_KEY: "ssss",
      FUNDER_PUBLIC_KEY: "sssss",
      NATIVE_CONTRACT_ID: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
      RPC_URL: "https://soroban-testnet.stellar.org",
      NEXT_PUBLIC_FACTORY_CONTRACT_ID: "CCD7M4VVKELWL2RO4XJOZOGBDF3ESFIKG2EAU4ETVNAKMRRKE6YIQU5E",
      NEXT_PUBLIC_NATIVE_CONTRACT_ID: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
      NEXT_PUBLIC_RPC_URL: "https://soroban-testnet.stellar.org",
      NEXT_PUBLIC_APP_URL: redirectUrls[stack.stage],
      NEXT_PUBLIC_TELEGRAM_BOT_URL: botUrl[stack.stage],
      NEXT_PUBLIC_NETWORK_PASSPHRASE: "Test SDF Network ; September 2015"
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
