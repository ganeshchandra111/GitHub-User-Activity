#!/usr/bin/env node

import readline from "readline";
import figlet from "figlet";
import chalk from "chalk";
import ora from "ora";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let cache = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "github-activity >>> ",
});

async function showTitle() {
  await figlet("GITHUB ACTIVITY", (err, data) => {
    if (err) {
      console.log(chalk.redBright("Something went wrong . . . "));
      process.exit(0);
    }
    console.log(chalk.greenBright(data));
  });
}

await showTitle();
console.log(
  chalk.blueBright(
    `Enter the "get <username>" to fetch their github events . . .`
  )
);


rl.prompt();

rl.on("line", async (input) => {
  // console.log(input)
  let userInput = input.split(" ").filter((inp) => inp !== "");

  // console.log(userInput);

  const getCommandOptions = new Set(["get", "Get", "GET", "g", "G"]);
  const exitCommandOptions = new Set(["exit", "e", "EXIT", "E"]);

  if (getCommandOptions.has(userInput[0])) {
    try {
      let URL = `https://api.github.com/users/${userInput[1]}/events`;
      // let URL = `https://api.github.com/users/kamranahmedse/events`;

      // const spinner = ora("Opening . . . ").start();
      // spinner.color = "yellow";
      // await sleep(2000);
      // spinner.stop();

      if (cache[URL]) {
        console.log(chalk.gray("Getting data from cache . . ."));
        ShowGitActivity(cache[URL]);
      } else {
        let response = await fetch(URL); //Sending a GET request

        if (response.ok) {
          const JSONdata = await response.json();
          if (JSONdata.length > 0) {
            // console.log(JSONdata);
            ShowGitActivity(JSONdata);
            cache[URL] = JSONdata;
          } else {
            console.log(
              chalk.greenBright(
                "No events found, May be just sleeping under a rock bruh -_- "
              )
            );
          }
        } else {
          console.log(chalk.bgRedBright("Could not find the user . . ."));
        }
      }
    } catch (err) {
      console.log(chalk.bgRedBright("Something went wrong . . ."));
      console.log(err);
    }
  } else if (exitCommandOptions.has(input.trim())) {
    process.exit(0);
  } else {
    console.log(chalk.bgRedBright("Wrong command . . ."));
  }

  console.log()
  rl.prompt();
});

async function ShowGitActivity(JsonData) {

  let counts = {};
  let TotalCounts = {};
  let Repos = [];

  for (const data of JsonData) {
    const repo = data.repo.name;
    const event = data.type;

    if (!counts[repo]) {
      counts[repo] = {};
    }

    if (!TotalCounts[event]) {
      TotalCounts[event] = 0;
    }

    TotalCounts[event] += 1;

    counts[repo][event] = (counts[repo][event] || 0) + 1;

    if (!(Repos.includes(repo))) {
      Repos.push(data.repo.name);
    }
  }

  console.log(chalk.yellowBright("\nuser's Activity -----"));
  console.table(TotalCounts);

  console.log(chalk.yellowBright("\nuser's public repos -----"));
  for (let i in Repos) {
    console.log(chalk.greenBright(Repos[i]));
  }

  console.log(chalk.yellowBright("\nuser's events in detail -----"));
  for (const repo in counts) {
    for (const event in counts[repo]) {
      console.log(
        chalk.blueBright(
          `${event.replace("Event", " - ").toLowerCase()} ${
            counts[repo][event]
          }  - times in - ${repo}`
        )
      );
    }
  }
}
