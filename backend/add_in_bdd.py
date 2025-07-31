import requests
from bs4 import BeautifulSoup
import csv
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import re
import sys



#845091
#NEM2403SEEC
#7848298
#150001000

def produit_existe(ref_fab, fichier='produits.csv'):
    if not os.path.isfile(fichier):
        return False
    with open(fichier, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for ligne in reader:
            if ligne["référence_fabricant"] == ref_fab:
                return True
    return False

def sauvegarder_produit_csv(data, fichier='produits.csv'):
    fieldnames = ["référence_fabricant", "nom_produit", "url_produit_rexel", "image_produit_rexel", 
                  "url_produit_sonepar", "image_produit_sonepar", "url_produit_yesss", "image_produit_yesss"]
    file_exists = os.path.isfile(fichier)
    with open(fichier, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)

def extraire_images_json_ld(soup):
    images = []
    scripts = soup.find_all("script", type="application/ld+json")
    for script in scripts:
        try:
            data_json = json.loads(script.string)
            if isinstance(data_json, list):
                for item in data_json:
                    images.extend(trouver_images_recursif(item))
            else:
                images.extend(trouver_images_recursif(data_json))
        except Exception:
            pass
    return images

def trouver_images_recursif(obj):
    images = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k.lower() == "image":
                if isinstance(v, list):
                    images.extend(v)
                elif isinstance(v, str):
                    images.append(v)
            elif isinstance(v, (dict, list)):
                images.extend(trouver_images_recursif(v))
    elif isinstance(obj, list):
        for item in obj:
            images.extend(trouver_images_recursif(item))
    return images

def extraire_image_rexel(soup):
    div_active = soup.select_one('.carousel-item.active')
    if div_active:
        zoomurl = div_active.get('data-zoomurl')
        if zoomurl:
            return zoomurl
        img = div_active.find('img')
        if img:
            data_src = img.get('data-src')
            if data_src and not data_src.startswith('data:image/gif;base64'):
                return data_src
            src = img.get('src')
            if src and not src.startswith('data:image/gif;base64'):
                return src
    return None

def rechercher_produit_rexel(ref_fab):
    url_rexel = f"https://www.rexel.fr/frx/search?text={ref_fab}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url_rexel, headers=headers)
    if response.status_code != 200:
        return None
    soup = BeautifulSoup(response.text, "html.parser")

    # Si on est sur une page produit directe
    if "/p/" in response.url:
        nom_tag = soup.find("h1")
        nom_produit = nom_tag.get_text(strip=True) if nom_tag else "Nom inconnu"

        ref_fab_extraite = ref_fab
        details = soup.find_all("div", class_="col-12 col-lg-6 product-detail-list-item")
        for detail in details:
            label = detail.find("span", class_="product-detail-label")
            value = detail.find("span", class_="product-detail-value")
            if label and value and "Réf Fab" in label.get_text():
                ref_fab_extraite = value.get_text(strip=True)
                break

        image_url = extraire_image_rexel(soup)

        if not image_url:
            meta_og = soup.find("meta", property="og:image")
            if meta_og and meta_og.get("content"):
                image_url = meta_og["content"]

        if not image_url:
            images_json_ld = extraire_images_json_ld(soup)
            if images_json_ld:
                image_url = images_json_ld[0]

        if not image_url:
            candidates = soup.find_all("img")
            max_area = 0
            best_img = None
            for img in candidates:
                try:
                    width = int(img.get("width") or 0)
                    height = int(img.get("height") or 0)
                    area = width * height
                    if area > max_area:
                        max_area = area
                        best_img = img
                except Exception:
                    continue
            if best_img and best_img.get("src"):
                image_url = best_img["src"]

        if image_url and not image_url.startswith("http"):
            image_url = "https://www.rexel.fr" + image_url

        return {
            "référence_fabricant": ref_fab_extraite,
            "nom_produit": nom_produit,
            "url_produit": response.url,
            "image_produit": image_url or ""
        }

    # Sinon page liste produits
    produits = soup.find_all("div", class_="card h-100 mb-0 p-3")
    for produit in produits:
        a_tag = produit.find("a", class_="primary-link")
        if not a_tag:
            continue
        nom = a_tag.get_text(strip=True)
        url_produit = "https://www.rexel.fr" + a_tag.get("href")
        ref_span = produit.find("span", string=lambda text: text and "Réf Fab" in text)
        if ref_span:
            texte_ref = ref_span.parent.get_text(strip=True)
            if ref_fab in texte_ref:
                img_tag = produit.find("img", class_="product-img")
                url_image = img_tag.get("src") if img_tag else ""
                if url_image and not url_image.startswith("http"):
                    url_image = "https://www.rexel.fr" + url_image
                return {
                    "référence_fabricant": ref_fab,
                    "nom_produit": nom,
                    "url_produit": url_produit,
                    "image_produit": url_image or ""
                }
    return None

def rechercher_produit_sonepar(ref_fab):
    search_url = f"https://www.sonepar.fr/catalog/fr-fr/search/{ref_fab}"

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--lang=fr-FR")
    options.add_argument("--user-agent=Mozilla/5.0")

    driver = webdriver.Chrome(options=options)
    driver.get(search_url)
    time.sleep(4)

    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    driver.quit()

    scripts = soup.find_all("script")

    for script in scripts:
        if script.string and "window.dataLayer.push" in script.string:
            try:
                start = script.string.find("window.dataLayer.push(") + len("window.dataLayer.push(")
                end = script.string.rfind(")")
                json_str = script.string[start:end]
                data = json.loads(json_str)
                items = data.get("ecommerce", {}).get("items", [])

                for item in items:
                    if ref_fab in item.get("item_id", "") or ref_fab in item.get("item_category_label", ""):
                        item_id = item.get("item_id")
                        if not item_id:
                            continue

                        produit_url = f"https://www.sonepar.fr/catalog/fr-fr/products/{item_id}"
                        driver = webdriver.Chrome(options=options)
                        driver.get(produit_url)
                        time.sleep(3)
                        produit_html = driver.page_source
                        produit_soup = BeautifulSoup(produit_html, "html.parser")
                        driver.quit()

                        h1 = produit_soup.find("h1")
                        nom = h1.get_text(strip=True) if h1 else item.get("item_name", "Nom inconnu")

                        image = ""
                        meta_img = produit_soup.find("meta", property="og:image")
                        if meta_img and meta_img.get("content"):
                            image = meta_img["content"]

                        if not image:
                            scripts_ld = produit_soup.find_all("script", type="application/ld+json")
                            for script_ld in scripts_ld:
                                try:
                                    data_json = json.loads(script_ld.string)
                                    if isinstance(data_json, dict) and "image" in data_json:
                                        if isinstance(data_json["image"], list):
                                            image = data_json["image"][0]
                                        elif isinstance(data_json["image"], str):
                                            image = data_json["image"]
                                        if image:
                                            break
                                except Exception:
                                    pass

                        if not image:
                            imgs = produit_soup.find_all("img")
                            for img in imgs:
                                src = img.get("src") or img.get("data-src")
                                if src and not src.startswith("data:image") and "placeholder" not in src:
                                    image = src
                                    break

                        if image and not image.startswith("http"):
                            image = "https://www.sonepar.fr" + image

                        return {
                            "référence_fabricant": ref_fab,
                            "nom_produit": nom,
                            "url_produit": produit_url,
                            "image_produit": image or ""
                        }
            except Exception as e:
                print(f"❌ Erreur JSON: {e}")
                return None
    return None

def rechercher_produit_yesss(ref_fab):
    import requests
    from bs4 import BeautifulSoup
    import json

    base_url = "https://www.yesss-fr.com"
    search_url = f"{base_url}/recherche/landing?term={ref_fab}"
    headers = {"User-Agent": "Mozilla/5.0"}
    session = requests.Session()
    response = session.get(search_url, headers=headers)

    if response.status_code != 200:
        print(f"Erreur HTTP {response.status_code} pour Yesss")
        return None

    final_url = response.url
    soup = BeautifulSoup(response.text, "html.parser")

    def extraire_infos_depuis_page(soup_page, url_page):
        nom_tag = soup_page.find("h1")
        nom_produit = nom_tag.get_text(strip=True) if nom_tag else "Nom inconnu"

        # Étape 1 : image dans <img class="imgDetailProduit">
        img_tag = soup_page.find("img", class_="imgDetailProduit")
        if img_tag and img_tag.get("src"):
            src = img_tag["src"]
            image_url = src if src.startswith("http") else base_url + src
        else:
            # Étape 2 : image via og:image
            meta_og = soup_page.find("meta", property="og:image")
            image_url = meta_og["content"] if meta_og and meta_og.get("content") else None
            if image_url and not image_url.startswith("http"):
                image_url = base_url + image_url

            # Étape 3 : fallback sur autre image
            if not image_url or "YESSS-Electrique.png" in image_url:
                img_alt = soup_page.find("img", class_="product-image") or soup_page.find("img")
                if img_alt and img_alt.get("src"):
                    src = img_alt["src"]
                    image_url = src if src.startswith("http") else base_url + src

        return {
            "référence_fabricant": ref_fab,
            "nom_produit": nom_produit,
            "url_produit": url_page,
            "image_produit": image_url or ""
        }

    # ✅ Cas 1 : redirection directe vers fiche produit
    if any(x in final_url for x in ["/fiche/", "/fiche-pdt/", "/produit/"]):
        return extraire_infos_depuis_page(soup, final_url)

    # 🔍 Cas 2 : JSON embed dans page résultats
    scripts = soup.find_all("script", type="application/json")
    products_data = None
    for script in scripts:
        try:
            data_json = json.loads(script.string)
            if isinstance(data_json, dict) and "products" in data_json:
                products_data = data_json["products"]
                break
        except Exception:
            continue

    # Si JSON absent, on essaie de choper un lien produit HTML
    if not products_data:
        a_tags = soup.find_all("a", href=True)
        for a in a_tags:
            href = a["href"]
            if any(x in href for x in ["/fiche/", "/fiche-pdt/", "/produit/"]):
                produit_url = href if href.startswith("http") else base_url + href
                resp_produit = session.get(produit_url, headers=headers)
                if resp_produit.status_code != 200:
                    continue
                soup_prod = BeautifulSoup(resp_produit.text, "html.parser")
                return extraire_infos_depuis_page(soup_prod, produit_url)

        print("❌ Pas de liste de produits JSON trouvée et aucun lien produit détecté.")
        return None

    # Cas 3 : JSON avec liste produits → suivre l’URL du premier produit
    premier_produit = products_data[0]
    url_produit = premier_produit.get("url")
    if url_produit and not url_produit.startswith("http"):
        url_produit = base_url + url_produit

    resp_produit = session.get(url_produit, headers=headers)
    if resp_produit.status_code != 200:
        print(f"Erreur HTTP {resp_produit.status_code} sur page produit Yesss")
        return None

    soup_produit = BeautifulSoup(resp_produit.text, "html.parser")
    return extraire_infos_depuis_page(soup_produit, url_produit)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Aucune référence fabricant fournie."}))
        sys.exit(1)

    ref_fab = sys.argv[1].strip()

    if not ref_fab:
        print(json.dumps({"error": "Référence fabricant vide."}))
        sys.exit(1)

    if produit_existe(ref_fab):
        # On retourne le produit existant depuis produits.csv
        # (tu peux adapter si tu as une fonction pour ça)
        print(json.dumps([{"référence_fabricant": ref_fab, "message": "déjà présent"}]))
        sys.exit(0)

    rexel = rechercher_produit_rexel(ref_fab)
    sonepar = rechercher_produit_sonepar(ref_fab)
    yesss = rechercher_produit_yesss(ref_fab)

    nom_produit = (
        (rexel and rexel.get("nom_produit")) or
        (sonepar and sonepar.get("nom_produit")) or
        (yesss and yesss.get("nom_produit")) or
        "Nom inconnu"
    )

    data = {
        "référence_fabricant": ref_fab,
        "nom_produit": nom_produit,
        "url_produit_rexel": rexel.get("url_produit") if rexel else "",
        "image_produit_rexel": rexel.get("image_produit") if rexel else "",
        "url_produit_sonepar": sonepar.get("url_produit") if sonepar else "",
        "image_produit_sonepar": sonepar.get("image_produit") if sonepar else "",
        "url_produit_yesss": yesss.get("url_produit") if yesss else "",
        "image_produit_yesss": yesss.get("image_produit") if yesss else ""
    }

    if rexel or sonepar or yesss:
        sauvegarder_produit_csv(data)
        print(json.dumps([data]))  # IMPORTANT : une liste car React s’attend à une liste d’objets
        sys.exit(0)
    else:
        print(json.dumps([]))  # Produit non trouvé
        sys.exit(1)