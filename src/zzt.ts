namespace ZZT {
  function startsWithSlash(value: string): boolean {
    return value.length > 0 && value.charAt(0) === "/";
  }

  function setDefaultWorldDescriptions(): void {
    setWorldFileDescriptions(
      ["TOWN", "DEMO", "CAVES", "DUNGEONS", "CITY", "BEST", "TOUR"],
      [
        "TOWN       The Town of ZZT",
        "DEMO       Demo of the ZZT World Editor",
        "CAVES      The Caves of ZZT",
        "DUNGEONS   The Dungeons of ZZT",
        "CITY       Underground City of ZZT",
        "BEST       The Best of ZZT",
        "TOUR       Guided Tour ZZT's Other Worlds"
      ]
    );
  }

  function parseArguments(): void {
    var args = runtime.getArgv();
    for (var i = 0; i < args.length; i += 1) {
      var pArg = String(args[i] || "");
      if (pArg.length === 0) {
        continue;
      }

      if (startsWithSlash(pArg)) {
        var option = pArg.length > 1 ? pArg.charAt(1).toUpperCase() : "";
        if (option === "T") {
          SoundTimeCheckCounter = 0;
          UseSystemTimeForElapsed = false;
        } else if (option === "R") {
          ResetConfig = true;
        } else if (option === "D") {
          DebugEnabled = true;
        }
        continue;
      }

      StartupWorldFileName = trimWorldExtension(pArg);
    }
  }

  function showConfigHeader(): void {
    runtime.clearScreen();
    runtime.writeLine("");
    runtime.writeLine("                                 <=-  ZZT  -=>");
    if (ConfigRegistration.length === 0) {
      runtime.writeLine("                             Shareware version 3.2");
    } else {
      runtime.writeLine("                                  Version  3.2");
    }
    runtime.writeLine("                            Created by Tim Sweeney");
    runtime.writeLine("");
  }

  function gameConfigure(): void {
    ParsingConfigFile = true;
    EditorEnabled = true;
    ConfigRegistration = "";
    ConfigWorldFile = "";
    GameVersion = "3.2";

    var cfgLines = runtime.readTextFileLines(execPath("zzt.cfg"));
    if (cfgLines.length > 0) {
      ConfigWorldFile = cfgLines[0];
    }
    if (cfgLines.length > 1) {
      ConfigRegistration = cfgLines[1];
    }

    if (ConfigWorldFile.length > 0 && ConfigWorldFile.charAt(0) === "*") {
      EditorEnabled = false;
      ConfigWorldFile = ConfigWorldFile.slice(1);
    }
    if (ConfigWorldFile.length !== 0) {
      StartupWorldFileName = ConfigWorldFile;
    }

    InputInitDevices();

    ParsingConfigFile = false;
    showConfigHeader();

    if (!InputConfigure()) {
      GameTitleExitRequested = true;
      return;
    }
    if (!VideoConfigure()) {
      GameTitleExitRequested = true;
    }
  }

  function runGameMainLoop(): void {
    VideoInstall(80, 1);
    OrderPrintId = GameVersion;
    TextWindowInit(5, 3, 50, 18);
    SoundInit();

    VideoHideCursor();
    runtime.clearScreen();

    TickSpeed = 4;
    SavedGameFileName = "SAVED";
    SavedBoardFileName = "TEMP";
    GenerateTransitionTable();
    WorldCreate();
    GameTitleLoop();
  }

  function cleanupAndExitMessage(): void {
    SoundUninstall();
    SoundClearQueue();
    InputRestoreDevices();
    VideoUninstall();
    runtime.clearScreen();

    if (ConfigRegistration.length === 0) {
      GamePrintRegisterMessage();
    } else {
      runtime.writeLine("");
      runtime.writeLine("  Registered version -- Thank you for playing ZZT.");
      runtime.writeLine("");
    }

    VideoShowCursor();
  }

  export function main(): void {
    setDefaultWorldDescriptions();

    StartupWorldFileName = "TOWN";
    ResourceDataFileName = "ZZT.DAT";
    ResetConfig = false;
    GameTitleExitRequested = false;

    gameConfigure();
    parseArguments();

    if (!GameTitleExitRequested && !runtime.isTerminated()) {
      runGameMainLoop();
    }

    cleanupAndExitMessage();
  }
}

ZZT.main();
