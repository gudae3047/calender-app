from PIL import Image, ImageDraw, ImageFont
import os

sizes = [72, 192, 512]

for size in sizes:
    img = Image.new('RGBA', (size, size), (10, 10, 15, 255))
    draw = ImageDraw.Draw(img)

    # Background rounded rect (simulate with circle fill)
    margin = int(size * 0.08)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=int(size * 0.22),
        fill=(124, 111, 247, 255)
    )

    # Calendar icon lines
    cx = size // 2
    cy = size // 2
    s = int(size * 0.28)
    lw = max(2, size // 48)

    # Calendar body
    draw.rounded_rectangle(
        [cx - s, cy - s + int(s*0.15), cx + s, cy + s],
        radius=int(size * 0.05),
        outline=(255, 255, 255, 255),
        width=lw,
        fill=(255, 255, 255, 30)
    )

    # Header bar
    draw.rounded_rectangle(
        [cx - s, cy - s + int(s*0.15), cx + s, cy - s + int(s*0.6)],
        radius=int(size * 0.05),
        fill=(255, 255, 255, 200)
    )

    # Grid dots
    dot_r = max(1, size // 64)
    for row in range(2):
        for col in range(3):
            dx = cx - int(s * 0.55) + col * int(s * 0.55)
            dy = cy + int(s * 0.1) + row * int(s * 0.45)
            draw.ellipse([dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r],
                         fill=(255, 255, 255, 200))

    img.save(f'icon-{size}.png')
    print(f'Created icon-{size}.png')
