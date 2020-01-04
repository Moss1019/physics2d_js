
function hanleInput(ev) {
  let keycode;

  if (window.event) {
    keycode = event.keyCode;
  } else if (event.which) {
    keycode = event.which;
  }
  if (keycode === 87) {
    g_engine.moveSpawnPoint(new Vec2(0, -10));
  } else if (keycode === 83) {
    g_engine.moveSpawnPoint(new Vec2(0, +10));
  }
  if (keycode === 65) {
    g_engine.moveSpawnPoint(new Vec2(-10, 0));
  } else if (keycode === 68) {
    g_engine.moveSpawnPoint(new Vec2(10, 0));
  }
  if (keycode === 81) {
      g_engine.spawnNewGameObject();
  }
  if (keycode === 69) {
    g_engine.removeLastAddedGameObject();
  }
}

const b = new GameObject(new Vec2(g_engine.width / 2, g_engine.height), 0, .2, .2, g_engine.width, 10);
g_engine.addGameObject(b);

const t = new GameObject(new Vec2(g_engine.width / 2, 0), 0, .2, .2, g_engine.width, 10);
g_engine.addGameObject(t);

const l = new GameObject(new Vec2(0, g_engine.height / 2), 0, .2, .2, 10, g_engine.height);
g_engine.addGameObject(l);

const r = new GameObject(new Vec2(g_engine.width, g_engine.height / 2), 0, .2, .2, 10, g_engine.height);
g_engine.addGameObject(r);

