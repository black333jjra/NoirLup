import os
from datetime import datetime
import xml.etree.ElementTree as ET

# Ruta del proyecto
carpeta_html = "./NoirLup"
archivo_sitemap = "sitemap.xml"
url_base = "https://black333jjra.github.io/NoirLup/"

# Cargar el sitemap existente
tree = ET.parse(archivo_sitemap)
root = tree.getroot()

# Namespace XML
ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
ET.register_namespace('', ns['ns'])

# Recorrer cada <url> del sitemap
for url in root.findall('ns:url', ns):
    loc = url.find('ns:loc', ns).text
    archivo = loc.replace(url_base, '')
    ruta_archivo = os.path.join(carpeta_html, archivo)

    if os.path.isfile(ruta_archivo):
        # Obtener fecha de modificación
        timestamp = os.path.getmtime(ruta_archivo)
        fecha_mod = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')

        # Buscar o crear <lastmod>
        lastmod = url.find('ns:lastmod', ns)
        if lastmod is None:
            lastmod = ET.SubElement(url, '{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod')
        lastmod.text = fecha_mod
        print(f"Actualizado {archivo} → {fecha_mod}")
    else:
        print(f"⚠️ No encontrado: {archivo}")

# Guardar cambios en sitemap.xml
tree.write(archivo_sitemap, encoding='utf-8', xml_declaration=True)
print("✅ Sitemap actualizado.")
