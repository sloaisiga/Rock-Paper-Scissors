function register(voxaApp) {
  voxaApp.onIntent("LaunchIntent", () => {
    return {
      flow: "continue",
      reply: "Welcome",
      to: "askHowManyWins",
    };
  });

  voxaApp.onState("askHowManyWins", () => {
    return {
      flow: "yield",
      reply: "AskHowManyWins",
      to: "getHowManyWins",
    };
  });

  const MAX_WINS_ALLOWED = 10;

  voxaApp.onState("getHowManyWins", voxaEvent => {
    if (voxaEvent.intent.name === "MaxWinsIntent") {
      voxaEvent.model.wins = voxaEvent.intent.params.wins;
      voxaEvent.model.userWins = 0;
      voxaEvent.model.alexaWins = 0;

      const MaxWins = parseInt(voxaEvent.model.wins);

      if (MaxWins > MAX_WINS_ALLOWED) {
        return {
          flow: "yield",
          reply: "ConfirmMaxWins",
          to: "confirmMaxWins",
        };
      }

      return {
        flow: "continue",
        reply: "StartGame",
        to: "askUserChoice",
      };
    }

    return { to: "entry" };
  });

  voxaApp.onState("confirmMaxWins", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "StartGame",
        to: "askUserChoice",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        to: "askHowManyWins",
      };
    }
  });

  const CHOICES = ["rock", "paper", "scissors"];

  voxaApp.onState("askUserChoice", voxaEvent => {
    const userWon =
      parseInt(voxaEvent.model.userWins) >= parseInt(voxaEvent.model.wins);
    const alexaWon =
      parseInt(voxaEvent.model.alexaWins) >= parseInt(voxaEvent.model.wins);

    if (userWon) {
      return {
        flow: "continue",
        reply: "UserWinsTheGame",
        to: "askIfStartANewGame",
      };
    }

    if (alexaWon) {
      return {
        flow: "continue",
        reply: "AlexaWinsTheGame",
        to: "askIfStartANewGame",
      };
    }

    const min = 0;
    const max = CHOICES.length - 1;
    voxaEvent.model.userChoice = undefined;
    voxaEvent.model.alexaChoice =
      Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      flow: "yield",
      reply: "AskUserChoice",
      to: "getUserChoice",
    };
  });

  voxaApp.onState("getUserChoice", voxaEvent => {
    const intents = {
      RockIntent: "rock",
      PaperIntent: "paper",
      ScissorsIntent: "scissors",
    };

    const foundOption = intents[voxaEvent.intent.name];
    if (foundOption) {
      voxaEvent.model.userChoice = foundOption;
      console.log(`voxaEvent.model.userChoice ${voxaEvent.model.userChoice}`);

      return {
        flow: "continue",
        to: "processWinner",
      };
    }

    return { to: "entry" };
  });

  voxaApp.onState("processWinner", voxaEvent => {
    const alexaChoice = CHOICES[voxaEvent.model.alexaChoice];
    const { userChoice } = voxaEvent.model;
    let reply = "TiedResult";

    if (alexaChoice === userChoice) {
      return {
        flow: "continue",
        reply,
        to: "askUserChoice",
      };
    }

    if (alexaChoice === "rock") {
      if (userChoice === "paper") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "scissors") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    if (alexaChoice === "paper") {
      if (userChoice === "scissors") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "rock") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    if (alexaChoice === "scissors") {
      if (userChoice === "rock") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "paper") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    return {
      flow: "continue",
      reply,
      to: "askUserChoice",
    };
  });

  voxaApp.onState("askIfStartANewGame", () => {
    return {
      flow: "yield",
      reply: "AskIfStartANewGame",
      to: "shouldStartANewGame",
    };
  });

  voxaApp.onState("shouldStartANewGame", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "RestartGame",
        to: "askHowManyWins",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "terminate",
        reply: "Bye",
      };
    }
  });

  voxaApp.onIntent("CancelIntent", () => {
    return {
      flow: "terminate",
      reply: "Bye",
    };
  });

  voxaApp.onIntent("StopIntent", () => {
    return {
      flow: "terminate",
      reply: "Bye",
    };
  });

  voxaApp.onIntent("HelpIntent", () => {
    return {
      reply: "Help",
      to: "StartANewGame",
    };
  });

  voxaApp.onState("StartANewGame", () => {
    return {
      flow: "yield",
      reply: "AskForANewGame",
      to: "shouldStartANewGame",
    };
  });

  voxaApp.onIntent("ScoreIntent", voxaEvent => {
    let score =
      parseInt(voxaEvent.model.userWins) + parseInt(voxaEvent.model.alexaWins);

    if (score > 0) {
      return {
        reply: "ScoreResult",
        to: "askUserChoice",
      };
    }
    return {
      reply: "NoScoreResult",
      to: "StartANewGame",
    };
  });

  voxaApp.onIntent("NewGameIntent", voxaEvent => {
    const MaxWins = parseInt(voxaEvent.model.wins) || 0;

    if (MaxWins == 0) {
      voxaEvent.model.userWins = 0;
      voxaEvent.model.alexaWins = 0;
    }

    return {
      flow: "yield",
      reply: "CurrentScore",
      to: "ConfirmNewGame",
    };
  });

  voxaApp.onState("ConfirmNewGame", voxaEvent => {
    const MaxWins = parseInt(voxaEvent.model.wins) || 0;
    const userWon = parseInt(voxaEvent.model.userWins);
    const alexaWon = parseInt(voxaEvent.model.alexaWins);

    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        to: "shouldStartANewGame",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      if (MaxWins == 0) {
        return {
          reply: "ContinueTheGame",
          to: "askHowManyWins",
        };
      }

      if (MaxWins > userWon && MaxWins > alexaWon) {
        return {
          reply: "ContinueTheGame",
          to: "askUserChoice",
        };
      }

      if (MaxWins == userWon || MaxWins == alexaWon) {
        return {
          flow: "terminate",
          reply: "Bye",
        };
      }
    }
  });

  voxaApp.onUnhandledState(voxaEvent => {
    return {
      to: "FallbackIntent",
    };
  });

  voxaApp.onState("FallbackIntent", () => ({
    flow: "yield",
    reply: "NoIdea",
    to: "entry",
  }));
}

module.exports = register;
