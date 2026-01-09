# GitHub Activity CLI

A simple command line tool to view a GitHub user's recent public activity.

## What it does

* Fetches public GitHub events for a user
* Shows event counts
* Lists public repositories
* Displays activity details

## Installation

```bash
npm install
```

## Usage

```bash
node index.js
```

Then type:

```bash
get <github-username>
```

To exit:

```bash
exit
```

## Requirements

* Node.js

## Notes

* Uses the public GitHub API
* Results are cached during runtime
