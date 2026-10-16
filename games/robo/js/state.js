(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});

  RoboGame.els = window.RoboGameKit.createElements();
  RoboGame.state = window.RoboGameKit.createState({
    selected: [],
    hinted: false
  });
})();


