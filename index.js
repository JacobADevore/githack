#!/usr/bin/env node

import fs from "node:fs";
import ini from "ini";
import { exec } from "node:child_process";
import { select } from "@inquirer/prompts";
import prompts from "prompts";
import { fetchTweet } from "react-tweet/api";
import cliProgress from "cli-progress";

const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

const currentDir = process.env.INIT_CWD || process.cwd();

try {
  const gitConfig = fs.readFileSync(currentDir + "/.git/config", "utf8");
  const gitConfigUrl = ini.parse(gitConfig)['remote "origin"'].url;

  if (!gitConfig || !gitConfigUrl.includes("githack-commits")) {
    errorInvalidGitHubRepository();
  }
} catch {
  errorInvalidGitHubRepository();
}

const updateFileExists = fs.existsSync(currentDir + "/update");

if (!updateFileExists) {
  try {
    fs.writeFileSync(currentDir + "/update", "");
  } catch {
    console.log(
      "\x1b[1m" +
        "\x1b[31m" +
        "❌ Error creating the file `update`, please make sure you have write permissions to the `githack-commits` directory." +
        "\x1b[0m"
    );
    process.exit();
  }
}

let updateFileContents;

try {
  updateFileContents = fs.readFileSync(currentDir + "/update", "utf8");
} catch {
  console.log(
    "\x1b[1m" +
      "\x1b[31m" +
      "❌ Error reading the file `update`, please make sure you have read permissions to the `githack-commits` directory." +
      "\x1b[0m"
  );
  process.exit();
}

const hasCompletedOnboarding = updateFileContents.startsWith(";)");

(async () => {
  if (!hasCompletedOnboarding) {
    console.log(
      "\x1b[33m" +
        "🚨 Complete the following steps to get LIFETIME ACCESS to GitHack! 🚨" +
        "\x1b[0m"
    );
    console.log("");
    console.log("\x1b[90m" + "--- Post the Tweet below ---" + "\x1b[0m");
    console.log(
      "CMD + Click 👉 " +
        "\x1b[1m" +
        "\x1b[34m" +
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(
          `Infinite GitHub contributions by @githack_dev
1️⃣ npm i -g gith4ck
2️⃣ gith4ck`
        ) +
        "\x1b[0m"
    );
    console.log("");
    const postURL = await prompts({
      type: "text",
      name: "value",
      message: "Paste your posted Tweet URL:",
      validate: async (url) => {
        if (!isValidUrl(url) || !(await isPostValid(url))) {
          return "URL invalid, please make sure the URL is from the tweet you posted from the above link.";
        }

        return true;
      },
    });

    if (!postURL.value) {
      console.log(
        "\x1b[1m" +
          "\x1b[31m" +
          "Canceling... Please try again with a valid Tweet URL to use GitHack." +
          "\x1b[0m"
      );
      process.exit();
    }

    let attempts = 1;

    console.log(
      "\x1b[33m" + "🚨 Final step, follow me on X/Twitter ;) 🚨" + "\x1b[0m"
    );
    console.log("");
    console.log("\x1b[90m" + "--- My X/Twitter account ---" + "\x1b[0m");
    console.log(
      "CMD + Click 👉 " +
        "\x1b[1m" +
        "\x1b[34m" +
        "https://x.com/intent/follow?screen_name=jacobadevore" +
        "\x1b[0m"
    );
    console.log("");
    await prompts({
      type: "text",
      name: "value",
      message: "Press enter to check if you are following on X/Twitter",
      // Psychological validation
      validate: async () => {
        if (attempts >= 3) {
          return true;
        }

        attempts = attempts + 1;
        return "Our system hasn't detected you are following, please ensure you are following the Twitter account above and try again.";
      },
    });

    if (attempts < 3) {
      console.log(
        "\x1b[1m" +
          "\x1b[31m" +
          "Canceling... Please try again and make sure you are following the X/Twitter account above." +
          "\x1b[0m"
      );
      process.exit();
    }

    try {
      fs.writeFile(currentDir + "/update", ";)", {}, () => {});
    } catch {
      console.log(
        "\x1b[1m" +
          "\x1b[31m" +
          "❌ Error writing to the file `update`, please make sure you have write permissions to the `githack-commits` directory." +
          "\x1b[0m"
      );
      process.exit();
    }

    console.log(
      "\x1b[1m" +
        "\x1b[32m" +
        "🥳 Congratulations! You now have LIFETIME ACCESS to GitHack! 🎉" +
        "\x1b[0m"
    );
  }

  const selectedYear = await select({
    message: "Select the year you want to add commits to",
    choices: [
      { name: "2024 (this year)", value: 2024 },
      { name: 2023, value: 2023 },
      { name: 2022, value: 2022 },
      { name: 2021, value: 2021 },
      { name: 2020, value: 2020 },
      { name: 2019, value: 2019 },
      { name: 2018, value: 2018 },
      { name: 2017, value: 2017 },
      { name: 2016, value: 2016 },
      { name: 2015, value: 2015 },
      { name: 2014, value: 2014 },
      { name: 2013, value: 2013 },
      { name: 2012, value: 2012 },
      { name: 2011, value: 2011 },
      { name: 2010, value: 2010 },
      { name: 2009, value: 2009 },
      { name: 2008, value: 2008 },
      { name: 2007, value: 2007 },
      { name: 2006, value: 2006 },
      { name: 2005, value: 2005 },
      { name: 2004, value: 2004 },
      { name: 2003, value: 2003 },
      { name: 2002, value: 2002 },
      { name: 2001, value: 2001 },
      { name: 2000, value: 2000 },
      { name: 1999, value: 1999 },
      { name: 1998, value: 1998 },
      { name: 1997, value: 1997 },
      { name: 1996, value: 1996 },
      { name: 1995, value: 1995 },
      { name: 1994, value: 1994 },
      { name: 1993, value: 1993 },
      { name: 1992, value: 1992 },
      { name: 1991, value: 1991 },
      { name: 1990, value: 1990 },
      { name: 1989, value: 1989 },
      { name: 1988, value: 1988 },
      { name: 1987, value: 1987 },
      { name: 1986, value: 1986 },
      { name: 1985, value: 1985 },
      { name: 1984, value: 1984 },
      { name: 1983, value: 1983 },
      { name: 1982, value: 1982 },
      { name: 1981, value: 1981 },
      { name: 1980, value: 1980 },
      { name: 1979, value: 1979 },
      { name: 1978, value: 1978 },
      { name: 1977, value: 1977 },
      { name: 1976, value: 1976 },
      { name: 1975, value: 1975 },
      { name: 1974, value: 1974 },
    ],
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const isSelectedYearTheCurrentYear = currentYear === selectedYear;
  const totalDaysToMakeCommits = isSelectedYearTheCurrentYear
    ? daysSinceYearStart()
    : 365;
  let daysSinceSelectedYearStart = isSelectedYearTheCurrentYear
    ? daysSinceYearStart()
    : (currentYear - selectedYear - 1) * 365 + daysSinceYearStart();
  let currentDaysCommitted = 0;
  let totalCommits = 0;

  console.log(
    "\x1b[90m" +
      "GitHack has been started for " +
      selectedYear +
      "..." +
      "\x1b[0m"
  );

  progressBar.start(totalDaysToMakeCommits, currentDaysCommitted);

  // Randomness inside the loop is used to make the commits look more realistic
  for (let i = 0; i < totalDaysToMakeCommits; i++) {
    if (getRandomNumber(1, 100) >= 80) {
      currentDaysCommitted = currentDaysCommitted + 1;
      progressBar.update(currentDaysCommitted);
      continue;
    }

    const randomCommitsPerDay = getRandomNumber(1, 3);

    for (let j = 0; j < randomCommitsPerDay; j++) {
      fs.appendFile(
        currentDir + "/update",
        getRandomNumber(0, 1).toString(),
        () => {}
      );
      await execAwait("git add .");
      await execAwait(
        `git commit --date "${daysSinceSelectedYearStart + i} day ago" -m "w"`
      );
      totalCommits = totalCommits + 1;
    }

    currentDaysCommitted = currentDaysCommitted + 1;
    progressBar.update(currentDaysCommitted);
  }

  await execAwait("git push");
  console.log("");
  console.log(
    "\x1b[1m" +
      "\x1b[32m" +
      `You have successfully pushed ${totalCommits} commits to GitHub for ${selectedYear}, go check your profile!` +
      "\x1b[0m"
  );
  console.log("");
  console.log(
    "P.S. Did you like GitHack? Please star our GitHub repository ❤️"
  );
  console.log("");
  console.log(
    "CMD + Click 👉 " +
      "\x1b[1m" +
      "\x1b[34m" +
      "https://github.com/JacobADevore/githack" +
      "\x1b[0m"
  );
  console.log("");
  console.log("");
  process.exit();
})();

function execAwait(command, options = { log: false, cwd: process.cwd() }) {
  return new Promise((done, failed) => {
    exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout;
        err.stderr = stderr;
        failed(err);
        return;
      }

      done({ stdout, stderr });
    });
  });
}

function daysSinceYearStart() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isValidUrl(url) {
  const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return regex.test(url);
}

async function isPostValid(post_url) {
  const post_url_split = post_url.split("/");

  const post_id = post_url_split[post_url_split.length - 1];

  const { data } = await fetchTweet(post_id);

  if (
    !data ||
    !data.text ||
    !data.text.includes("Infinite GitHub contributions by @githack_dev") ||
    !data.text.includes("npm i -g gith4ck")
  ) {
    return false;
  }

  return true;
}

function errorInvalidGitHubRepository() {
  console.log(
    "\x1b[1m" +
      "\x1b[31m" +
      "❌ Invalid repository, you must be inside the githack-commits repository." +
      "\x1b[0m"
  );
  console.log("");
  console.log(
    "\x1b[1m" +
      "\x1b[33m" +
      "New to GitHack? 👋 Follow the steps below to get started!" +
      "\x1b[0m"
  );
  console.log("");
  console.log(
    "\x1b[33m" +
      "1. Create the githack-commits repository with the link below" +
      "\x1b[0m"
  );
  console.log("");
  console.log(
    "CMD + Click 👉 " +
      "\x1b[1m" +
      "\x1b[34m" +
      "https://github.com/new?owner=@me&name=githack-commits&visibility=private" +
      "\x1b[0m"
  );
  console.log("");
  console.log("\x1b[33m" + "2. `git clone <repository url>`" + "\x1b[0m");
  console.log("");
  console.log(
    "\x1b[33m" +
      "3. `cd githack-commits` (should now be inside the `githack-commits` directory)" +
      "\x1b[0m"
  );
  console.log("");
  console.log(
    "\x1b[33m" +
      "4. run the command `gith4ck` inside the `githack-commits` directory" +
      "\x1b[0m"
  );
  console.log("");
  console.log("");
  process.exit();
}
