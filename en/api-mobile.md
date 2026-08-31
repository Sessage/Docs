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

A successful mobile password change immediately returns a replacement JWT and stores it in the protected profile scope. This prevents the security-stamp change from invalidating the app session directly after the password was changed.

Personal access token errors are returned as structured API responses, allowing the app to distinguish an empty token list from authentication, network, or server failures. Deleting an account also removes its personal access tokens and stored profile-picture file after Identity has successfully deleted the user.

Dashboard and portfolio endpoints require an online connection. The client distinguishes an actually empty result from authentication, authorization, and server failures. Portfolio dashboards derive their list selection from the server-side portfolio membership; only portfolio owners and administrators may change the saved presentation.

Mobile administration likewise distinguishes empty user and audit lists from network, authentication, and server failures. The server prevents administrators from deleting their own account or removing their own administrator role, and reports a role change as successful only after Identity has persisted it.

The preferred list view and the independent list and Kanban sort modes are synchronized through `GET` and `PUT /api/mobile/lists/{listId}/view-preference`. The app also stores the preference in profile-partitioned SQLite and queues offline changes in the durable synchronization outbox.

The mobile recycle bin loads deleted lists from `GET /api/mobile/trash/lists` and restorable tasks from active lists from `GET /api/mobile/trash/tasks`. Lists and tasks are restored through `POST /api/mobile/trash/lists/{listId}/restore` and `POST /api/mobile/trash/lists/{listId}/tasks/{taskId}/restore`. These operations require an online connection and the corresponding server-side administrator or write permission.

Enterprise can also provide native push notifications on Android, iOS and Windows through `enterprise.push-notifications`. Users opt in per device and choose either an anonymous lock-screen message or the actual notification title and text. Opening the notification switches to the associated local server profile and task. Device and user identifiers are pseudonymized by the customer installation before reaching the central Sessage Push Relay; anonymous mode does not transmit task title or notification text.

The mobile notification center uses `GET /api/mobile/notifications` and `GET /api/mobile/notifications/unread-count`. `POST /api/mobile/notifications/{notificationId}/mark-read` marks only the opened item as read, while `POST /api/mobile/notifications/mark-read` marks all items as read. Individual or all items can be removed with `DELETE /api/mobile/notifications/{notificationId}` or `DELETE /api/mobile/notifications`. Every operation is scoped to the authenticated user.

Offline changes are stored in a durable, account- and server-partitioned outbox. Attachment files remain in local app storage until the server confirms an idempotent upload, so reconnects and app restarts do not lose them or create duplicates.

Every server profile has a persistent internal identifier. Authentication, user preferences, cache data and pending changes are partitioned by that identifier and the normalized server origin. Renaming a profile therefore does not merge it with another profile, while changing its server, account or authentication mode intentionally clears the old authentication and local partition.

Bearer tokens are stored only in the operating system's secure storage. If secure storage is unavailable, the token remains in memory for the current session and is never written to SQLite as plaintext. Deleting a profile removes its protected token, cached entities, attachment outbox and pending changes before removing the profile metadata.

Lists and tasks carry a server content version and synchronization token. If another device changes the same entity after it was cached, an offline update receives `409 Conflict` instead of silently overwriting the newer server state. The pending-changes screen lets the user either accept the server version or explicitly force the local version. Temporary transport failures remain retryable; conflicts are never turned into automatic overwrites.

New offline entities and attachments use stable identifiers, making retries after reconnects idempotent instead of creating duplicates.

If the search endpoint is unavailable, the app searches the cached lists, task descriptions and steps belonging to the active profile. Offline results are identified as cached data in the UI, so a transport failure is not presented as an empty online result.

Regular lists can be created and edited offline. Creating a list from a template requires an active
server connection because templates are deliberately excluded from the normal workspace cache. The
app reports this condition instead of silently creating an empty replacement list.

Lists and groups created offline retain stable identifiers and their local navigation position. Only
temporary transport and server failures remain in the outbox for a later retry. Permanent responses,
including invalid input, missing permissions, and conflicts, are surfaced immediately instead of
being cached as apparently successful offline creations.

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
