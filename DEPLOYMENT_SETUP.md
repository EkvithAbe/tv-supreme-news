# TV SUPREME: contact email and scheduled publishing

## Contact Us email

The contact form sends directly to Gmail and does not store submissions in MySQL.

1. Turn on two-step verification for `tvsupremedigital@gmail.com`.
2. In that Google account, create an **App Password** for this website.
3. Set these production environment variables. Never commit the App Password.

```env
GMAIL_USER="tvsupremedigital@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-google-app-password"
CONTACT_RECIPIENT_EMAIL="tvsupremedigital@gmail.com"
```

Restart the application after changing environment variables. The form replies to the visitor's submitted email address when you reply from Gmail.

## Scheduled publishing

The application has a protected endpoint that publishes articles and videos with a `SCHEDULED` status once their scheduled time has passed.

Set a long random `CRON_SECRET` in the production environment. The local development `.env` already has a different private value for local testing.

```env
CRON_SECRET="a-long-random-secret"
```

Configure your host's cron/scheduled-task panel to run this command **once every minute**. Replace the domain and secret placeholders with the production values.

```bash
* * * * * curl -fsS -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.example/api/cron/publish-scheduled > /dev/null
```

The endpoint returns `401` without the secret, and it conditionally updates each due item to prevent duplicate publishing if two cron calls overlap.

For a manual server-side verification after deployment:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.example/api/cron/publish-scheduled
```
