#!/usr/bin/env bash
set -euo pipefail

FF="$(node -e "process.stdout.write(require('ffmpeg-static'))")"
OUT="public/media/reference-videos"
TMP="/tmp/mlzidla-reference-videos"
mkdir -p "$OUT" "$TMP"

fetch() {
  local url="$1" out="$2"
  curl -L --fail --retry 2 --connect-timeout 20 --silent --show-error "$url" -o "$out"
}

hero_image() {
  local slug="$1" url="$2"
  fetch "$url" "$TMP/${slug}-hero-source"
  "$FF" -y -loop 1 -i "$TMP/${slug}-hero-source" \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='1.0+0.035*sin(2*PI*on/210)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=210:s=1920x1080:fps=30,format=yuv420p" \
    -t 7 -an -c:v libx264 -preset fast -crf 24 -movflags +faststart "$OUT/${slug}-hero.mp4"
}

hero_video() {
  local slug="$1" url="$2"
  fetch "$url" "$TMP/${slug}-hero-video"
  "$FF" -y -stream_loop -1 -i "$TMP/${slug}-hero-video" -t 7 \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p" \
    -an -c:v libx264 -preset fast -crf 24 -movflags +faststart "$OUT/${slug}-hero.mp4"
}

content_video() {
  local slug="$1" url="$2"
  fetch "$url" "$TMP/${slug}-content-video"
  "$FF" -y -stream_loop -1 -i "$TMP/${slug}-content-video" -t 16 \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p" \
    -an -c:v libx264 -preset fast -crf 23 -movflags +faststart "$OUT/${slug}-content.mp4"
}

montage() {
  local slug="$1"; shift
  local urls=("$@")
  local inputs=()
  local filters=()
  local i=0
  for url in "${urls[@]}"; do
    local src="$TMP/${slug}-${i}.img"
    fetch "$url" "$src"
    inputs+=( -loop 1 -t 3 -i "$src" )
    filters+=( "[$i:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.00045,1.045)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=90:s=1920x1080:fps=30,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v$i]" )
    i=$((i+1))
  done

  if [ "$i" -eq 1 ]; then
    "$FF" -y "${inputs[@]}" -filter_complex "${filters[0]}" -map '[v0]' -t 12 -an -c:v libx264 -preset fast -crf 23 -movflags +faststart "$OUT/${slug}-content.mp4"
    return
  fi

  local chain="$(IFS=';'; echo "${filters[*]}")"
  local prev="v0"
  local n=1
  while [ "$n" -lt "$i" ]; do
    local out="x$n"
    local offset
    offset=$(awk "BEGIN { printf \"%.1f\", 2.6 * $n }")
    chain+=";[$prev][v$n]xfade=transition=fade:duration=0.4:offset=$offset[$out]"
    prev="$out"
    n=$((n+1))
  done
  "$FF" -y "${inputs[@]}" -filter_complex "$chain" -map "[$prev]" -an -c:v libx264 -preset fast -crf 23 -movflags +faststart "$OUT/${slug}-content.mp4"
}

# BENDY · Jičín — reálné video
hero_video "bendy-jicin" "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/52aaab936_MLzitko-bendy-jicin.mp4"
content_video "bendy-jicin" "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/52aaab936_MLzitko-bendy-jicin.mp4"

# MRAK · soukromá zahrada — reálné video
hero_video "mrak-zahrada" "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/8bd5e5706_mlzitkovakci-mrak.mp4"
content_video "mrak-zahrada" "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/99fef4145_mlzitkomrak-oblakvakci.mp4"

# GATE — fotografický motion case study
hero_image "gate-mesto" "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/cfb270d5c_Mlnbranyaportaly.jpg"
montage "gate-mesto" \
  "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/cfb270d5c_Mlnbranyaportaly.jpg" \
  "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f685a91da_mlnbrnyaportaly-mlzidla.jpg"

# MŠ Šiškova
hero_image "mrak-ms-siskova" "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/be769d5c0_mlzitko-aura-pro-materskou-skolku.jpeg"
montage "mrak-ms-siskova" "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/be769d5c0_mlzitko-aura-pro-materskou-skolku.jpeg"

# AURA · Palata
hero_image "aura-palata" "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/bb8adc608_aura-mlzitkodomov-senioru.jpeg"
montage "aura-palata" "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/bb8adc608_aura-mlzitkodomov-senioru.jpeg"

# Polná · MRKEV — realizace + render + výkres
hero_image "mrkev-polna" "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a220ebf9_Reference-mstoPolna03.png"
montage "mrkev-polna" \
  "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a220ebf9_Reference-mstoPolna03.png" \
  "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/596fefdec_MlnsochaMRKEV-mstoPoln.jpg" \
  "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/099945d1d_MltkoMRKEV-mestopolna.jpg" \
  "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c3535394a_mlzitko-MRKEV_render.png" \
  "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2dcd39f66_MRKEV_rozkres1.png"

# ZOO Praha — reálné fotografie z instalace
hero_image "zoo-praha" "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/3824f85eb_1000005519.jpg"
montage "zoo-praha" \
  "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/3824f85eb_1000005519.jpg" \
  "https://lh3.googleusercontent.com/d/1PSs-lVCOPnP-faNmq3C6vz26F2_xZepq" \
  "https://lh3.googleusercontent.com/d/1HNWWBRYt6R7YEBDRjEmI8muYLtveAKlr" \
  "https://lh3.googleusercontent.com/d/1SfcCY59VFdpZ8Dxsumshwch1C4Ytrtb_" \
  "https://lh3.googleusercontent.com/d/1hColZfc2D4iDilwZsB1rK2a9S8oKTtBK"

ls -lh "$OUT"/*.mp4
