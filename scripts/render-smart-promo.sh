#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -filter_complex_threads 1 \
  -f lavfi -i 'color=c=0xf3f8f7:s=1280x720:r=30:d=13' \
  -loop 1 -i public/media/smart-cabinet-cutout.webp \
  -loop 1 -i public/media/smart-service-cutout.webp \
  -filter_complex "
  [0:v]drawgrid=w=80:h=80:t=1:c=0x0e5b67@0.07,
  drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='MLŽIDLA.cz':x=60:y=54:fontsize=22:fontcolor=0x0d2d38,
  drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='Chytré řízení.':x=60:y=175:fontsize=40:fontcolor=0x0d2d38,
  drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='Pohodlí na dosah.':x=60:y=231:fontsize=30:fontcolor=0x0e5b67,
  drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='Ovládání z telefonu':x=60:y=350:fontsize=20:fontcolor=0x405b63:enable='lt(t,6)',
  drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='Přehledný servisní přístup':x=60:y=350:fontsize=20:fontcolor=0x405b63:enable='gte(t,6)',
  drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='Ilustrační sestava / výbava podle projektu':x=60:y=656:fontsize=14:fontcolor=0x405b63[bg];
  [1:v]scale=770:-1,format=rgba,fade=t=in:st=0:d=0.8:alpha=1,fade=t=out:st=5.3:d=0.7:alpha=1[cab];
  [2:v]scale=800:-1,format=rgba,fade=t=in:st=5.5:d=0.8:alpha=1,fade=t=out:st=11.4:d=0.6:alpha=1[box];
  [bg][cab]overlay=x='465+8*sin(t/2)':y='136-5*sin(t/2)':shortest=1[a];
  [a][box]overlay=x='455-8*sin(t/2)':y='108+5*sin(t/2)':shortest=1,
  fade=t=in:st=0:d=0.5,fade=t=out:st=11.6:d=0.4,format=yuv420p[v]" \
  -map '[v]' -t 12 -an -c:v libx264 -crf 21 -preset medium -movflags +faststart public/media/smart-promo-2026.mp4
ffmpeg -y -ss 2 -i public/media/smart-promo-2026.mp4 -frames:v 1 /tmp/smart-promo-poster.png
node -e "require('sharp')('/tmp/smart-promo-poster.png').webp({quality:88}).toFile('public/media/smart-promo-poster.webp')"
