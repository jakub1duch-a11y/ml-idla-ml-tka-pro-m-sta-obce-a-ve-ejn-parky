# GitHub → Base44 production deployment

This repository is the source of truth for the MLŽIDLA.cz Base44 app.

- GitHub repository: `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`
- Production branch: `main`
- Base44 app ID: `6a3ee88c10959cd3588c4d68`
- Workflow: `.github/workflows/deploy-base44.yml`

## Authentication

The workflow uses the official Base44 CLI and expects one GitHub Actions repository secret:

`BASE44_API_KEY`

Use a Base44 workspace API key beginning with `b44k_`. Never commit the key to source control.

Once the secret exists, a push to `main` that changes application files runs:

`npx --yes base44@0.1.7 deploy --build -y`

This deploys Base44 resources and the built site to the existing Base44 application.

Until the secret is configured, the workflow exits safely without deploying and reports that the bridge is waiting for the credential.
