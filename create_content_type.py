import os
import shutil
import json
import sys
import inflect

p = inflect.engine()

def create_content_type(content_type):
    content_types = p.plural(content_type)

    langs = ["ja","en"]
    html_template_path = "/includes/contents-list-page"
    for lang in langs:
        # create directory
        os.makedirs(f"/{lang}/{content_type}}", exist_ok=True)

        # create and edit html
        dest_path = "/{lang}/{content_types}.html"
        replacements = {
            "{{content_types}}" : content_types
        }
        copy_and_edit_html(html_template_path, dest_path, replacements)

        #
    json_template_path = "/data/contents_list/template.json"
    json_dest_path = f"/data/contents_list/{content-types}.json"
    copy_and_edit_json(json_template_path, json_dest_path)
    

def copy_and_edit_html(template_path, dest_path, replacements):
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for key, value in replacements.items():
        content = content.replace(key, value)

    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)

def copy_and_edit_json(template_path, dest_path, replacements):
    with open(template_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for key, value in replacements.items():
        data[key] = value  # 単純なkey-valueの置換

    with open(dest_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def edit_existing_json(json_path, updates):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for key, value in updates.items():
        data[key] = value

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
