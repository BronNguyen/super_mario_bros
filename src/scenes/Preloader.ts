import Phaser from "phaser";
import AnimationKeys from "~/const/AnimationKeys";
import AudioKeys from "~/const/AudioKeys";
import MapKeys from "~/const/MapKeys";
import SceneKeys from "~/const/SceneKeys";
import TextureKeys from "~/const/TextureKeys";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    this.load.image(TextureKeys.GameOverScreen, "sprites/GameoverSMB.png");
    this.load.image(TextureKeys.TileSet, "tiles/tileset.png");
    this.load.tilemapTiledJSON(MapKeys.stage1, "tileset/stage1.json");

    this.load.spritesheet(TextureKeys.Mario, "sprites/mario_animation.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet(TextureKeys.BigMario, "sprites/grown-mario.png", {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.spritesheet(TextureKeys.Goomba, "sprites/goomba.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet(TextureKeys.Koopa, "sprites/koopa.png", {
      frameWidth: 25,
      frameHeight: 25,
    });

    this.load.spritesheet(TextureKeys.Mushroom, "sprites/mushroom.png", {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.audio(AudioKeys.Jump, "sounds/smb_jump-small.wav");
    this.load.audio(AudioKeys.BigJump, "sounds/smb_jump-super.wav");
    this.load.audio(AudioKeys.Bump, "sounds/smb_bump.wav");
    this.load.audio(AudioKeys.BreakBlock, "sounds/smb_breakblock.wav");
    this.load.audio(AudioKeys.GameOver, "sounds/smb_gameover.wav");
    this.load.audio(AudioKeys.MarioDie, "sounds/smb_mariodie.wav");
    this.load.audio(AudioKeys.Kick, "sounds/smb_kick.wav");
    this.load.audio(AudioKeys.Stomp, "sounds/smb_stomp.wav");
    this.load.audio(AudioKeys.Theme, "sounds/theme-song.mp3");
    this.load.audio(AudioKeys.Coin, "sounds/smb_coin.wav");
    this.load.audio(AudioKeys.Mushroom, "sounds/smb_powerup_appears.wav");
    this.load.audio(AudioKeys.GetBig, "sounds/smb_powerup.wav");
  }

  create() {

    this.anims.create({
      key: AnimationKeys.MarioWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.Mario, {
        frames: [5, 3, 4, 3],
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: AnimationKeys.MarioIdle,
      frames: this.anims.generateFrameNumbers(TextureKeys.Mario, {
        frames: [0],
      }),
    });

    this.anims.create({
      key: AnimationKeys.MarioJump,
      frames: this.anims.generateFrameNumbers(TextureKeys.Mario, {
        frames: [6],
      }),
    });

    this.anims.create({
      key: AnimationKeys.BigMarioWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.BigMario, {
        frames: [5, 3, 4, 3],
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: AnimationKeys.BigMarioIdle,
      frames: this.anims.generateFrameNumbers(TextureKeys.BigMario, {
        frames: [1],
      }),
    });

    this.anims.create({
      key: AnimationKeys.BigMarioJump,
      frames: this.anims.generateFrameNumbers(TextureKeys.BigMario, {
        frames: [6],
      }),
    });

    this.anims.create({
      key: AnimationKeys.BigMarioDuck,
      frames: this.anims.generateFrameNumbers(TextureKeys.BigMario, {
        frames: [0],
      }),
    });

    this.anims.create({
      key: AnimationKeys.MarioDead,
      frames: this.anims.generateFrameNumbers(TextureKeys.Mario, {
        frames: [1],
      }),
    });

    this.anims.create({
      key: AnimationKeys.GoombaWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.Goomba, {
        frames: [0, 1],
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: AnimationKeys.GoombaDead,
      frames: this.anims.generateFrameNumbers(TextureKeys.Goomba, {
        frames: [2],
      }),
    });

    this.anims.create({
      key: AnimationKeys.KoopaWalk,
      frames: this.anims.generateFrameNumbers(TextureKeys.Koopa, {
        frames: [0, 1],
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: AnimationKeys.KoopaCaveIn,
      frames: this.anims.generateFrameNumbers(TextureKeys.Koopa, {
        frames: [3],
      }),
    });

    this.anims.create({
      key: AnimationKeys.KoopaCaveOut,
      frames: this.anims.generateFrameNumbers(TextureKeys.Koopa, {
        frames: [2],
      }),
    });

    this.scene.start(SceneKeys.Stage1);
  }
}
