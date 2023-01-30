import {Probot} from "probot";

export = (app: Probot) => {
    app.on("issues.opened", async (context) => {
        const {issue_number, owner, repo, body} = context.issue({
            body: "Thanks for opening this issue!",
        });
        const labels = ["bug"]
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
           assignees:[owner]
        });
    });
    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
