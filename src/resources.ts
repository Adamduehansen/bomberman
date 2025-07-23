import * as ex from "excalibur";

export const Resources = {
  img: {
    player: new ex.ImageSource("/sprites/player-spritesheet.png"),
    enemy: new ex.ImageSource("/sprites/enemy-spritesheet.png"),
  },
} as const;

export const loader = new ex.Loader([
  ...Object.values(Resources.img),
]);
