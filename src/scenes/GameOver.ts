import Phaser from "phaser";
import AudioKeys from "~/const/AudioKeys";
import SceneKeys from "~/const/SceneKeys";
import TextureKeys from "~/const/TextureKeys";

export default class GameOver extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  constructor() {
    super(SceneKeys.GameOver);
  }
  create() {
    const height = this.scale.height;
    const width = this.scale.width;

    this.background = this.add
      .image(0.5 * width, 0.5 * height, TextureKeys.GameOverScreen)
      .setOrigin(0.5, 0.5)
      .setSize(width, height);
    const gameOverSound = this.sound.add(AudioKeys.GameOver);

    gameOverSound.play();
  }
}
