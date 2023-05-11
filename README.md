# bitbucket-codeinsights-reporter

[![NPM](https://img.shields.io/npm/v/bitbucket-codeinsights-reporter.svg?label=bitbucket-codeinsights-reporter)](https://www.npmjs.com/package/bitbucket-codeinsights-reporter) [![Downloads/week](https://img.shields.io/npm/dw/bitbucket-codeinsights-reporter.svg)](https://npmjs.org/package/bitbucket-codeinsights-reporter) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/bitbucket-codeinsights-reporter/main/LICENSE.txt)

## Install

```bash
sf plugins install bitbucket-codeinsights-reporter
```

# What is bitbucket-codeinsights-reporter?

bitbucket-codeinsights-reporter uses the static code analysis results from the [Salesforce Code Analyser](https://forcedotcom.github.io/sfdx-scanner/) plugin and then uploads those results as Annotations to a given commit in Bitbucket Server. Those annotations can then be seen in the Diff view of a Pull Request of that commit.

## How to use?

First run the scanner, making sure to provide the `--normalize-severity` flag. Only JSON output is supported. [Check source for reference](https://forcedotcom.github.io/sfdx-scanner/en/v3.x/scanner-commands/run/). Example:

```bash
sfdx scanner:run --normalize-severity --json --target "classes/myclass.cls" --outfile results.json
```

Then pass the results.json file on the `report-file` parameter of the report command.

Note: do not evaluate all of your source files using the scanner, you should only evaluate modified/created components part of the commit. You can use [sfdx-git-delta](https://github.com/scolladon/sfdx-git-delta) for that in your pipeline for Pull-Requests validation.

## Commands

<!-- commands -->

- [`sf bcr codeinsights report`](#sf-bcr-codeinsights-report)

## `sf bcr codeinsights report`

Takes the static code analysis results of SFCA plugin and uploads them to a givem commit in Bitbucket, providing code reviewers additional insights into the code being reviewed.

```
USAGE
  $ sf bcr codeinsights report --report-file <value> --commit-id <value> --bitbucket-server-url <value>
    --bitbucket-auth-username <value> --bitbucket-auth-password <value> --bitbucket-project-key <value>
    --bitbucket-repository-slug <value> [--json] [--skip-engine-results pmd|eslint-lwc|cpd|retire-js]

FLAGS
  --bitbucket-auth-password=<value>    (required) Your Bitbucket Server password. Preferentially, create a new HTTP
                                       Access Token under your profile page and use it instead of your password.
  --bitbucket-auth-username=<value>    (required) Your Bitbucket Server username.
  --bitbucket-project-key=<value>      (required) The project key where the repository exists.
  --bitbucket-repository-slug=<value>  (required) The repository slug identifier.
  --bitbucket-server-url=<value>       (required) Bitbucket server url.
  --commit-id=<value>                  (required) Commit hash where the code insights will be uploaded to in Bitbucket
                                       Server.
  --report-file=<value>                (required) The SFCA result JSON file with violations normalized.
  --skip-engine-results=<option>...    Engines to not parse from the results flag.
                                       <options: pmd|eslint-lwc|cpd|retire-js>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Takes the static code analysis results of SFCA plugin and uploads them to a givem commit in Bitbucket, providing code
  reviewers additional insights into the code being reviewed.

  SFCA ("Salesforce Code Analyzer") plugin performs static code analysis using popular tools such as PMD, ESLINT,
  RETIRE.Js, and more. This SFDX plugin takes the results of this analysis and uploads them to a specified commit in
  Bitbucket Server. This allows code reviewers to do a better analysis of the code, gaining valuable insights into the
  quality of the code being reviewed.

  Note: Please make sure when running the `sfdx scanner:run` to provide the flag `--normalize-severity`, otherwise
  reported severities in the code insights may not match to the actual severity level.

EXAMPLES
  $ sf bcr codeinsights report \
  --bitbucket-server-url "https://bitbucket.my-org-instance.org" \
  --bitbucket-auth-username "your@username.com" \
  --bitbucket-auth-password "http-access-token-password" \
  --bitbucket-project-key "PRJ" \
  --bitbucket-repository-slug "my-repo" \
  --commit-id "f1eb3eb5710d2396d68987dd571433151714b499" \
  --report-file report-output.json \
  --skip-engine-results "eslint-lwc" \
  --skip-engine-results "retire-js" \
```

<!-- commandsstop -->
