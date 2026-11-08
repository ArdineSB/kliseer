"""Create Office-compatible static Inter instances; requires fonttools 4.61.1."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

fonts = Path(__file__).resolve().parents[2] / 'design' / 'fonts'
for style, weight in [('Regular', 400), ('Bold', 700)]:
    source = TTFont(fonts / 'Inter-Variable.ttf')
    font = instantiateVariableFont(source, {'opsz': 14, 'wght': weight}, inplace=True)
    # A distinct family avoids collisions with installed variable Inter versions.
    names = {
        1: 'Inter Presentation', 2: style,
        4: f'Inter Presentation {style}',
        6: f'InterPresentation-{style}',
        16: 'Inter Presentation', 17: style,
    }
    for record in font['name'].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    for name_id, value in names.items():
        font['name'].setName(value, name_id, 3, 1, 0x409)
    font['OS/2'].usWeightClass = weight
    font['OS/2'].fsSelection = (font['OS/2'].fsSelection & ~0x61) | (0x20 if weight == 700 else 0x40)
    font['head'].macStyle = (font['head'].macStyle & ~3) | (1 if weight == 700 else 0)
    destination = fonts / f'InterPresentation-{style}.ttf'
    font.save(destination)
    print(f'{destination.name}: weight {weight}, embedding flags {font["OS/2"].fsType}')
