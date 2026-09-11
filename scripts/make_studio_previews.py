from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw
import requests, io, sys

ITEMS = {
    'bendy':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/1b393ddd5_file_00000000256881f595029a892ebe07b3.png',
    'bendy-radius-s':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/69c22b375_file_00000000fb4c82469c90ac7d4b9f81c9.png',
    'bendy-radius-m':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/b6fd0b135_file_00000000ede481f4914fb4d80c173604.png',
    'bendy-radius-l':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e32805e09_file_0000000019e48243bd5b212e3c4562a3.png',
    'bendy-field':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/ff706f45e_file_000000004b8081f5bb89dbb5b43664b5.png',
    'aura-garden':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8cb34e2c3_generated_image.png',
    'linea-ce':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4a183deae_generated_image.png',
    'linea-gate':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ab84deeba_generated_image.png',
    'linea-avenue':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e3e9b011c_generated_image.png',
    'y-armist-tr60':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png',
    'y-armist-j70':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/93cd8ff63_MlzitkoY-ARMISTJ70_2.png',
    'steblo':'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/486dbd1bb_mlzitko-steblo-katalog2.png',
    'gate':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bec7f86a9_generated_image.png',
    'mrak':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ef3414919_generated_image.png',
    'spirala':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6ce3864ad_generated_image.png',
    'mrkev':'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c3535394a_mlzitko-MRKEV_render.png',
    'teepee':'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/ebbd577b1_07_teepee_brno_portrait.jpg'
}

OUTDIR = Path('public/media/studio')
OUTDIR.mkdir(parents=True, exist_ok=True)
W, H = 1200, 1500


def studio_canvas():
    bg = Image.new('RGB', (W, H))
    p = bg.load()
    for y in range(H):
        t = y / max(H - 1, 1)
        r = int(249 - 9 * t)
        g = min(255, r + 2)
        b = min(255, r + 5)
        for x in range(W):
            p[x, y] = (r, g, b)
    return bg.convert('RGBA')

for slug, url in ITEMS.items():
    try:
        resp = requests.get(url, timeout=35)
        resp.raise_for_status()
        src = Image.open(io.BytesIO(resp.content)).convert('RGBA')
        bbox = src.getbbox()
        if bbox:
            src = src.crop(bbox)
        maxw, maxh = int(W * 0.74), int(H * 0.76)
        scale = min(maxw / src.width, maxh / src.height)
        nw, nh = max(1, int(src.width * scale)), max(1, int(src.height * scale))
        src = src.resize((nw, nh), Image.Resampling.LANCZOS)

        bg = studio_canvas()
        shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(shadow)
        sx, sy = W // 2, H - int(H * 0.105)
        d.ellipse((sx - int(nw * 0.25), sy - 24, sx + int(nw * 0.25), sy + 24), fill=(20, 38, 50, 30))
        shadow = shadow.filter(ImageFilter.GaussianBlur(18))
        bg = Image.alpha_composite(bg, shadow)

        x = (W - nw) // 2
        y = H - nh - int(H * 0.08)
        bg.alpha_composite(src, (x, y))
        out = OUTDIR / f'{slug}-studio.webp'
        bg.convert('RGB').save(out, 'WEBP', quality=92, method=6)
        print(f'OK {slug} {out}')
    except Exception as exc:
        print(f'ERR {slug}: {exc}', file=sys.stderr)
