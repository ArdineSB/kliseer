# Caddy cutover

The deploy now serves the Astro landing page at `/` through Caddy and proxies `/app` to Next. Do not run a production deployment until Caddy's persistent config path is switched as below. No production server was changed for this routing work.

## Local checks

From the repository root, build both applications and confirm the static landing output exists:

```sh
npm run build
test -s landing/dist/index.html
caddy validate --config deploy/Caddyfile --adapter caddyfile
```

## One-time production preparation

The first CI deployment that includes this change builds and uploads its release, then deliberately stops before activation if the persistent Caddy symlink or backup is missing. Use that run's commit SHA as `<SHA>` below. Run these commands on the production server as an administrator; they preserve the existing Caddyfile before replacing its path and do not reload Caddy yet:

```sh
set -eu
sudo test -f /etc/caddy/Caddyfile
sudo test ! -e /etc/caddy/Caddyfile.pre-kliseer
sudo cp -a /etc/caddy/Caddyfile /etc/caddy/Caddyfile.pre-kliseer
sudo caddy validate --config "/opt/kliseer/releases/<SHA>/deploy/Caddyfile" --adapter caddyfile
sudo install -d /opt/kliseer/current/deploy
sudo test ! -e /opt/kliseer/current/deploy/Caddyfile
sudo cp -a /etc/caddy/Caddyfile.pre-kliseer /opt/kliseer/current/deploy/Caddyfile
sudo ln -s /opt/kliseer/current/deploy/Caddyfile /etc/caddy/Caddyfile.kliseer
sudo mv -Tf /etc/caddy/Caddyfile.kliseer /etc/caddy/Caddyfile
```

If the backup or current release Caddyfile already exists, stop and inspect it; do not overwrite either. The bootstrap copy keeps the persistent symlink valid before activation, including across a Caddy restart. It is the existing configuration, not the staged routing change. The running Caddy process remains unchanged until CI activates the release.

Rerun the failed CI deployment after preparation. CI validates the release Caddyfile before changing `current`, restarts Next, then runs `caddy reload --config /opt/kliseer/current/deploy/Caddyfile --adapter caddyfile`. It verifies the landing HTML through Caddy plus `/app` both directly against Next and through Caddy. The slashless path is intentional: Next redirects `/app/` with HTTP308. On activation, reload, or health-check failure, CI restores the previous `current`, restarts the app, and reloads the previous release Caddyfile (or the preserved `/etc/caddy/Caddyfile.pre-kliseer` on the first cutover).

After a successful activation, the equivalent administrator validation/reload commands are:

```sh
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Do not perform this production cutover unless you have reviewed the staged release and have access to the saved original Caddyfile for rollback.
