import {Probot} from "probot";

export = (app: Probot) => {
    app.on("pull_request.edited", async (context) => {
        const {owner, repo, pull_number} = await context.pullRequest();
        await context.octokit.issues.update({
            owner,
            repo,
            issue_number: pull_number,
            assignees: [owner],
            labels: ["test"]
        });
        const pullRequest = context.payload.pull_request;
        const checkOptions = {
            name: "SDA",
            head_branch: "", // workaround for https://github.com/octokit/rest.js/issues/874
            head_sha: pullRequest.head.sha,
            status: "in_progress",
            started_at: new Date().toISOString(),
            output: {
                title:"SSSSS",
                summary: `The title "${pullRequest.title}" contains "SSSSS".`,
                text: `By default, WIP only checks the pull request title for the terms "WIP", "Work in progress" and "🚧".
You can configure both the terms and the location that the WIP app will look for by signing up for the pro plan: https://github.com/marketplace/wip. All revenue will be donated to [Processing | p5.js](https://p5js.org/download/support.html) – one of the most diverse and impactful Open Source community there is.`,
            },
            // workaround random "Bad Credentials" errors
            // https://github.community/t5/GitHub-API-Development-and/Random-401-errors-after-using-freshly-generated-installation/m-p/22905/highlight/true#M1596
            request: {
                retries: 3,
                retryAfter: 3,
            },
        };
        context.octokit.checks.create(context.repo(checkOptions));
    })

    app.on("issues.opened", async (context) => {
        const {issue_number, owner, repo, body} = context.issue({
            body: "Thanks for opening this issue!",
        });
        const labels = ["bug"]
        context.log.info(labels)
        await context.octokit.issues.createComment({
            owner,
            repo,
            issue_number,
            body
        });
        await context.octokit.issues.addLabels({
            owner,
            repo,
            issue_number,
            labels,
        });
        await context.octokit.issues.addAssignees({
            owner,
            repo,
            issue_number,
            labels,
            assignees: [owner]
        });
    });
    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
