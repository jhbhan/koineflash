import { Audio } from 'expo-audio';

// Verified sound URLs from SoundJay
const CORRECT_SOUND_URI = 'https://www.soundjay.com/buttons/button-3.mp3';
const INCORRECT_SOUND_URI = 'https://www.soundjay.com/buttons/button-10.mp3';

let correctPlayer: any = null;
let incorrectPlayer: any = null;

function getCorrectPlayer() {
  if (!correctPlayer) {
    correctPlayer = Audio.createAudioPlayer(CORRECT_SOUND_URI);
  }
  return correctPlayer;
}

function getIncorrectPlayer() {
  if (!incorrectPlayer) {
    incorrectPlayer = Audio.createAudioPlayer(INCORRECT_SOUND_URI);
  }
  return incorrectPlayer;
}

export async function playCorrectSound() {
  try {
    const player = getCorrectPlayer();
    player.play();
  } catch (e) {
    console.log('Error playing correct sound', e);
  }
}

export async function playIncorrectSound() {
  try {
    const player = getIncorrectPlayer();
    player.play();
  } catch (e) {
    console.log('Error playing incorrect sound', e);
  }
}

export function unloadSounds() {
  correctPlayer = null;
  incorrectPlayer = null;
}
