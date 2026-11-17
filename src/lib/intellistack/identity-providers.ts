import type { EnvironmentId } from "./environments";

export type FeaturedProviderId = "google" | "microsoft365" | "entra" | "aws" | "github" | "apple";

/** Lovable Cloud provider used for sign-in, or null when the integration isn't set up yet. */
export type CloudProvider = "google" | "microsoft" | "apple" | null;

export type FeaturedProvider = {
  id: FeaturedProviderId;
  name: string;
  cloudProvider: CloudProvider;
  environments: EnvironmentId[];
};

export const FEATURED_PROVIDERS: FeaturedProvider[] = [
  { id: "google", name: "Google Workspace", cloudProvider: "google", environments: ["blue", "purple", "green"] },
  { id: "microsoft365", name: "Microsoft 365", cloudProvider: "microsoft", environments: ["blue", "purple", "green"] },
  { id: "entra", name: "Microsoft Entra ID", cloudProvider: "microsoft", environments: ["blue", "purple", "green"] },
  { id: "aws", name: "AWS", cloudProvider: null, environments: ["blue", "green"] },
  { id: "github", name: "GitHub", cloudProvider: null, environments: ["blue", "purple"] },
  { id: "apple", name: "Apple", cloudProvider: "apple", environments: ["blue", "purple", "green"] },
];

export type DirectoryProvider = {
  id: string;
  name: string;
  category: string;
  domain: string;
  description: string;
  popular?: boolean;
};

type Row = [name: string, category: string, domain: string, description: string];

const POPULAR: Row[] = [
  ["Okta", "Enterprise SSO", "okta.com", "Workforce identity and single sign-on"],
  ["Auth0", "Developer identity", "auth0.com", "Customer identity platform by Okta"],
  ["Ping Identity", "Enterprise SSO", "pingidentity.com", "Enterprise identity and access management"],
  ["OneLogin", "Enterprise SSO", "onelogin.com", "Unified access management"],
  ["JumpCloud", "Directory", "jumpcloud.com", "Open directory platform"],
  ["Duo Security", "MFA", "duo.com", "Multi-factor authentication by Cisco"],
  ["Salesforce", "Business apps", "salesforce.com", "Salesforce Identity"],
  ["Slack", "Collaboration", "slack.com", "Sign in with Slack"],
  ["LinkedIn", "Social", "linkedin.com", "Sign in with LinkedIn"],
  ["Facebook", "Social", "facebook.com", "Facebook Login"],
  ["X (Twitter)", "Social", "x.com", "Sign in with X"],
  ["Amazon", "Consumer", "amazon.com", "Login with Amazon"],
  ["Zoom", "Collaboration", "zoom.us", "Sign in with Zoom"],
  ["Atlassian", "Developer tools", "atlassian.com", "Atlassian account"],
  ["GitLab", "Developer tools", "gitlab.com", "GitLab OAuth"],
  ["Keycloak", "Open source", "keycloak.org", "Open source identity and access management"],
  ["IBM Security Verify", "Enterprise SSO", "ibm.com", "IBM cloud identity"],
  ["CyberArk Identity", "Enterprise SSO", "cyberark.com", "Identity security platform"],
  ["Oracle Identity Cloud", "Enterprise SSO", "oracle.com", "Oracle cloud identity"],
  ["SAP Cloud Identity", "Enterprise SSO", "sap.com", "SAP identity authentication service"],
];

const MORE: Row[] = [
  ["ForgeRock", "Enterprise SSO", "forgerock.com", "Digital identity platform"],
  ["SailPoint", "Identity governance", "sailpoint.com", "Identity security and governance"],
  ["Saviynt", "Identity governance", "saviynt.com", "Cloud identity governance"],
  ["Microsoft Active Directory (ADFS)", "Directory", "microsoft.com", "Federation services for Active Directory"],
  ["Google Cloud Identity", "Directory", "cloud.google.com", "Identity for Google Cloud"],
  ["AWS IAM Identity Center", "Cloud identity", "aws.amazon.com", "Workforce access to AWS accounts"],
  ["Amazon Cognito", "Cloud identity", "aws.amazon.com", "Customer identity on AWS"],
  ["Azure AD B2C", "Cloud identity", "azure.microsoft.com", "Customer identity on Azure"],
  ["Firebase Authentication", "Developer identity", "firebase.google.com", "Authentication for apps"],
  ["Supabase Auth", "Developer identity", "supabase.com", "Open source auth"],
  ["Clerk", "Developer identity", "clerk.com", "User management for apps"],
  ["Stytch", "Developer identity", "stytch.com", "Passwordless authentication"],
  ["Descope", "Developer identity", "descope.com", "No-code authentication flows"],
  ["FusionAuth", "Developer identity", "fusionauth.io", "Customer identity and access"],
  ["WorkOS", "Developer identity", "workos.com", "Enterprise-ready SSO for apps"],
  ["Frontegg", "Developer identity", "frontegg.com", "User management platform"],
  ["Magic", "Passwordless", "magic.link", "Passwordless wallet and login"],
  ["Passage by 1Password", "Passwordless", "1password.com", "Passkey authentication"],
  ["Hanko", "Passwordless", "hanko.io", "Passkey-first authentication"],
  ["Ory", "Open source", "ory.sh", "Open source identity infrastructure"],
  ["Authentik", "Open source", "goauthentik.io", "Open source identity provider"],
  ["Authelia", "Open source", "authelia.com", "Open source SSO and MFA"],
  ["Gluu", "Open source", "gluu.org", "Open source identity platform"],
  ["Zitadel", "Open source", "zitadel.com", "Cloud-native identity"],
  ["Casdoor", "Open source", "casdoor.org", "UI-first identity platform"],
  ["LemonLDAP::NG", "Open source", "lemonldap-ng.org", "Web SSO"],
  ["Shibboleth", "Education", "shibboleth.net", "Federated identity for research and education"],
  ["InCommon", "Education", "incommon.org", "Trusted access for higher education"],
  ["eduGAIN", "Education", "edugain.org", "Interfederation for research and education"],
  ["Clever", "Education", "clever.com", "K-12 single sign-on"],
  ["ClassLink", "Education", "classlink.com", "Education SSO"],
  ["Login.gov", "Government", "login.gov", "US government sign-in"],
  ["ID.me", "Government", "id.me", "Digital identity verification"],
  ["GOV.UK One Login", "Government", "gov.uk", "UK government sign-in"],
  ["BankID", "Government", "bankid.com", "Nordic electronic identification"],
  ["itsme", "Government", "itsme-id.com", "Belgian digital identity"],
  ["Verimi", "Government", "verimi.de", "German identity wallet"],
  ["Yoti", "Identity verification", "yoti.com", "Digital ID and verification"],
  ["Onfido", "Identity verification", "onfido.com", "Document and biometric verification"],
  ["Jumio", "Identity verification", "jumio.com", "Identity verification and KYC"],
  ["Persona", "Identity verification", "withpersona.com", "Identity verification platform"],
  ["Veriff", "Identity verification", "veriff.com", "Identity verification"],
  ["Socure", "Identity verification", "socure.com", "Digital identity verification"],
  ["Microsoft Authenticator", "MFA", "microsoft.com", "Authenticator app"],
  ["Google Authenticator", "MFA", "google.com", "TOTP authenticator"],
  ["RSA SecurID", "MFA", "rsa.com", "Hardware and software tokens"],
  ["Yubico", "MFA", "yubico.com", "YubiKey hardware security keys"],
  ["Thales SafeNet", "MFA", "thalesgroup.com", "Trusted access and MFA"],
  ["Entrust", "MFA", "entrust.com", "Identity and digital security"],
  ["Silverfort", "MFA", "silverfort.com", "Unified identity protection"],
  ["Secret Double Octopus", "Passwordless", "doubleoctopus.com", "Passwordless enterprise authentication"],
  ["HYPR", "Passwordless", "hypr.com", "Passwordless MFA"],
  ["Beyond Identity", "Passwordless", "beyondidentity.com", "Phishing-resistant authentication"],
  ["Trusona", "Passwordless", "trusona.com", "Passwordless authentication"],
  ["Transmit Security", "Passwordless", "transmitsecurity.com", "Customer identity and fraud prevention"],
  ["LastPass", "Password managers", "lastpass.com", "LastPass SSO"],
  ["1Password", "Password managers", "1password.com", "1Password unlock with SSO"],
  ["Bitwarden", "Password managers", "bitwarden.com", "Bitwarden SSO"],
  ["Dashlane", "Password managers", "dashlane.com", "Dashlane SSO"],
  ["Keeper", "Password managers", "keepersecurity.com", "Keeper SSO Connect"],
  ["Zscaler", "Zero trust", "zscaler.com", "Zero trust exchange"],
  ["Cloudflare Access", "Zero trust", "cloudflare.com", "Zero trust application access"],
  ["Palo Alto Prisma Access", "Zero trust", "paloaltonetworks.com", "Secure access service edge"],
  ["Netskope", "Zero trust", "netskope.com", "Security service edge"],
  ["Twingate", "Zero trust", "twingate.com", "Zero trust network access"],
  ["Tailscale", "Zero trust", "tailscale.com", "Identity-based networking"],
  ["Teleport", "Zero trust", "goteleport.com", "Infrastructure access platform"],
  ["BeyondTrust", "Privileged access", "beyondtrust.com", "Privileged access management"],
  ["Delinea", "Privileged access", "delinea.com", "Privileged access management"],
  ["HashiCorp Vault", "Privileged access", "hashicorp.com", "Secrets and identity-based access"],
  ["Workday", "Business apps", "workday.com", "HR and finance identity"],
  ["ServiceNow", "Business apps", "servicenow.com", "ServiceNow SSO"],
  ["SAP SuccessFactors", "Business apps", "successfactors.com", "HR identity"],
  ["ADP", "Business apps", "adp.com", "ADP identity"],
  ["BambooHR", "Business apps", "bamboohr.com", "HR platform SSO"],
  ["Rippling", "Business apps", "rippling.com", "Identity and device management"],
  ["Gusto", "Business apps", "gusto.com", "Payroll and HR login"],
  ["HubSpot", "Business apps", "hubspot.com", "HubSpot account"],
  ["Zoho", "Business apps", "zoho.com", "Zoho Directory"],
  ["Dropbox", "Collaboration", "dropbox.com", "Sign in with Dropbox"],
  ["Box", "Collaboration", "box.com", "Box SSO"],
  ["Notion", "Collaboration", "notion.so", "Notion login"],
  ["Asana", "Collaboration", "asana.com", "Asana SSO"],
  ["Webex", "Collaboration", "webex.com", "Cisco Webex identity"],
  ["Discord", "Social", "discord.com", "Sign in with Discord"],
  ["Instagram", "Social", "instagram.com", "Instagram login"],
  ["TikTok", "Social", "tiktok.com", "Login Kit"],
  ["Snapchat", "Social", "snapchat.com", "Login Kit"],
  ["Reddit", "Social", "reddit.com", "Reddit OAuth"],
  ["Twitch", "Social", "twitch.tv", "Twitch login"],
  ["Spotify", "Consumer", "spotify.com", "Spotify login"],
  ["Yahoo", "Consumer", "yahoo.com", "Yahoo login"],
  ["PayPal", "Consumer", "paypal.com", "Log in with PayPal"],
  ["Shopify", "Consumer", "shopify.com", "Shop login"],
  ["WeChat", "Social", "wechat.com", "WeChat login"],
  ["LINE", "Social", "line.me", "LINE login"],
  ["Kakao", "Social", "kakaocorp.com", "Kakao login"],
  ["Naver", "Social", "naver.com", "Naver login"],
  ["VK ID", "Social", "vk.com", "VK ID"],
  ["Yandex ID", "Consumer", "yandex.com", "Yandex ID"],
  ["Bitbucket", "Developer tools", "bitbucket.org", "Bitbucket OAuth"],
  ["DigitalOcean", "Cloud identity", "digitalocean.com", "DigitalOcean OAuth"],
  ["Heroku", "Cloud identity", "heroku.com", "Heroku OAuth"],
  ["Alibaba Cloud RAM", "Cloud identity", "alibabacloud.com", "Resource access management"],
  ["IBM Cloud IAM", "Cloud identity", "cloud.ibm.com", "IBM Cloud identity and access"],
  ["Citrix", "Zero trust", "citrix.com", "Citrix Workspace identity"],
  ["Imprivata", "Healthcare", "imprivata.com", "Healthcare identity and access"],
  ["Epic", "Healthcare", "epic.com", "Epic MyChart identity"],
  ["SecureAuth", "Enterprise SSO", "secureauth.com", "Adaptive authentication"],
  ["Idaptive", "Enterprise SSO", "cyberark.com", "Next-gen access"],
  ["miniOrange", "Enterprise SSO", "miniorange.com", "SSO and MFA"],
  ["Generic SAML 2.0", "Standards", "oasis-open.org", "Any SAML 2.0 identity provider"],
  ["Generic OpenID Connect", "Standards", "openid.net", "Any OpenID Connect provider"],
  ["LDAP", "Standards", "ldap.com", "Directory sign-in over LDAP"],
];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const DIRECTORY_PROVIDERS: DirectoryProvider[] = [
  ...POPULAR.map(([name, category, domain, description]) => ({
    id: slug(name),
    name,
    category,
    domain,
    description,
    popular: true,
  })),
  ...MORE.map(([name, category, domain, description]) => ({ id: slug(name), name, category, domain, description })),
];

export const POPULAR_COUNT = POPULAR.length;

/** Search by name, category or description. Popular providers always rank first. */
export function searchProviders(query: string, list: DirectoryProvider[] = DIRECTORY_PROVIDERS) {
  const q = query.trim().toLowerCase();
  const matches = q
    ? list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    : list;
  return [...matches.filter((p) => p.popular), ...matches.filter((p) => !p.popular)];
}

/** Remaining (non-popular) providers grouped by category, alphabetically. */
export function groupByCategory(list: DirectoryProvider[]) {
  const groups = new Map<string, DirectoryProvider[]>();
  for (const p of list) {
    const arr = groups.get(p.category) ?? [];
    arr.push(p);
    groups.set(p.category, arr);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => ({ category, items: items.sort((a, b) => a.name.localeCompare(b.name)) }));
}

export function providerLogoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}
