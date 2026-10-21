# Allstar security integration for MLŽIDLA

## Status and architecture

The MLŽIDLA Base44 app source is not itself the GitHub repository where Allstar policies are enforced. Allstar is a GitHub App that evaluates repository policy; installing a JavaScript package or embedding code in the public website does not activate it.

Target source repository:
- `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`
- Default branch: `main`

Allstar configuration repository currently supplied by the owner:
- `jakub1duch-a11y/allstar`
- Its README says it points to `google/allstar-config`.

## Required owner/admin steps

1. In GitHub, install/authorize the official OpenSSF Allstar GitHub App for the MLŽIDLA source repository (or the narrowest intended repository scope).
2. Ensure the Allstar app can read repository metadata and create/update issues if findings should be reported as issues. Do not grant broader permissions than the official installation requires.
3. In the Allstar configuration repository, add the target repository to the intended configuration/policy using the current upstream Allstar configuration schema. Do not guess policy filenames or schema; validate against the current official documentation before merging.
4. Start with reporting/monitoring. Review findings before enabling enforcement that could block or alter repository settings.
5. Confirm Allstar has processed the repository and verify a real policy result in GitHub before calling the integration active.

## Credential handling

- Never commit a GitHub App private key, installation token, PAT, or any secret into Base44 source, website JavaScript, or this repository.
- Store required credentials only in GitHub App configuration / GitHub Secrets, as appropriate to the official deployment model.
- Rotate any credential accidentally exposed in source control.

## Current limitation

The connected GitHub integration has read-only access to the target MLŽIDLA repository. The Base44 app can store this runbook, but cannot by itself install the GitHub App or enforce Allstar policies on GitHub. Final activation requires a GitHub owner/admin with write/admin access.
