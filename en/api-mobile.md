# API and mobile app

Community and Enterprise expose the same core API and use the same Sessage mobile client. Clients can query server capabilities and display only the modules available in the connected installation.

## REST API

The API supports integrations around lists, tasks and related work data. Use a dedicated account and grant only the permissions required by the integration.

Personal access tokens provide API access without an interactive browser sign-in. Treat tokens like passwords:

- create a separate token for each integration;
- store it only in a secret store or protected environment variable;
- never place it in source code, screenshots or logs;
- revoke and replace it when an integration is retired or compromised.

## Mobile app

The mobile app connects to your own Sessage server. Enter the installation URL and sign in with the account configured by your organization.

The same app supports both editions. Core task work is available with Community; Enterprise-specific entry points appear when the server reports the corresponding licensed capability. Custom fields are part of Enterprise Forms and require `enterprise.forms` on both the web and mobile API.

Enterprise can also provide native push notifications on Android, iOS and Windows through `enterprise.push-notifications`. Users opt in per device and choose either an anonymous lock-screen message or the actual notification title and text. Opening the notification switches to the associated local server profile and task. Device and user identifiers are pseudonymized by the customer installation before reaching the central Sessage Push Relay; anonymous mode does not transmit task title or notification text.

Offline changes are stored in a durable, account- and server-partitioned outbox. Attachment files remain in local app storage until the server confirms an idempotent upload, so reconnects and app restarts do not lose them or create duplicates.

Every server profile has a persistent internal identifier. Authentication, user preferences, cache data and pending changes are partitioned by that identifier and the normalized server origin. Renaming a profile therefore does not merge it with another profile, while changing its server, account or authentication mode intentionally clears the old authentication and local partition.

Bearer tokens are stored only in the operating system's secure storage. If secure storage is unavailable, the token remains in memory for the current session and is never written to SQLite as plaintext. Deleting a profile removes its protected token, cached entities, attachment outbox and pending changes before removing the profile metadata.

Lists and tasks carry a server content version and synchronization token. If another device changes the same entity after it was cached, an offline update receives `409 Conflict` instead of silently overwriting the newer server state. The pending-changes screen lets the user either accept the server version or explicitly force the local version. Temporary transport failures remain retryable; conflicts are never turned into automatic overwrites.

New offline entities and attachments use stable identifiers, making retries after reconnects idempotent instead of creating duplicates.

Invitation QR codes for both lists and Enterprise portfolios can be scanned and accepted directly in the app. The server validates the signed-in user and invitation token before granting access.

## Integration planning

Before building an integration, define:

1. which list and task data it needs;
2. whether it reads, creates or modifies records;
3. which account and permissions it uses;
4. how errors and retries are handled;
5. how tokens are rotated and revoked;
6. whether an Enterprise webhook or automation can avoid polling.

For endpoint-level and administration details, switch to German using the language menu and open **API und mobile App**.
