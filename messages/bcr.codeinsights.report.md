# summary

Takes the static code analysis results of the SFCA plugin and uploads them to a givem commit in Bitbucket, providing code reviewers additional insights into the code being reviewed.

# description

SFCA ("Salesforce Code Analyzer") plugin performs static code analysis using popular tools such as PMD, ESLINT, RETIRE.Js, and more. This SFDX plugin takes the results of this analysis and uploads them to a specified commit in Bitbucket Server. This allows code reviewers to do a better analysis of the code, gaining valuable insights into the quality of the code being reviewed.

Note: Please make sure when running the `sfdx scanner:run` to provide the flag `--normalize-severity`, otherwise reported severities in the code insights may not match to the actual severity level.

# flags.report-file.summary

The SFCA result JSON file with violations normalized.

# flags.commit-id.summary

Commit hash where the code insights will be uploaded to in Bitbucket Server.

# flags.bitbucket-server-url.summary

Bitbucket server url.

# flags.bitbucket-auth-username.summary

Your Bitbucket Server username.

# flags.bitbucket-auth-password.summary

Your Bitbucket Server password. Preferentially, create a new HTTP Access Token under your profile page and use it instead of your password.

# flags.bitbucket-project-key.summary

The project key where the repository exists.

# flags.bitbucket-repository-slug.summary

The repository slug identifier.

# flags.skip-engine-results.summary

Engines to not parse from the results flag.

# examples

- <%= config.bin %> <%= command.id %> \
  --bitbucket-server-url "https://bitbucket.my-org-instance.org" \
  --bitbucket-auth-username "your@username.com" \
  --bitbucket-auth-password "http-access-token-password" \
  --bitbucket-project-key "PRJ" \
  --bitbucket-repository-slug "my-repo" \
  --commit-id "f1eb3eb5710d2396d68987dd571433151714b499" \
  --report-file report-output.json \
  --skip-engine-results "eslint-lwc" \
  --skip-engine-results "retire-js" \
