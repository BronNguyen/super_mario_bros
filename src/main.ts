import Phaser from 'phaser';
import GameOver from './scenes/GameOver';
import Preloader from './scenes/Preloader';
import Stage1 from './scenes/stage1';


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		},
	},
	transparent: false,
	scene: [Preloader, Stage1,GameOver]
}

export default new Phaser.Game(config)
