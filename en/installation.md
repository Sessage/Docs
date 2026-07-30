# Choose an installation

Sessage is self-hosted. Select the package that matches the edition and operating model you need.

## Common requirements

- a supported host with Docker and Docker Compose;
- PostgreSQL, either managed externally or operated as a container;
- a stable URL behind an HTTPS reverse proxy;
- persistent storage and a tested backup process;
- SMTP for invitations, account messages and email notifications;
- optional AD/LDAP connectivity for directory sign-in;
- optional IMAP connectivity for Enterprise email intake.

## Community Edition

Use the public Community server package when you need the open-source task and collaboration foundation. Community runs independently and does not require an Enterprise license.

The detailed Docker Compose procedure, configuration keys and update steps are available in the German **Community mit Docker installieren** chapter.

## Enterprise Edition

Use the Enterprise delivery package when you need portfolios, dashboards, forms, email intake, automations or directory sharing. Enterprise requires a valid license tied to the installation.

The detailed procedure covers the container package, PostgreSQL variants, installation ID, offline license file, reverse proxy, backups and updates. Switch to German and open **Enterprise mit Docker installieren** for the operational steps.

## Production checklist

Before making the service available to users, verify:

1. HTTPS is enforced and the public base URL is correct.
2. Database and attachment storage are persistent.
3. Database and files are included in backups.
4. SMTP delivery works.
5. Authentication and optional AD/LDAP sign-in work as intended.
6. Restore and update procedures have been tested.
7. Enterprise installations report a valid license and the expected capabilities.

## After installation

Continue with the [first steps](./getting-started.md) and review [API and mobile app](./api-mobile.md) when integrations or mobile access are required.
