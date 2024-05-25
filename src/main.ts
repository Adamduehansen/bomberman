import {
  Actor,
  CollisionType,
  Color,
  Engine,
  ImageSource,
  Keys,
  Loader,
  Shape,
  SpriteSheet,
} from "excalibur";
import "./style.css";
import { TiledResource } from "@excaliburjs/plugin-tiled";

const game = new Engine({
  suppressPlayButton: true,
  pixelArt: true,
});

const imageSource = new ImageSource("sprites/spritesheet.png");
const spriteSheet = SpriteSheet.fromImageSource({
  image: imageSource,
  grid: {
    columns: 16,
    rows: 23,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});

const tiledMap = new TiledResource("maps/map1.tmx", {
  entityClassNameFactories: {
    "spawn-point": function (props) {
      const player = new Actor({
        x: props.worldPos.x,
        y: props.worldPos.y,
        color: Color.Red,
        width: 16,
        height: 16,
        name: "Player",
        collider: Shape.Box(16, 16),
        collisionType: CollisionType.Active,
      });
      player.graphics.use(spriteSheet.getSprite(5, 0));
      player.on("preupdate", () => {
        if (game.input.keyboard.isHeld(Keys.S)) {
          player.pos.y += 1;
        }
        if (game.input.keyboard.isHeld(Keys.W)) {
          player.pos.y -= 1;
        }
        if (game.input.keyboard.isHeld(Keys.A)) {
          player.pos.x -= 1;
        }
        if (game.input.keyboard.isHeld(Keys.D)) {
          player.pos.x += 1;
        }
      });

      game.currentScene.camera.strategy.lockToActor(player);
      game.currentScene.camera.zoom = 4;

      return player;
    },
  },
});

const loader = new Loader([imageSource, tiledMap]);

game.start(loader).then(() => {
  tiledMap.addToScene(game.currentScene);
});

game.on("initialize", () => {
  const socket = new WebSocket("ws://localhost:8081");
  socket.addEventListener("open", () => {
    console.log("Connected to socket");
  });
});
