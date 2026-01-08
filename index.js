#!/usr/bin/env node

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "github-activity >>> ",
});

console.log("Enter the username to fetch their github events . . .");

rl.prompt();

rl.on("line", async (input) => {
  // console.log(input)
  let userInput = input.split(" ").filter((inp) => inp !== "");

  console.log(userInput)

  if (userInput) {
    try{

        let response = await fetch(
          `https://api.github.com/users/${userInput[0]}/events`
        );
        if(response.ok){
            const JSONdata = await response.json();
            if(JSONdata.length > 0){
                console.log(JSONdata);
            }else{
                console.log("No events found, May be just sleeping under a rock bruh -_- ")
            }
        }else{
            console.log("Could not find the user . . .")
        }
    
    }catch(err){
        console.log("Something went wrong . . .")
        console.log(err)
    }

  } else if (input === "exit") {
    process.exit(0);
  } else {
    console.log("Wrong command . . .");
  }

  rl.prompt();
});
