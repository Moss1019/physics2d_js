
function hanleInput (ev) {

}

const b = new GameObject(new Vec2(g_engine.width / 2, g_engine.height), 0, .2, .2, g_engine.width, 10);
g_engine.addGameObject(b);

const t = new GameObject(new Vec2(g_engine.width / 2, 0), 0, .2, .2, g_engine.width, 10);
g_engine.addGameObject(t);

const l = new GameObject(new Vec2(0, g_engine.height / 2), 0, .2, .2, 10, g_engine.height);
g_engine.addGameObject(l);

const r = new GameObject(new Vec2(g_engine.width, g_engine.height / 2), 0, .2, .2, 10, g_engine.height);
g_engine.addGameObject(r);

const g = new GameObject(new Vec2(200, 600), 0.2, 0.5, 0.5, 40, 50);
g.rotate(10);
g_engine.addGameObject(g);

const v = new GameObject(new Vec2(200, 700), 0.2, 0.5, 0.5, 40, 50);
g_engine.addGameObject(v);

const w = new GameObject(new Vec2(200, 100), 0.2, 0.5, 0.5, 40, 50);
g_engine.addGameObject(w);

const s = new GameObject(new Vec2(200, 400), 0.2, 0.5, 0.5, 40, 50);
g_engine.addGameObject(s);
