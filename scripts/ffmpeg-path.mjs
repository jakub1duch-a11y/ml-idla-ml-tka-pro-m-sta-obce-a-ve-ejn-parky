import staticFfmpegPath from 'ffmpeg-static';

// Prefer the bundled binary so clean CI/Base44 builds do not depend on system packages.
// FFMPEG_PATH remains an explicit override for controlled build environments.
export const ffmpegPath = process.env.FFMPEG_PATH || staticFfmpegPath || 'ffmpeg';
