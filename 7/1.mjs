/* 7.1 Console color factory: Create a class called ColorConsole that has just
one empty method called log(). Then, create three subclasses: RedConsole,
BlueConsole, and GreenConsole. The log() method of every ColorConsole
subclass will accept a string as input and will print that string to the console
using the color that gives the name to the class. Then, create a factory
function that takes color as input, such as 'red', and returns the related
ColorConsole subclass. Finally, write a small command-line script to try
the new console color factory. You can use this Stack Overflow answer as
a reference for using colors in the console: nodejsdp.link/console-colors. */

class ColorConsole {
  log() {}
}

class RedConsole extends ColorConsole {
  log(str) {
    console.log("\x1b[31m", str, "\x1b[0m");
  }
}

class BlueConsole extends ColorConsole {
  log(str) {
    console.log("\x1b[34m", str, "\x1b[0m");
  }
}

class GreenConsole extends ColorConsole {
  log(str) {
    console.log("\x1b[32m", str, "\x1b[0m");
  }
}

function consoleColorFactory(color) {
  const colorsMap = {
    red: new RedConsole(),
    blue: new BlueConsole(),
    green: new GreenConsole()
  };

  if (!Object.keys(colorsMap).includes(color))
    throw new Error("Color is not supported");

  return colorsMap[color]();
}

(function main() {
  const color = process.argv[2];
  const string = process.argv[3];
  const colorConsole = consoleColorFactory(color);
  colorConsole.log(string);
})();
