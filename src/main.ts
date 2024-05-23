import {
  Actor,
  Color,
  Engine,
  ImageSource,
  Loader,
  SpriteSheet,
} from "excalibur";
import "./style.css";

const game = new Engine({
  suppressPlayButton: true,
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

const loader = new Loader([imageSource]);

const player = new Actor({
  width: 50,
  height: 50,
  color: Color.Red,
  x: 100,
  y: 100,
});
player.graphics.use(spriteSheet.getSprite(5, 0));
game.add(player);

await game.start(loader);
